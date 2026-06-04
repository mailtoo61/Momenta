import {
  bootstrapPersistence,
  dataFailure,
  mapPersistenceErrorToAppError,
  resolvePersistenceMode,
  type PersistenceBootstrapInput,
  type PersistenceMode
} from "../../data";
import { openMomentaDatabase } from "../../data/sqlite/database";
import type { ResolvedRepositories } from "../../data/repositories";
import { providerRegistry } from "../../platform/providerRegistry";
import { appConfig, environmentManager, type AppEnvironment } from "../../shared/config";
import { createAppError, mapUnknownError, type AppError } from "../../shared/errors";
import { defaultFeatureFlags } from "../../shared/featureFlags";
import { initI18n } from "../../shared/i18n";
import { logger } from "../../shared/logger";
import { createServiceContainer, type ServiceContainer } from "../../services";

export type AppBootstrapContext = Readonly<{
  appName: string;
  environment: AppEnvironment;
  locale: string;
  featureFlags: typeof defaultFeatureFlags;
  persistenceMode: PersistenceMode;
  repositories: ResolvedRepositories;
  services: ServiceContainer;
  providerRegistryHealth: Readonly<Record<string, string>>;
  bootstrappedAt: string;
}>;

export type AppBootstrapResult = AppBootstrapContext;

export type SafeAppBootstrapResult =
  | {
      isSuccessful: true;
      result: AppBootstrapContext;
    }
  | {
      isSuccessful: false;
      error: AppError;
      persistenceMode: PersistenceMode | null;
    };

export type AppBootstrapInput = Readonly<{
  environment?: AppEnvironment;
  persistenceModeOverride?: PersistenceMode;
  allowInMemoryFallbackOnPersistenceFailure?: boolean;
  persistenceBootstrap?: (
    input: PersistenceBootstrapInput
  ) => ReturnType<typeof bootstrapPersistence>;
  nowIso?: () => string;
}>;

let isBootstrapped = false;

export async function appBootstrap(input: AppBootstrapInput = {}): Promise<AppBootstrapContext> {
  const environment = input.environment ?? environmentManager.current;
  const nowIso = input.nowIso ?? (() => new Date().toISOString());
  const selectedPersistenceMode = resolvePersistenceMode({
    environment,
    override: input.persistenceModeOverride
  });
  const allowFallback =
    input.allowInMemoryFallbackOnPersistenceFailure ??
    appConfig.storage.allowInMemoryFallbackOnPersistenceFailureByEnvironment[environment];
  const persistenceBootstrap = input.persistenceBootstrap ?? bootstrapPersistence;

  logger.info("Application bootstrap started", {
    module: "app.bootstrap",
    operation: "app_bootstrap_started",
    metadata: {
      environment,
      persistenceMode: selectedPersistenceMode
    }
  });

  if (!appConfig.appName) {
    throw createAppError({
      code: "CONFIG_ERROR",
      developerMessage: "Application name is missing during bootstrap."
    });
  }

  const i18nState = initI18n(appConfig.defaultLocale);
  logger.info("Persistence mode selected", {
    module: "app.bootstrap",
    operation: "persistence_mode_selected",
    metadata: {
      environment,
      persistenceMode: selectedPersistenceMode,
      fallbackEnabled: allowFallback
    }
  });

  const persistenceResult = await persistenceBootstrap({
    environment,
    modeOverride: selectedPersistenceMode,
    openSqliteDatabase: () =>
      openMomentaDatabase({
        logger: {
          log: (level, message, context) =>
            logger[level](message, {
              module: "data.sqlite",
              operation: "sqlite_bootstrap",
              metadata: context
            })
        }
      })
  });
  const resolvedPersistence = persistenceResult.isSuccess
    ? persistenceResult
    : await maybeFallbackToInMemory({
        environment,
        selectedPersistenceMode,
        allowFallback,
        persistenceBootstrap,
        originalFailure: persistenceResult.error
      });

  if (!resolvedPersistence.isSuccess) {
    logger.error("Persistence bootstrap failed", {
      module: "app.bootstrap",
      operation: "persistence_bootstrap_failed",
      metadata: {
        environment,
        persistenceMode: selectedPersistenceMode,
        errorCode: resolvedPersistence.error.code
      }
    });

    throw mapPersistenceErrorToAppError(resolvedPersistence.error);
  }

  logger.info("Persistence bootstrap succeeded", {
    module: "app.bootstrap",
    operation: "persistence_bootstrap_succeeded",
    metadata: {
      environment,
      persistenceMode: resolvedPersistence.value.mode
    }
  });

  const services = createServiceContainer({
    repositories: resolvedPersistence.value.repositories,
    analyticsProvider: providerRegistry.analyticsProvider,
    notificationProvider: providerRegistry.notificationProvider,
    widgetProvider: providerRegistry.widgetProvider,
    logger: {
      log: (level, message, context) => logger[level](message, context)
    }
  });

  logger.info("Service container ready", {
    module: "app.bootstrap",
    operation: "service_container_ready",
    metadata: {
      environment,
      persistenceMode: resolvedPersistence.value.mode
    }
  });

  isBootstrapped = true;

  return {
    appName: appConfig.appName,
    environment,
    locale: i18nState.locale,
    featureFlags: defaultFeatureFlags,
    persistenceMode: resolvedPersistence.value.mode,
    repositories: resolvedPersistence.value,
    services,
    providerRegistryHealth: {
      analytics: providerRegistry.sdkHealth.analytics.status,
      billing: providerRegistry.sdkHealth.billing.status,
      crash: providerRegistry.sdkHealth.crash.status,
      notifications: providerRegistry.sdkHealth.notifications.status,
      widgets: providerRegistry.sdkHealth.widgets.status
    },
    bootstrappedAt: nowIso()
  };
}

export async function safeAppBootstrap(
  input: AppBootstrapInput = {}
): Promise<SafeAppBootstrapResult> {
  const environment = input.environment ?? environmentManager.current;
  const persistenceMode = resolvePersistenceMode({
    environment,
    override: input.persistenceModeOverride
  });

  try {
    return {
      isSuccessful: true,
      result: await appBootstrap(input)
    };
  } catch (error) {
    const mappedError = mapUnknownError(error, "Application bootstrap failed.");

    logger.error("Application bootstrap failed", {
      module: "app.bootstrap",
      operation: "app_bootstrap_failed",
      metadata: {
        errorCode: mappedError.code,
        environment,
        persistenceMode
      }
    });

    void providerRegistry.crashProvider.captureError(mappedError, {
      module: "app.bootstrap",
      errorCode: mappedError.code
    });

    return {
      isSuccessful: false,
      error: mappedError,
      persistenceMode
    };
  }
}

export function hasAppBootstrapped(): boolean {
  return isBootstrapped;
}

async function maybeFallbackToInMemory(input: {
  environment: AppEnvironment;
  selectedPersistenceMode: PersistenceMode;
  allowFallback: boolean;
  originalFailure: Parameters<typeof dataFailure>[0];
  persistenceBootstrap: (
    input: PersistenceBootstrapInput
  ) => ReturnType<typeof bootstrapPersistence>;
}): ReturnType<typeof bootstrapPersistence> {
  if (input.selectedPersistenceMode !== "sqlite" || !input.allowFallback) {
    return Promise.resolve(dataFailure(input.originalFailure));
  }

  logger.warn("Falling back to in-memory persistence", {
    module: "app.bootstrap",
    operation: "persistence_fallback_in_memory",
    metadata: {
      environment: input.environment,
      originalPersistenceMode: input.selectedPersistenceMode
    }
  });

  return input.persistenceBootstrap({
    environment: input.environment,
    modeOverride: "inMemory"
  });
}

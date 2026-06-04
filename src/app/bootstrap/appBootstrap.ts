import { appConfig, environmentManager } from "../../shared/config";
import { createAppError, mapUnknownError, type AppError } from "../../shared/errors";
import { defaultFeatureFlags } from "../../shared/featureFlags";
import { initI18n } from "../../shared/i18n";
import { logger } from "../../shared/logger";
import { providerRegistry } from "../../platform/providerRegistry";

export type AppBootstrapResult = {
  appName: string;
  environment: string;
  locale: string;
  featureFlags: typeof defaultFeatureFlags;
};

export type SafeAppBootstrapResult =
  | {
      isSuccessful: true;
      result: AppBootstrapResult;
    }
  | {
      isSuccessful: false;
      error: AppError;
    };

let isBootstrapped = false;

export function appBootstrap(): AppBootstrapResult {
  if (!appConfig.appName) {
    throw createAppError({
      code: "CONFIG_ERROR",
      developerMessage: "Application name is missing during bootstrap."
    });
  }

  const i18nState = initI18n(appConfig.defaultLocale);
  isBootstrapped = true;

  logger.info("Application bootstrap completed", {
    module: "app.bootstrap",
    operation: "app_bootstrap_completed",
    metadata: {
      environment: environmentManager.current,
      locale: i18nState.locale
    }
  });

  return {
    appName: appConfig.appName,
    environment: environmentManager.current,
    locale: i18nState.locale,
    featureFlags: defaultFeatureFlags
  };
}

export function safeAppBootstrap(): SafeAppBootstrapResult {
  try {
    return {
      isSuccessful: true,
      result: appBootstrap()
    };
  } catch (error) {
    const mappedError = mapUnknownError(error, "Application bootstrap failed.");

    logger.error("Application bootstrap failed", {
      module: "app.bootstrap",
      operation: "app_bootstrap_failed",
      metadata: {
        errorCode: mappedError.code,
        environment: environmentManager.current
      }
    });

    void providerRegistry.crashProvider.captureError(mappedError, {
      module: "app.bootstrap",
      errorCode: mappedError.code
    });

    return {
      isSuccessful: false,
      error: mappedError
    };
  }
}

export function hasAppBootstrapped(): boolean {
  return isBootstrapped;
}

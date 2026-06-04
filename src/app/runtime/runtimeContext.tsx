import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  safeAppBootstrap,
  type AppBootstrapContext,
  type AppBootstrapInput,
  type SafeAppBootstrapResult
} from "../bootstrap";
import { appConfig, type AppEnvironment, type AppThemePreference } from "../../shared/config";
import type { AppError } from "../../shared/errors";
import type { FeatureFlags } from "../../shared/featureFlags";
import type { ServiceContainer } from "../../services";

export type AppRuntimeStatus = "pending" | "ready" | "failed";

export type AppRuntimeBootstrapContext = Readonly<{
  appName: string;
  environment: AppEnvironment;
  locale: string;
  featureFlags: FeatureFlags;
  services: ServiceContainer;
  providerRegistryHealth: Readonly<Record<string, string>>;
  themePreference: AppThemePreference;
  bootstrappedAt: string;
}>;

export type AppRuntimeState =
  | Readonly<{
      status: "pending";
      startedAt: string;
    }>
  | Readonly<{
      status: "ready";
      bootstrap: AppRuntimeBootstrapContext;
      startedAt: string;
      readyAt: string;
    }>
  | Readonly<{
      status: "failed";
      error: AppError;
      startedAt: string;
      failedAt: string;
    }>;

export type AppRuntimeContextValue = Readonly<{
  state: AppRuntimeState;
}>;

export type AppRuntimeProviderProps = Readonly<{
  children: ReactNode;
  bootstrap?: (input?: AppBootstrapInput) => Promise<SafeAppBootstrapResult>;
  bootstrapInput?: AppBootstrapInput;
  nowIso?: () => string;
}>;

export const AppRuntimeContext = createContext<AppRuntimeContextValue | null>(null);

export function AppRuntimeProvider({
  children,
  bootstrap = safeAppBootstrap,
  bootstrapInput,
  nowIso = () => new Date().toISOString()
}: AppRuntimeProviderProps): ReactNode {
  const [state, setState] = useState<AppRuntimeState>(() => ({
    status: "pending",
    startedAt: nowIso()
  }));

  useEffect(() => {
    let isMounted = true;

    void bootstrap(bootstrapInput).then((result) => {
      if (!isMounted) {
        return;
      }

      if (result.isSuccessful) {
        setState((currentState) => ({
          status: "ready",
          bootstrap: createAppRuntimeBootstrapContext(result.result),
          startedAt: currentState.startedAt,
          readyAt: nowIso()
        }));
        return;
      }

      setState((currentState) => ({
        status: "failed",
        error: result.error,
        startedAt: currentState.startedAt,
        failedAt: nowIso()
      }));
    });

    return () => {
      isMounted = false;
    };
  }, [bootstrap, bootstrapInput, nowIso]);

  const value = useMemo<AppRuntimeContextValue>(() => ({ state }), [state]);

  return <AppRuntimeContext.Provider value={value}>{children}</AppRuntimeContext.Provider>;
}

export function useAppRuntime(): AppRuntimeContextValue {
  const value = useContext(AppRuntimeContext);

  if (value === null) {
    throw new Error("useAppRuntime must be used within AppRuntimeProvider.");
  }

  return value;
}

export function createAppRuntimeBootstrapContext(
  bootstrap: AppBootstrapContext
): AppRuntimeBootstrapContext {
  return {
    appName: bootstrap.appName,
    environment: bootstrap.environment,
    locale: bootstrap.locale,
    featureFlags: bootstrap.featureFlags,
    services: bootstrap.services,
    providerRegistryHealth: bootstrap.providerRegistryHealth,
    themePreference: appConfig.defaultTheme,
    bootstrappedAt: bootstrap.bootstrappedAt
  };
}

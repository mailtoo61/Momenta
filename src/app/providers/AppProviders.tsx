import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { safeAppBootstrap, type SafeAppBootstrapResult } from "../bootstrap";
import { providerRegistry, type ProviderRegistry } from "../../platform/providerRegistry";
import { getActiveLocale, type SupportedLocale } from "../../shared/i18n";
import { lightTheme, type AppTheme } from "../../shared/theme";

export type AppProvidersProps = {
  children: ReactNode;
};

export type AppProviderState = {
  bootstrap: AppProviderBootstrapState;
  locale: SupportedLocale;
  providerRegistry: ProviderRegistry;
  theme: AppTheme;
};

export type AppProviderBootstrapState =
  | {
      status: "pending";
    }
  | {
      status: "ready";
      result: SafeAppBootstrapResult;
    };

export const AppProviderContext = createContext<AppProviderState | null>(null);

export function AppProviders({ children }: AppProvidersProps): ReactNode {
  const [bootstrap, setBootstrap] = useState<AppProviderBootstrapState>({
    status: "pending"
  });

  useEffect(() => {
    let isMounted = true;

    void safeAppBootstrap().then((result) => {
      if (isMounted) {
        setBootstrap({
          status: "ready",
          result
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AppProviderState>(() => {
    return {
      bootstrap,
      locale: getActiveLocale(),
      providerRegistry,
      theme: lightTheme
    };
  }, [bootstrap]);

  return <AppProviderContext.Provider value={value}>{children}</AppProviderContext.Provider>;
}

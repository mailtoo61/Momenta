import { createContext, useMemo, type ReactNode } from "react";

import { safeAppBootstrap, type SafeAppBootstrapResult } from "../bootstrap";
import { providerRegistry, type ProviderRegistry } from "../../platform/providerRegistry";
import { getActiveLocale, type SupportedLocale } from "../../shared/i18n";
import { lightTheme, type AppTheme } from "../../shared/theme";

export type AppProvidersProps = {
  children: ReactNode;
};

export type AppProviderState = {
  bootstrap: SafeAppBootstrapResult;
  locale: SupportedLocale;
  providerRegistry: ProviderRegistry;
  theme: AppTheme;
};

export const AppProviderContext = createContext<AppProviderState | null>(null);

export function AppProviders({ children }: AppProvidersProps): ReactNode {
  const value = useMemo<AppProviderState>(() => {
    const bootstrap = safeAppBootstrap();

    return {
      bootstrap,
      locale: getActiveLocale(),
      providerRegistry,
      theme: lightTheme
    };
  }, []);

  return <AppProviderContext.Provider value={value}>{children}</AppProviderContext.Provider>;
}

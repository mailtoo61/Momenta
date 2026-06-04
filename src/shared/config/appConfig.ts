export const SUPPORTED_ENVIRONMENTS = ["development", "preview", "production"] as const;

export type AppEnvironment = (typeof SUPPORTED_ENVIRONMENTS)[number];

export type AppThemePreference = "light" | "dark" | "system";
export type PersistenceMode = "inMemory" | "sqlite";

export type AppConfig = {
  appName: "Momenta";
  defaultLocale: "tr";
  fallbackLocale: "en";
  defaultTheme: AppThemePreference;
  constants: {
    appVersion: string;
    buildNumber: string;
  };
  storage: {
    sqliteDatabaseName: string;
    persistenceModeByEnvironment: Record<AppEnvironment, PersistenceMode>;
  };
};

export const appConfig: AppConfig = {
  appName: "Momenta",
  defaultLocale: "tr",
  fallbackLocale: "en",
  defaultTheme: "system",
  constants: {
    appVersion: "0.1.0",
    buildNumber: "0"
  },
  storage: {
    sqliteDatabaseName: "momenta.db",
    persistenceModeByEnvironment: {
      development: "sqlite",
      preview: "inMemory",
      production: "inMemory"
    }
  }
};

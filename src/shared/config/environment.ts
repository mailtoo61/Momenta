import { SUPPORTED_ENVIRONMENTS, type AppEnvironment } from "./appConfig";

const DEFAULT_ENVIRONMENT: AppEnvironment = "development";

export type EnvironmentManager = {
  current: AppEnvironment;
  isDevelopment: () => boolean;
  isPreview: () => boolean;
  isProduction: () => boolean;
};

export function resolveEnvironment(value?: string): AppEnvironment {
  if (SUPPORTED_ENVIRONMENTS.includes(value as AppEnvironment)) {
    return value as AppEnvironment;
  }

  return DEFAULT_ENVIRONMENT;
}

export function createEnvironmentManager(value?: string): EnvironmentManager {
  const current = resolveEnvironment(value);

  return {
    current,
    isDevelopment: () => current === "development",
    isPreview: () => current === "preview",
    isProduction: () => current === "production"
  };
}

export const environmentManager = createEnvironmentManager(process.env.APP_ENV);

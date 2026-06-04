import type { AppEnvironment, AppThemePreference, PersistenceMode } from "../../shared/config";
import type { AppError } from "../../shared/errors";
import type { FeatureFlags } from "../../shared/featureFlags";
import type { ServiceContainer } from "../../services";
import type { HomeReadService } from "../../services/home";
import { useAppRuntime, type AppRuntimeState, type AppRuntimeStatus } from "./runtimeContext";

export function selectRuntimeStatus(state: AppRuntimeState): AppRuntimeStatus {
  return state.status;
}

export function selectIsRuntimeReady(state: AppRuntimeState): boolean {
  return state.status === "ready";
}

export function selectRuntimeEnvironment(state: AppRuntimeState): AppEnvironment | null {
  return state.status === "ready" ? state.bootstrap.environment : null;
}

export function selectRuntimeServices(state: AppRuntimeState): ServiceContainer | null {
  return state.status === "ready" ? state.bootstrap.services : null;
}

export function selectHomeReadService(state: AppRuntimeState): HomeReadService | null {
  return state.status === "ready" ? state.bootstrap.services.homeReadService : null;
}

export function selectRuntimePersistenceMode(state: AppRuntimeState): PersistenceMode | null {
  return state.status === "ready" ? state.bootstrap.persistenceMode : null;
}

export function selectFeatureFlags(state: AppRuntimeState): FeatureFlags | null {
  return state.status === "ready" ? state.bootstrap.featureFlags : null;
}

export function selectCurrentLocale(state: AppRuntimeState): string | null {
  return state.status === "ready" ? state.bootstrap.locale : null;
}

export function selectCurrentThemePreference(state: AppRuntimeState): AppThemePreference | null {
  return state.status === "ready" ? state.bootstrap.themePreference : null;
}

export function selectRuntimeError(state: AppRuntimeState): AppError | null {
  return state.status === "failed" ? state.error : null;
}

export function useRuntimeStatus(): AppRuntimeStatus {
  return selectRuntimeStatus(useAppRuntime().state);
}

export function useIsRuntimeReady(): boolean {
  return selectIsRuntimeReady(useAppRuntime().state);
}

export function useRuntimeEnvironment(): AppEnvironment | null {
  return selectRuntimeEnvironment(useAppRuntime().state);
}

export function useRuntimeServices(): ServiceContainer | null {
  return selectRuntimeServices(useAppRuntime().state);
}

export function useHomeReadService(): HomeReadService | null {
  return selectHomeReadService(useAppRuntime().state);
}

export function useRuntimePersistenceMode(): PersistenceMode | null {
  return selectRuntimePersistenceMode(useAppRuntime().state);
}

export function useServices(): ServiceContainer | null {
  return useRuntimeServices();
}

export function useFeatureFlags(): FeatureFlags | null {
  return selectFeatureFlags(useAppRuntime().state);
}

export function useCurrentLocale(): string | null {
  return selectCurrentLocale(useAppRuntime().state);
}

export function useCurrentThemePreference(): AppThemePreference | null {
  return selectCurrentThemePreference(useAppRuntime().state);
}

export function useRuntimeError(): AppError | null {
  return selectRuntimeError(useAppRuntime().state);
}

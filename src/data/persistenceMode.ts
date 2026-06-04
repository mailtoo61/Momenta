import { appConfig, type AppEnvironment, type PersistenceMode } from "../shared/config";

export { type PersistenceMode };

export type ResolvePersistenceModeInput = Readonly<{
  environment: AppEnvironment;
  override?: PersistenceMode;
}>;

export function resolvePersistenceMode(input: ResolvePersistenceModeInput): PersistenceMode {
  return input.override ?? appConfig.storage.persistenceModeByEnvironment[input.environment];
}

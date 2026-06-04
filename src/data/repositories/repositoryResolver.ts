import { dataFailure, dataSuccess, type DataResult } from "../dataResult";
import type { PersistenceMode } from "../persistenceMode";
import { createPersistenceError } from "../persistenceErrors";
import type { MomentaDatabase } from "../sqlite";
import { createInMemoryRepositories } from "./inMemory";
import { createSqliteRepositories } from "./sqlite";
import type {
  AuditLogRepository,
  MomentRepository,
  PremiumEntitlementRepository,
  SettingsRepository,
  WidgetSnapshotRepository
} from "./repositoryContracts";

export type ResolvedRepositories = Readonly<{
  mode: PersistenceMode;
  repositories: RepositorySet;
  close: () => Promise<DataResult<void>>;
}>;

export type RepositorySet = Readonly<{
  momentRepository: MomentRepository;
  settingsRepository: SettingsRepository;
  widgetSnapshotRepository: WidgetSnapshotRepository;
  auditLogRepository: AuditLogRepository;
  premiumEntitlementRepository: PremiumEntitlementRepository;
}>;

export type ResolveRepositoriesInput = Readonly<{
  mode: PersistenceMode;
  sqliteDatabase?: MomentaDatabase;
  openSqliteDatabase?: () => Promise<DataResult<MomentaDatabase>>;
}>;

export async function resolveRepositories(
  input: ResolveRepositoriesInput
): Promise<DataResult<ResolvedRepositories>> {
  if (input.mode === "inMemory") {
    return dataSuccess({
      mode: "inMemory",
      repositories: createInMemoryRepositories(),
      close: async () => dataSuccess(undefined)
    });
  }

  const databaseResult = input.sqliteDatabase
    ? dataSuccess(input.sqliteDatabase)
    : input.openSqliteDatabase
      ? await input.openSqliteDatabase()
      : dataFailure(
          createPersistenceError({
            code: "DATA_REPOSITORY_UNAVAILABLE",
            developerMessage: "SQLite persistence mode requires a database bootstrap function."
          })
        );

  if (!databaseResult.isSuccess) {
    return dataFailure(databaseResult.error);
  }

  return dataSuccess({
    mode: "sqlite",
    repositories: createSqliteRepositories(databaseResult.value.adapter),
    close: async () => {
      try {
        await databaseResult.value.close();
        return dataSuccess(undefined);
      } catch (cause) {
        return dataFailure(
          createPersistenceError({
            code: "DATA_REPOSITORY_UNAVAILABLE",
            developerMessage: "Failed to close SQLite database.",
            cause
          })
        );
      }
    }
  });
}

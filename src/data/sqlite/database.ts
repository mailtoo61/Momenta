import { dataFailure, dataSuccess, type DataResult } from "../dataResult";
import { createMigrationRunner, initialSchemaMigration } from "../migrations";
import { createPersistenceError } from "../persistenceErrors";
import { openSqliteAdapter, type SqliteAdapter } from "./sqliteAdapter";
import { sqliteDatabaseConfig } from "./databaseConfig";

export type MomentaDatabase = Readonly<{
  adapter: SqliteAdapter;
  close: () => Promise<void>;
}>;

export async function openMomentaDatabase(): Promise<DataResult<MomentaDatabase>> {
  try {
    const adapter = await openSqliteAdapter({
      databaseName: sqliteDatabaseConfig.databaseName
    });
    const migrationRunner = createMigrationRunner({
      adapter,
      migrations: [initialSchemaMigration(adapter)],
      nowIso: () => new Date().toISOString()
    });
    const migrationResult = await migrationRunner.runPending();

    if (!migrationResult.isSuccess) {
      await adapter.close();
      return dataFailure(migrationResult.error);
    }

    return dataSuccess({
      adapter,
      close: () => adapter.close()
    });
  } catch (cause) {
    return dataFailure(
      createPersistenceError({
        code: "DATA_REPOSITORY_UNAVAILABLE",
        developerMessage: "Failed to open Momenta SQLite database.",
        cause
      })
    );
  }
}

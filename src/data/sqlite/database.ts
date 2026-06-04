import { dataFailure, dataSuccess, type DataResult } from "../dataResult";
import { createMigrationRunner, initialSchemaMigration } from "../migrations";
import type { SqliteAdapter } from "./sqliteAdapter";
import { sqliteDatabaseConfig } from "./databaseConfig";
import { normalizeSqliteError } from "./sqliteErrors";

export type MomentaDatabase = Readonly<{
  adapter: SqliteAdapter;
  close: () => Promise<void>;
}>;

export type DatabaseBootstrapLogger = Readonly<{
  log: (
    level: "debug" | "info" | "warn" | "error",
    message: string,
    context: Readonly<Record<string, string | number | boolean | null>>
  ) => void;
}>;

export type OpenMomentaDatabaseOptions = Readonly<{
  openAdapter?: () => Promise<SqliteAdapter>;
  nowIso?: () => string;
  logger?: DatabaseBootstrapLogger;
}>;

export async function openMomentaDatabase(
  options: OpenMomentaDatabaseOptions = {}
): Promise<DataResult<MomentaDatabase>> {
  const nowIso = options.nowIso ?? (() => new Date().toISOString());
  const openAdapter =
    options.openAdapter ??
    (async () => {
      const { openSqliteAdapter } = await import("./sqliteAdapter");
      return openSqliteAdapter({
        databaseName: sqliteDatabaseConfig.databaseName
      });
    });

  try {
    options.logger?.log("info", "Opening SQLite database.", {
      databaseName: sqliteDatabaseConfig.databaseName
    });
    const adapter = await openAdapter();
    const migrationRunner = createMigrationRunner({
      adapter,
      migrations: [initialSchemaMigration(adapter)],
      nowIso
    });
    const migrationResult = await migrationRunner.runPending();

    if (!migrationResult.isSuccess) {
      options.logger?.log("error", "SQLite migration failed.", {
        errorCode: migrationResult.error.code
      });
      await closeAdapterAfterFailure(adapter, options.logger);
      return dataFailure(migrationResult.error);
    }

    options.logger?.log("info", "SQLite database opened.", {
      migrationsRun: migrationResult.value.length
    });

    return dataSuccess({
      adapter,
      close: () => adapter.close()
    });
  } catch (cause) {
    return dataFailure(
      normalizeSqliteError("databaseOpen", cause, "Failed to open Momenta SQLite database.")
    );
  }
}

async function closeAdapterAfterFailure(
  adapter: SqliteAdapter,
  logger?: DatabaseBootstrapLogger
): Promise<void> {
  try {
    await adapter.close();
  } catch (cause) {
    const error = normalizeSqliteError(
      "databaseOpen",
      cause,
      "Failed to close SQLite adapter after bootstrap failure."
    );
    logger?.log("warn", "SQLite adapter close failed after bootstrap failure.", {
      errorCode: error.code
    });
  }
}

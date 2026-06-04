import { dataFailure, dataSuccess, type DataResult } from "../dataResult";
import { createPersistenceError } from "../persistenceErrors";
import type { SqliteAdapter, SqliteRow } from "../sqlite";
import type { MigrationDefinition, MigrationResult, MigrationRunner } from "./migrationContracts";

export type MigrationMetadata = Readonly<{
  id: string;
  migrationId: string;
  status: MigrationResult["status"];
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
}>;

export type ExtendedMigrationRunner = MigrationRunner & {
  runPending: () => Promise<DataResult<ReadonlyArray<MigrationResult>>>;
};

export type CreateMigrationRunnerOptions = Readonly<{
  adapter: SqliteAdapter;
  migrations: ReadonlyArray<MigrationDefinition>;
  nowIso: () => string;
}>;

type MigrationMetadataRow = SqliteRow &
  Readonly<{
    id: string;
    migrationId: string;
    status: MigrationResult["status"];
    startedAt: string;
    completedAt: string | null;
    errorMessage: string | null;
  }>;

export function createMigrationRunner(
  options: CreateMigrationRunnerOptions
): ExtendedMigrationRunner {
  const sortedMigrations = [...options.migrations].sort((left, right) =>
    left.id.localeCompare(right.id)
  );

  return {
    listPending: async () => {
      const metadataResult = await listMigrationMetadata(options.adapter);
      if (!metadataResult.isSuccess) {
        return dataFailure(metadataResult.error);
      }

      const completedIds = new Set(
        metadataResult.value
          .filter((metadata) => metadata.status === "completed")
          .map((metadata) => metadata.migrationId)
      );

      return dataSuccess(sortedMigrations.filter((migration) => !completedIds.has(migration.id)));
    },
    run: async (migration) => runMigration(options.adapter, migration, options.nowIso),
    rollback: async (migration) => rollbackMigration(options.adapter, migration, options.nowIso),
    runPending: async () => {
      const pendingResult = await listPendingMigrations(options.adapter, sortedMigrations);
      if (!pendingResult.isSuccess) {
        return dataFailure(pendingResult.error);
      }

      const results: MigrationResult[] = [];
      for (const migration of pendingResult.value) {
        const result = await runMigration(options.adapter, migration, options.nowIso);
        if (!result.isSuccess) {
          return dataFailure(result.error);
        }

        results.push(result.value);
      }

      return dataSuccess(results);
    }
  };
}

async function listPendingMigrations(
  adapter: SqliteAdapter,
  sortedMigrations: ReadonlyArray<MigrationDefinition>
): Promise<DataResult<ReadonlyArray<MigrationDefinition>>> {
  const metadataResult = await listMigrationMetadata(adapter);
  if (!metadataResult.isSuccess) {
    return dataFailure(metadataResult.error);
  }

  const completedIds = new Set(
    metadataResult.value
      .filter((metadata) => metadata.status === "completed")
      .map((metadata) => metadata.migrationId)
  );

  return dataSuccess(sortedMigrations.filter((migration) => !completedIds.has(migration.id)));
}

async function runMigration(
  adapter: SqliteAdapter,
  migration: MigrationDefinition,
  nowIso: () => string
): Promise<DataResult<MigrationResult>> {
  const startedAt = nowIso();

  try {
    await ensureMigrationMetadataTable(adapter);
    await upsertMigrationMetadata(adapter, {
      id: migration.id,
      migrationId: migration.id,
      status: "running",
      startedAt,
      completedAt: null,
      errorMessage: null
    });

    const migrationResult = await migration.up();
    const completedAt = nowIso();

    if (!migrationResult.isSuccess) {
      const failedResult: MigrationResult = {
        id: migration.id,
        status: "failed",
        startedAt,
        completedAt,
        errorMessage: migrationResult.error.developerMessage
      };
      await upsertMigrationMetadata(adapter, toMetadata(failedResult));
      return dataFailure(migrationResult.error);
    }

    const completedResult: MigrationResult = {
      id: migration.id,
      status: "completed",
      startedAt,
      completedAt,
      errorMessage: null
    };
    await upsertMigrationMetadata(adapter, toMetadata(completedResult));
    return dataSuccess(completedResult);
  } catch (cause) {
    return dataFailure(
      createPersistenceError({
        code: "DATA_MIGRATION_FAILED",
        developerMessage: `Migration failed: ${migration.id}`,
        cause
      })
    );
  }
}

async function rollbackMigration(
  adapter: SqliteAdapter,
  migration: MigrationDefinition,
  nowIso: () => string
): Promise<DataResult<MigrationResult>> {
  const startedAt = nowIso();
  const rollbackResult = await migration.down();
  const completedAt = nowIso();

  if (!rollbackResult.isSuccess) {
    const failedResult: MigrationResult = {
      id: migration.id,
      status: "failed",
      startedAt,
      completedAt,
      errorMessage: rollbackResult.error.developerMessage
    };
    await upsertMigrationMetadata(adapter, toMetadata(failedResult));
    return dataFailure(rollbackResult.error);
  }

  const rolledBackResult: MigrationResult = {
    id: migration.id,
    status: "rolled-back",
    startedAt,
    completedAt,
    errorMessage: null
  };
  await upsertMigrationMetadata(adapter, toMetadata(rolledBackResult));
  return dataSuccess(rolledBackResult);
}

async function listMigrationMetadata(
  adapter: SqliteAdapter
): Promise<DataResult<ReadonlyArray<MigrationMetadata>>> {
  try {
    await ensureMigrationMetadataTable(adapter);
    const rows = await adapter.query<MigrationMetadataRow>(
      "SELECT id, migrationId, status, startedAt, completedAt, errorMessage FROM migration_metadata ORDER BY migrationId ASC"
    );
    return dataSuccess(rows.map((row) => ({ ...row })));
  } catch (cause) {
    return dataFailure(
      createPersistenceError({
        code: "DATA_MIGRATION_FAILED",
        developerMessage: "Failed to read migration metadata.",
        cause
      })
    );
  }
}

async function ensureMigrationMetadataTable(adapter: SqliteAdapter): Promise<void> {
  await adapter.execute(`
CREATE TABLE IF NOT EXISTS migration_metadata (
  id TEXT PRIMARY KEY NOT NULL,
  migrationId TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  startedAt TEXT NOT NULL,
  completedAt TEXT,
  errorMessage TEXT
);`);
}

async function upsertMigrationMetadata(
  adapter: SqliteAdapter,
  metadata: MigrationMetadata
): Promise<void> {
  await adapter.execute(
    `INSERT INTO migration_metadata (
      id,
      migrationId,
      status,
      startedAt,
      completedAt,
      errorMessage
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(migrationId) DO UPDATE SET
      status = excluded.status,
      startedAt = excluded.startedAt,
      completedAt = excluded.completedAt,
      errorMessage = excluded.errorMessage`,
    [
      metadata.id,
      metadata.migrationId,
      metadata.status,
      metadata.startedAt,
      metadata.completedAt,
      metadata.errorMessage
    ]
  );
}

function toMetadata(result: MigrationResult): MigrationMetadata {
  return {
    id: result.id,
    migrationId: result.id,
    status: result.status,
    startedAt: result.startedAt,
    completedAt: result.completedAt,
    errorMessage: result.errorMessage
  };
}

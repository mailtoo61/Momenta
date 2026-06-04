import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import {
  createMigrationRunner,
  INITIAL_SCHEMA_MIGRATION_ID,
  initialSchemaMigration,
  type MigrationDefinition
} from "../../src/data/migrations";
import {
  createSqliteRepositories,
  type PersistedMoment,
  type PersistedPremiumEntitlement,
  type PersistedWidgetSnapshot
} from "../../src/data/repositories";
import { createPersistenceError, dataFailure, dataSuccess } from "../../src/data";
import type {
  SqliteAdapter,
  SqliteParams,
  SqlitePrimitive,
  SqliteRow
} from "../../src/data/sqlite";
import { createServiceContainer } from "../../src/services";

const timestamp = "2026-06-04T00:00:00.000Z";
const laterTimestamp = "2026-06-04T01:00:00.000Z";

describe("SQLite repository implementations and migrations", () => {
  it("returns all SQLite repository implementations from the factory", () => {
    const repositories = createSqliteRepositories(new FakeSqliteAdapter());

    expect(repositories.momentRepository).toBeDefined();
    expect(repositories.settingsRepository).toBeDefined();
    expect(repositories.widgetSnapshotRepository).toBeDefined();
    expect(repositories.auditLogRepository).toBeDefined();
    expect(repositories.premiumEntitlementRepository).toBeDefined();
  });

  it("supports MomentRepository create/get/list/search/update/archive/restore/softDelete through the SQLite adapter", async () => {
    const repositories = createSqliteRepositories(new FakeSqliteAdapter());
    const moment = samplePersistedMoment("moment-1");

    await expect(repositories.momentRepository.create(moment)).resolves.toEqual({
      isSuccess: true,
      value: moment
    });
    await expect(repositories.momentRepository.getById(moment.id)).resolves.toEqual({
      isSuccess: true,
      value: moment
    });
    await expect(repositories.momentRepository.listActive()).resolves.toMatchObject({
      isSuccess: true,
      value: [moment]
    });
    await expect(
      repositories.momentRepository.search({ query: "inspection" })
    ).resolves.toMatchObject({
      isSuccess: true,
      value: [moment]
    });

    const updated = await repositories.momentRepository.update(moment.id, {
      title: "Updated inspection",
      updatedAt: laterTimestamp
    });
    expect(updated.isSuccess && updated.value.title).toBe("Updated inspection");

    const archived = await repositories.momentRepository.archive(moment.id, laterTimestamp);
    expect(archived.isSuccess && archived.value.isArchived).toBe(true);

    const restored = await repositories.momentRepository.restore(moment.id, laterTimestamp);
    expect(restored.isSuccess && restored.value.isArchived).toBe(false);

    const deleted = await repositories.momentRepository.softDelete(moment.id, laterTimestamp);
    expect(deleted.isSuccess && deleted.value.isDeleted).toBe(true);
  });

  it("supports settings, widget snapshots, audit logs, and premium entitlement repositories", async () => {
    const repositories = createSqliteRepositories(new FakeSqliteAdapter());
    const setting = {
      id: "theme",
      settingKey: "theme",
      settingValue: JSON.stringify("system"),
      updatedAt: timestamp
    };
    const snapshot: PersistedWidgetSnapshot = {
      id: "snapshot-1",
      widgetId: "home-small",
      snapshotVersion: "v1",
      generatedAt: timestamp,
      payload: { payloadVersion: "v1", momentCount: 1 },
      privacyLevel: "private",
      privacyMode: "standard",
      expiresAt: null
    };
    const entitlement: PersistedPremiumEntitlement = {
      id: "entitlement-1",
      planId: "free",
      status: "free",
      activatedAt: null,
      expiresAt: null,
      lastValidatedAt: timestamp,
      source: "local"
    };

    await expect(repositories.settingsRepository.set(setting)).resolves.toEqual({
      isSuccess: true,
      value: setting
    });
    await expect(repositories.settingsRepository.get("theme")).resolves.toEqual({
      isSuccess: true,
      value: setting
    });

    await expect(repositories.widgetSnapshotRepository.save(snapshot)).resolves.toEqual({
      isSuccess: true,
      value: snapshot
    });
    await expect(
      repositories.widgetSnapshotRepository.getByWidgetId("home-small")
    ).resolves.toEqual({
      isSuccess: true,
      value: snapshot
    });
    await expect(repositories.widgetSnapshotRepository.remove("snapshot-1")).resolves.toMatchObject(
      {
        isSuccess: true
      }
    );

    await expect(
      repositories.auditLogRepository.append({
        id: "audit-1",
        eventType: "moment_created",
        entityType: "moment",
        entityId: "moment-1",
        timestamp,
        severity: "info",
        details: { momentId: "moment-1" }
      })
    ).resolves.toMatchObject({ isSuccess: true });
    await expect(repositories.auditLogRepository.listRecent(1)).resolves.toMatchObject({
      isSuccess: true,
      value: [{ id: "audit-1" }]
    });

    await expect(repositories.premiumEntitlementRepository.save(entitlement)).resolves.toEqual({
      isSuccess: true,
      value: entitlement
    });
    await expect(repositories.premiumEntitlementRepository.getCurrent()).resolves.toEqual({
      isSuccess: true,
      value: entitlement
    });
    await expect(repositories.premiumEntitlementRepository.clear()).resolves.toMatchObject({
      isSuccess: true
    });
  });

  it("wires SQLite repositories into the service container through repository contracts", () => {
    const repositories = createSqliteRepositories(new FakeSqliteAdapter());
    const container = createServiceContainer({
      repositories,
      idFactory: () => "sqlite-container-id",
      nowIso: () => timestamp
    });

    expect(container.momentWorkflowService).toBeDefined();
    expect(container.auditService).toBeDefined();
  });

  it("sorts migrations, skips completed migrations, and records metadata", async () => {
    const adapter = new FakeSqliteAdapter();
    const executionOrder: string[] = [];
    const migrations = [
      successfulMigration("0002_second", executionOrder),
      successfulMigration("0001_first", executionOrder)
    ];
    const runner = createMigrationRunner({
      adapter,
      migrations,
      nowIso: () => timestamp
    });

    const firstRun = await runner.runPending();
    expect(firstRun.isSuccess).toBe(true);
    expect(executionOrder).toEqual(["0001_first", "0002_second"]);

    const secondPending = await runner.listPending();
    expect(secondPending.isSuccess && secondPending.value).toEqual([]);
    expect(adapter.migrationMetadata.map((metadata) => metadata.migrationId)).toEqual([
      "0001_first",
      "0002_second"
    ]);
    expect(adapter.migrationMetadata[0]).toMatchObject({
      id: "0001_first",
      migrationId: "0001_first",
      status: "completed",
      startedAt: timestamp,
      completedAt: timestamp,
      errorMessage: null
    });
  });

  it("returns DataResult failure when a migration fails", async () => {
    const adapter = new FakeSqliteAdapter();
    const runner = createMigrationRunner({
      adapter,
      migrations: [failingMigration("0001_failure")],
      nowIso: () => timestamp
    });

    const result = await runner.runPending();

    expect(result.isSuccess).toBe(false);
    expect(adapter.migrationMetadata[0]).toMatchObject({
      migrationId: "0001_failure",
      status: "failed"
    });
  });

  it("exposes the initial schema migration with a stable id", async () => {
    const adapter = new FakeSqliteAdapter();
    const migration = initialSchemaMigration(adapter);

    await expect(migration.up()).resolves.toEqual({ isSuccess: true, value: undefined });
    expect(migration.id).toBe(INITIAL_SCHEMA_MIGRATION_ID);
    expect(adapter.executedSql.join("\n")).toContain("CREATE TABLE IF NOT EXISTS moments");
    expect(adapter.executedSql.join("\n")).toContain(
      "CREATE TABLE IF NOT EXISTS migration_metadata"
    );
  });

  it("keeps SQLite boundaries clean", async () => {
    const sourceFiles = await listSourceFiles(join(process.cwd(), "src"));
    const expoSqliteImporters: string[] = [];

    for (const filePath of sourceFiles) {
      const source = await readFile(filePath, "utf8");
      const relativePath = relative(process.cwd(), filePath).replaceAll("\\", "/");

      if (source.includes("expo-sqlite")) {
        expoSqliteImporters.push(relativePath);
      }

      if (relativePath.startsWith("src/data/repositories/sqlite/")) {
        const importLines = source
          .split("\n")
          .filter((line) => line.trimStart().startsWith("import"))
          .join("\n");

        expect(importLines).not.toContain("/app");
        expect(importLines).not.toContain("/features");
        expect(importLines).not.toContain("/services");
        expect(importLines).not.toContain("expo-sqlite");
      }
    }

    expect(expoSqliteImporters).toEqual(["src/data/sqlite/sqliteAdapter.ts"]);
  });
});

class FakeSqliteAdapter implements SqliteAdapter {
  readonly moments = new Map<string, SqliteRow>();
  readonly settings = new Map<string, SqliteRow>();
  readonly widgetSnapshots = new Map<string, SqliteRow>();
  readonly auditLogs: SqliteRow[] = [];
  readonly premiumEntitlements: SqliteRow[] = [];
  readonly migrationMetadata: SqliteRow[] = [];
  readonly executedSql: string[] = [];

  async execute(sql: string, params: SqliteParams = []) {
    this.executedSql.push(sql);
    const normalizedSql = normalizeSql(sql);

    if (normalizedSql.startsWith("insert into moments")) {
      this.moments.set(String(params[0]), momentRow(params));
    } else if (normalizedSql.startsWith("update moments set")) {
      this.updateMoment(sql, params);
    } else if (normalizedSql.startsWith("insert into app_settings")) {
      this.settings.set(String(params[1]), {
        id: params[0],
        settingKey: params[1],
        settingValue: params[2],
        updatedAt: params[3]
      });
    } else if (normalizedSql.startsWith("insert into widget_snapshots")) {
      this.widgetSnapshots.set(String(params[0]), widgetSnapshotRow(params));
    } else if (normalizedSql.startsWith("delete from widget_snapshots")) {
      this.widgetSnapshots.delete(String(params[0]));
    } else if (normalizedSql.startsWith("insert into audit_logs")) {
      this.auditLogs.push(auditLogRow(params));
    } else if (normalizedSql.startsWith("delete from premium_entitlements")) {
      this.premiumEntitlements.length = 0;
    } else if (normalizedSql.startsWith("insert into premium_entitlements")) {
      this.premiumEntitlements.push(premiumEntitlementRow(params));
    } else if (normalizedSql.startsWith("insert into migration_metadata")) {
      this.upsertMigrationMetadata(params);
    }

    return {
      changes: 1,
      lastInsertRowId: 0
    };
  }

  async query<TRow extends SqliteRow>(sql: string, params: SqliteParams = []) {
    const normalizedSql = normalizeSql(sql);

    if (normalizedSql.includes("from moments")) {
      return rows<TRow>(this.queryMoments(normalizedSql, params));
    }

    if (normalizedSql.includes("from app_settings")) {
      const settingKey = params[0];
      const settings = settingKey
        ? Array.from(this.settings.values()).filter((setting) => setting.settingKey === settingKey)
        : Array.from(this.settings.values());
      return rows<TRow>(settings);
    }

    if (normalizedSql.includes("from widget_snapshots")) {
      const widgetId = params[0];
      const snapshots = widgetId
        ? Array.from(this.widgetSnapshots.values()).filter(
            (snapshot) => snapshot.widgetId === widgetId
          )
        : Array.from(this.widgetSnapshots.values());
      return rows<TRow>(snapshots);
    }

    if (normalizedSql.includes("from audit_logs")) {
      const limit = Number(params[0] ?? this.auditLogs.length);
      return rows<TRow>([...this.auditLogs].reverse().slice(0, limit));
    }

    if (normalizedSql.includes("from premium_entitlements")) {
      return rows<TRow>(this.premiumEntitlements.slice(-1));
    }

    if (normalizedSql.includes("from migration_metadata")) {
      return rows<TRow>(
        [...this.migrationMetadata].sort((left, right) =>
          String(left.migrationId).localeCompare(String(right.migrationId))
        )
      );
    }

    return rows<TRow>([]);
  }

  async transaction<T>(work: (transactionAdapter: SqliteAdapter) => Promise<T>): Promise<T> {
    return work(this);
  }

  async close() {
    return undefined;
  }

  private queryMoments(normalizedSql: string, params: SqliteParams): SqliteRow[] {
    let moments = Array.from(this.moments.values());

    if (normalizedSql.includes("where id =")) {
      moments = moments.filter((moment) => moment.id === params[0]);
    } else if (normalizedSql.includes("where isarchived = 0 and isdeleted = 0")) {
      moments = moments.filter((moment) => moment.isArchived === 0 && moment.isDeleted === 0);
    } else if (normalizedSql.includes("lower(title) like")) {
      const query = String(params[0]).replaceAll("%", "");
      moments = moments.filter(
        (moment) =>
          String(moment.title).toLowerCase().includes(query) ||
          String(moment.notes ?? "")
            .toLowerCase()
            .includes(query)
      );
    }

    const limit = Number(params[2] ?? -1);
    return limit >= 0 ? moments.slice(0, limit) : moments;
  }

  private updateMoment(sql: string, params: SqliteParams): void {
    const normalizedSql = normalizeSql(sql);
    const id = String(params[params.length - 1]);
    const existing = this.moments.get(id);
    if (!existing) {
      return;
    }

    if (normalizedSql.includes("archivedat = ?") && normalizedSql.includes("isarchived = 1")) {
      this.moments.set(id, {
        ...existing,
        archivedAt: params[0],
        isArchived: 1,
        updatedAt: params[1]
      });
      return;
    }

    if (normalizedSql.includes("archivedat = null")) {
      this.moments.set(id, {
        ...existing,
        archivedAt: null,
        deletedAt: null,
        isArchived: 0,
        isDeleted: 0,
        updatedAt: params[0]
      });
      return;
    }

    if (normalizedSql.includes("deletedat = ?") && normalizedSql.includes("isdeleted = 1")) {
      this.moments.set(id, {
        ...existing,
        deletedAt: params[0],
        isDeleted: 1,
        updatedAt: params[1]
      });
      return;
    }

    const assignments = sql
      .slice(sql.toLowerCase().indexOf("set") + 3, sql.toLowerCase().indexOf("where"))
      .split(",")
      .map((part) => part.trim().split(" = ")[0]);
    const updated: Record<string, SqlitePrimitive> = { ...existing };

    assignments.forEach((columnName, index) => {
      updated[columnName] = params[index];
    });

    this.moments.set(id, updated);
  }

  private upsertMigrationMetadata(params: SqliteParams): void {
    const metadata = {
      id: params[0],
      migrationId: params[1],
      status: params[2],
      startedAt: params[3],
      completedAt: params[4],
      errorMessage: params[5]
    };
    const existingIndex = this.migrationMetadata.findIndex(
      (item) => item.migrationId === metadata.migrationId
    );

    if (existingIndex >= 0) {
      this.migrationMetadata[existingIndex] = metadata;
    } else {
      this.migrationMetadata.push(metadata);
    }
  }
}

function momentRow(params: SqliteParams): SqliteRow {
  return {
    id: params[0],
    title: params[1],
    notes: params[2],
    categoryId: params[3],
    categoryRegistryId: params[4],
    createdAt: params[5],
    updatedAt: params[6],
    completedAt: params[7],
    lastActionAt: params[8],
    archivedAt: params[9],
    deletedAt: params[10],
    isArchived: params[11],
    isDeleted: params[12],
    privacyLevel: params[13],
    widgetEligible: params[14],
    presetId: params[15]
  };
}

function widgetSnapshotRow(params: SqliteParams): SqliteRow {
  return {
    id: params[0],
    widgetId: params[1],
    snapshotVersion: params[2],
    generatedAt: params[3],
    payload: params[4],
    privacyLevel: params[5],
    privacyMode: params[6],
    expiresAt: params[7]
  };
}

function auditLogRow(params: SqliteParams): SqliteRow {
  return {
    id: params[0],
    eventType: params[1],
    entityType: params[2],
    entityId: params[3],
    timestamp: params[4],
    severity: params[5],
    details: params[6]
  };
}

function premiumEntitlementRow(params: SqliteParams): SqliteRow {
  return {
    id: params[0],
    planId: params[1],
    status: params[2],
    activatedAt: params[3],
    expiresAt: params[4],
    lastValidatedAt: params[5],
    source: params[6]
  };
}

function rows<TRow extends SqliteRow>(sourceRows: ReadonlyArray<SqliteRow>): ReadonlyArray<TRow> {
  return sourceRows.map((row) => ({ ...row }) as TRow);
}

function normalizeSql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim().toLowerCase();
}

function successfulMigration(id: string, executionOrder: string[]): MigrationDefinition {
  return {
    id,
    description: id,
    up: async () => {
      executionOrder.push(id);
      return dataSuccess(undefined);
    },
    down: async () => dataSuccess(undefined)
  };
}

function failingMigration(id: string): MigrationDefinition {
  return {
    id,
    description: id,
    up: async () =>
      dataFailure(
        createPersistenceError({
          code: "DATA_MIGRATION_FAILED",
          developerMessage: "Expected migration failure."
        })
      ),
    down: async () => dataSuccess(undefined)
  };
}

async function listSourceFiles(directory: string): Promise<ReadonlyArray<string>> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        return listSourceFiles(entryPath);
      }

      return entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") ? [entryPath] : [];
    })
  );

  return files.flat();
}

function samplePersistedMoment(id: string): PersistedMoment {
  return {
    id,
    title: "Vehicle inspection",
    notes: "Annual inspection",
    categoryId: "vehicle",
    categoryRegistryId: "vehicle",
    createdAt: timestamp,
    updatedAt: timestamp,
    completedAt: null,
    lastActionAt: null,
    archivedAt: null,
    deletedAt: null,
    isArchived: false,
    isDeleted: false,
    privacyLevel: "private",
    widgetEligible: true,
    presetId: "vehicle-inspection"
  };
}

import { dataFailure, dataSuccess, type DataResult } from "../../dataResult";
import { createPersistenceError } from "../../persistenceErrors";
import type { SqliteAdapter, SqliteParams, SqliteRow } from "../../sqlite/sqliteAdapter";
import { isPersistenceError, normalizeSqliteError } from "../../sqlite/sqliteErrors";
import type {
  PersistedAppSetting,
  PersistedAuditLog,
  PersistedId,
  PersistedMoment,
  PersistedPremiumEntitlement,
  PersistedWidgetSnapshot,
  WidgetSnapshotPayload
} from "../entities";
import type {
  AuditLogRepository,
  MomentRepository,
  MomentSearchInput,
  MomentUpdateInput,
  PremiumEntitlementRepository,
  SettingsRepository,
  WidgetSnapshotRepository
} from "../repositoryContracts";

export type SqliteRepositories = Readonly<{
  momentRepository: MomentRepository;
  settingsRepository: SettingsRepository;
  widgetSnapshotRepository: WidgetSnapshotRepository;
  auditLogRepository: AuditLogRepository;
  premiumEntitlementRepository: PremiumEntitlementRepository;
}>;

type MomentRow = SqliteRow &
  Readonly<{
    id: string;
    title: string;
    notes: string | null;
    categoryId: string;
    categoryRegistryId: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    lastActionAt: string | null;
    archivedAt: string | null;
    deletedAt: string | null;
    isArchived: number;
    isDeleted: number;
    privacyLevel: string;
    widgetEligible: number;
    presetId: string | null;
  }>;

type SettingRow = SqliteRow & PersistedAppSetting;

type WidgetSnapshotRow = SqliteRow &
  Omit<PersistedWidgetSnapshot, "payload"> &
  Readonly<{
    payload: string;
  }>;

type AuditLogRow = SqliteRow &
  Omit<PersistedAuditLog, "details"> &
  Readonly<{
    details: string;
  }>;

type PremiumEntitlementRow = SqliteRow & PersistedPremiumEntitlement;

export function createSqliteRepositories(adapter: SqliteAdapter): SqliteRepositories {
  const momentRepository: MomentRepository = {
    create: async (moment) =>
      writeRepositoryResult("create moment", async () => {
        await adapter.execute(
          `INSERT INTO moments (
            id,
            title,
            notes,
            categoryId,
            categoryRegistryId,
            createdAt,
            updatedAt,
            completedAt,
            lastActionAt,
            archivedAt,
            deletedAt,
            isArchived,
            isDeleted,
            privacyLevel,
            widgetEligible,
            presetId
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            moment.id,
            moment.title,
            moment.notes,
            moment.categoryId,
            moment.categoryRegistryId,
            moment.createdAt,
            moment.updatedAt,
            moment.completedAt,
            moment.lastActionAt,
            moment.archivedAt,
            moment.deletedAt,
            booleanToInteger(moment.isArchived),
            booleanToInteger(moment.isDeleted),
            moment.privacyLevel,
            booleanToInteger(moment.widgetEligible),
            moment.presetId
          ]
        );
        return moment;
      }),
    getById: async (id) =>
      readRepositoryResult("get moment by id", async () => {
        const rows = await adapter.query<MomentRow>(`${MOMENT_SELECT_SQL} WHERE id = ? LIMIT 1`, [
          id
        ]);
        return rows[0] ? toPersistedMoment(rows[0]) : null;
      }),
    listActive: async () =>
      readRepositoryResult("list active moments", async () => {
        const rows = await adapter.query<MomentRow>(
          `${MOMENT_SELECT_SQL} WHERE isArchived = 0 AND isDeleted = 0 ORDER BY updatedAt DESC`
        );
        return rows.map(toPersistedMoment);
      }),
    search: async (input: MomentSearchInput) =>
      readRepositoryResult("search moments", async () => {
        const query = `%${input.query.trim().toLowerCase()}%`;
        const rows = await adapter.query<MomentRow>(
          `${MOMENT_SELECT_SQL}
          WHERE isDeleted = 0 AND (LOWER(title) LIKE ? OR LOWER(COALESCE(notes, '')) LIKE ?)
          ORDER BY updatedAt DESC
          LIMIT ?`,
          [query, query, input.limit ?? -1]
        );
        return rows.map(toPersistedMoment);
      }),
    update: async (id, input) =>
      writeRepositoryResult("update moment", async () => {
        const updateParts = toMomentUpdateParts(input);
        if (updateParts.params.length > 0) {
          await adapter.execute(
            `UPDATE moments SET ${updateParts.assignments.join(", ")} WHERE id = ?`,
            [...updateParts.params, id]
          );
        }

        const updatedMoment = await getMomentOrNull(adapter, id);
        if (!updatedMoment) {
          throw recordNotFound(id);
        }

        return updatedMoment;
      }),
    archive: async (id, archivedAt) =>
      writeRepositoryResult("archive moment", async () => {
        await adapter.execute(
          "UPDATE moments SET archivedAt = ?, isArchived = 1, updatedAt = ? WHERE id = ?",
          [archivedAt, archivedAt, id]
        );
        const updatedMoment = await getMomentOrNull(adapter, id);
        if (!updatedMoment) {
          throw recordNotFound(id);
        }

        return updatedMoment;
      }),
    restore: async (id, restoredAt) =>
      writeRepositoryResult("restore moment", async () => {
        await adapter.execute(
          `UPDATE moments
          SET archivedAt = NULL, deletedAt = NULL, isArchived = 0, isDeleted = 0, updatedAt = ?
          WHERE id = ?`,
          [restoredAt, id]
        );
        const updatedMoment = await getMomentOrNull(adapter, id);
        if (!updatedMoment) {
          throw recordNotFound(id);
        }

        return updatedMoment;
      }),
    softDelete: async (id, deletedAt) =>
      writeRepositoryResult("soft delete moment", async () => {
        await adapter.execute(
          "UPDATE moments SET deletedAt = ?, isDeleted = 1, updatedAt = ? WHERE id = ?",
          [deletedAt, deletedAt, id]
        );
        const updatedMoment = await getMomentOrNull(adapter, id);
        if (!updatedMoment) {
          throw recordNotFound(id);
        }

        return updatedMoment;
      })
  };

  const settingsRepository: SettingsRepository = {
    get: async (settingKey) =>
      readRepositoryResult("get setting", async () => {
        const rows = await adapter.query<SettingRow>(
          `SELECT id, settingKey, settingValue, updatedAt
          FROM app_settings
          WHERE settingKey = ?
          LIMIT 1`,
          [settingKey]
        );
        return rows[0] ? { ...rows[0] } : null;
      }),
    set: async (setting) =>
      writeRepositoryResult("set setting", async () => {
        await adapter.execute(
          `INSERT INTO app_settings (id, settingKey, settingValue, updatedAt)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(settingKey) DO UPDATE SET
            id = excluded.id,
            settingValue = excluded.settingValue,
            updatedAt = excluded.updatedAt`,
          [setting.id, setting.settingKey, setting.settingValue, setting.updatedAt]
        );
        return setting;
      }),
    list: async () =>
      readRepositoryResult("list settings", async () => {
        const rows = await adapter.query<SettingRow>(
          "SELECT id, settingKey, settingValue, updatedAt FROM app_settings ORDER BY settingKey ASC"
        );
        return rows.map((row) => ({ ...row }));
      })
  };

  const widgetSnapshotRepository: WidgetSnapshotRepository = {
    getByWidgetId: async (widgetId) =>
      readRepositoryResult("get widget snapshot by widget id", async () => {
        const rows = await adapter.query<WidgetSnapshotRow>(
          `${WIDGET_SNAPSHOT_SELECT_SQL} WHERE widgetId = ? LIMIT 1`,
          [widgetId]
        );
        return rows[0] ? toPersistedWidgetSnapshot(rows[0]) : null;
      }),
    save: async (snapshot) =>
      writeRepositoryResult("save widget snapshot", async () => {
        await adapter.execute(
          `INSERT INTO widget_snapshots (
            id,
            widgetId,
            snapshotVersion,
            generatedAt,
            payload,
            privacyLevel,
            privacyMode,
            expiresAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            widgetId = excluded.widgetId,
            snapshotVersion = excluded.snapshotVersion,
            generatedAt = excluded.generatedAt,
            payload = excluded.payload,
            privacyLevel = excluded.privacyLevel,
            privacyMode = excluded.privacyMode,
            expiresAt = excluded.expiresAt`,
          [
            snapshot.id,
            snapshot.widgetId,
            snapshot.snapshotVersion,
            snapshot.generatedAt,
            JSON.stringify(snapshot.payload),
            snapshot.privacyLevel,
            snapshot.privacyMode,
            snapshot.expiresAt
          ]
        );
        return snapshot;
      }),
    remove: async (id) =>
      writeRepositoryResult("remove widget snapshot", async () => {
        await adapter.execute("DELETE FROM widget_snapshots WHERE id = ?", [id]);
        return undefined;
      }),
    list: async () =>
      readRepositoryResult("list widget snapshots", async () => {
        const rows = await adapter.query<WidgetSnapshotRow>(
          `${WIDGET_SNAPSHOT_SELECT_SQL} ORDER BY generatedAt DESC`
        );
        return rows.map(toPersistedWidgetSnapshot);
      })
  };

  const auditLogRepository: AuditLogRepository = {
    append: async (entry) =>
      writeRepositoryResult("append audit log", async () => {
        await adapter.execute(
          `INSERT INTO audit_logs (
            id,
            eventType,
            entityType,
            entityId,
            timestamp,
            severity,
            details
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            entry.id,
            entry.eventType,
            entry.entityType,
            entry.entityId,
            entry.timestamp,
            entry.severity,
            JSON.stringify(entry.details)
          ]
        );
        return entry;
      }),
    listRecent: async (limit) =>
      readRepositoryResult("list recent audit logs", async () => {
        const rows = await adapter.query<AuditLogRow>(
          `${AUDIT_LOG_SELECT_SQL} ORDER BY timestamp DESC LIMIT ?`,
          [limit]
        );
        return rows.map(toPersistedAuditLog);
      })
  };

  const premiumEntitlementRepository: PremiumEntitlementRepository = {
    getCurrent: async () =>
      readRepositoryResult("get premium entitlement", async () => {
        const rows = await adapter.query<PremiumEntitlementRow>(
          `${PREMIUM_ENTITLEMENT_SELECT_SQL} ORDER BY lastValidatedAt DESC LIMIT 1`
        );
        return rows[0] ? { ...rows[0] } : null;
      }),
    save: async (entitlement) =>
      writeRepositoryResult("save premium entitlement", async () => {
        await adapter.transaction(async (transactionAdapter) => {
          await transactionAdapter.execute("DELETE FROM premium_entitlements");
          await transactionAdapter.execute(
            `INSERT INTO premium_entitlements (
              id,
              planId,
              status,
              activatedAt,
              expiresAt,
              lastValidatedAt,
              source
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              entitlement.id,
              entitlement.planId,
              entitlement.status,
              entitlement.activatedAt,
              entitlement.expiresAt,
              entitlement.lastValidatedAt,
              entitlement.source
            ]
          );
        });
        return entitlement;
      }),
    clear: async () =>
      writeRepositoryResult("clear premium entitlement", async () => {
        await adapter.execute("DELETE FROM premium_entitlements");
        return undefined;
      })
  };

  return {
    momentRepository,
    settingsRepository,
    widgetSnapshotRepository,
    auditLogRepository,
    premiumEntitlementRepository
  };
}

const MOMENT_SELECT_SQL = `SELECT
  id,
  title,
  notes,
  categoryId,
  categoryRegistryId,
  createdAt,
  updatedAt,
  completedAt,
  lastActionAt,
  archivedAt,
  deletedAt,
  isArchived,
  isDeleted,
  privacyLevel,
  widgetEligible,
  presetId
FROM moments`;

const WIDGET_SNAPSHOT_SELECT_SQL = `SELECT
  id,
  widgetId,
  snapshotVersion,
  generatedAt,
  payload,
  privacyLevel,
  privacyMode,
  expiresAt
FROM widget_snapshots`;

const AUDIT_LOG_SELECT_SQL = `SELECT
  id,
  eventType,
  entityType,
  entityId,
  timestamp,
  severity,
  details
FROM audit_logs`;

const PREMIUM_ENTITLEMENT_SELECT_SQL = `SELECT
  id,
  planId,
  status,
  activatedAt,
  expiresAt,
  lastValidatedAt,
  source
FROM premium_entitlements`;

async function getMomentOrNull(
  adapter: SqliteAdapter,
  id: PersistedId
): Promise<PersistedMoment | null> {
  const rows = await adapter.query<MomentRow>(`${MOMENT_SELECT_SQL} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ? toPersistedMoment(rows[0]) : null;
}

function toPersistedMoment(row: MomentRow): PersistedMoment {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes,
    categoryId: row.categoryId,
    categoryRegistryId: row.categoryRegistryId as PersistedMoment["categoryRegistryId"],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    completedAt: row.completedAt,
    lastActionAt: row.lastActionAt,
    archivedAt: row.archivedAt,
    deletedAt: row.deletedAt,
    isArchived: integerToBoolean(row.isArchived),
    isDeleted: integerToBoolean(row.isDeleted),
    privacyLevel: row.privacyLevel as PersistedMoment["privacyLevel"],
    widgetEligible: integerToBoolean(row.widgetEligible),
    presetId: row.presetId as PersistedMoment["presetId"]
  };
}

function toPersistedWidgetSnapshot(row: WidgetSnapshotRow): PersistedWidgetSnapshot {
  return {
    id: row.id,
    widgetId: row.widgetId,
    snapshotVersion: row.snapshotVersion,
    generatedAt: row.generatedAt,
    payload: parseJsonRecord(row.payload),
    privacyLevel: row.privacyLevel,
    privacyMode: row.privacyMode,
    expiresAt: row.expiresAt
  };
}

function toPersistedAuditLog(row: AuditLogRow): PersistedAuditLog {
  return {
    id: row.id,
    eventType: row.eventType,
    entityType: row.entityType,
    entityId: row.entityId,
    timestamp: row.timestamp,
    severity: row.severity,
    details: parseJsonRecord(row.details)
  };
}

function toMomentUpdateParts(input: MomentUpdateInput): Readonly<{
  assignments: ReadonlyArray<string>;
  params: SqliteParams;
}> {
  const assignments: string[] = [];
  const params: SqliteParams[number][] = [];
  const fields: ReadonlyArray<
    readonly [keyof MomentUpdateInput, string, (value: unknown) => SqliteParams[number]]
  > = [
    ["title", "title", stringOrNullParam],
    ["notes", "notes", stringOrNullParam],
    ["categoryId", "categoryId", stringOrNullParam],
    ["categoryRegistryId", "categoryRegistryId", stringOrNullParam],
    ["updatedAt", "updatedAt", stringOrNullParam],
    ["completedAt", "completedAt", stringOrNullParam],
    ["lastActionAt", "lastActionAt", stringOrNullParam],
    ["archivedAt", "archivedAt", stringOrNullParam],
    ["deletedAt", "deletedAt", stringOrNullParam],
    ["isArchived", "isArchived", booleanParam],
    ["isDeleted", "isDeleted", booleanParam],
    ["privacyLevel", "privacyLevel", stringOrNullParam],
    ["widgetEligible", "widgetEligible", booleanParam],
    ["presetId", "presetId", stringOrNullParam]
  ];

  for (const [inputKey, columnName, serialize] of fields) {
    const value = input[inputKey];
    if (value !== undefined) {
      assignments.push(`${columnName} = ?`);
      params.push(serialize(value));
    }
  }

  return {
    assignments,
    params
  };
}

function stringOrNullParam(value: unknown): SqliteParams[number] {
  return typeof value === "string" ? value : null;
}

function booleanParam(value: unknown): SqliteParams[number] {
  return value === true ? 1 : 0;
}

function booleanToInteger(value: boolean): number {
  return value ? 1 : 0;
}

function integerToBoolean(value: number): boolean {
  return value === 1;
}

function parseJsonRecord(value: string): WidgetSnapshotPayload {
  const parsed: unknown = JSON.parse(value);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw createPersistenceError({
      code: "DATA_VALIDATION_FAILED",
      developerMessage: "Persisted JSON payload is not an object."
    });
  }

  const record: Record<string, string | number | boolean | null> = {};
  for (const [key, item] of Object.entries(parsed)) {
    if (
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean" ||
      item === null
    ) {
      record[key] = item;
    }
  }

  return record;
}

async function readRepositoryResult<T>(
  operation: string,
  work: () => Promise<T>
): Promise<DataResult<T>> {
  try {
    return dataSuccess(await work());
  } catch (cause) {
    return dataFailure(toRepositoryError(operation, cause));
  }
}

async function writeRepositoryResult<T>(
  operation: string,
  work: () => Promise<T>
): Promise<DataResult<T>> {
  try {
    return dataSuccess(await work());
  } catch (cause) {
    return dataFailure(toRepositoryError(operation, cause));
  }
}

function toRepositoryError(operation: string, cause: unknown) {
  if (isPersistenceError(cause)) {
    return cause;
  }

  return normalizeSqliteError("repository", cause, `SQLite repository failed to ${operation}.`);
}

function recordNotFound(id: PersistedId) {
  return createPersistenceError({
    code: "DATA_RECORD_NOT_FOUND",
    developerMessage: `Record not found: ${id}`
  });
}

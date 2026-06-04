import type { SqliteAdapter } from "../sqlite";
import { dataFailure, dataSuccess } from "../dataResult";
import { createPersistenceError } from "../persistenceErrors";
import type { MigrationDefinition } from "./migrationContracts";

export const INITIAL_SCHEMA_MIGRATION_ID = "0001_initial_schema";

export function initialSchemaMigration(adapter: SqliteAdapter): MigrationDefinition {
  return {
    id: INITIAL_SCHEMA_MIGRATION_ID,
    description: "Create initial Momenta SQLite schema.",
    up: async () => {
      try {
        await adapter.execute(INITIAL_SCHEMA_SQL);
        return dataSuccess(undefined);
      } catch (cause) {
        return dataFailure(
          createPersistenceError({
            code: "DATA_MIGRATION_FAILED",
            developerMessage: "Initial SQLite schema migration failed.",
            cause
          })
        );
      }
    },
    down: async () =>
      dataFailure(
        createPersistenceError({
          code: "DATA_MIGRATION_FAILED",
          developerMessage: "Initial SQLite schema rollback is intentionally not supported."
        })
      )
  };
}

export const INITIAL_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS migration_metadata (
  id TEXT PRIMARY KEY NOT NULL,
  migrationId TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  startedAt TEXT NOT NULL,
  completedAt TEXT,
  errorMessage TEXT
);

CREATE TABLE IF NOT EXISTS moments (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  categoryId TEXT NOT NULL,
  categoryRegistryId TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  completedAt TEXT,
  lastActionAt TEXT,
  archivedAt TEXT,
  deletedAt TEXT,
  isArchived INTEGER NOT NULL DEFAULT 0,
  isDeleted INTEGER NOT NULL DEFAULT 0,
  privacyLevel TEXT NOT NULL,
  widgetEligible INTEGER NOT NULL DEFAULT 0,
  presetId TEXT
);

CREATE INDEX IF NOT EXISTS idx_moments_active ON moments (isArchived, isDeleted, updatedAt);
CREATE INDEX IF NOT EXISTS idx_moments_search ON moments (title, notes);

CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY NOT NULL,
  settingKey TEXT NOT NULL UNIQUE,
  settingValue TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS widget_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  widgetId TEXT NOT NULL,
  snapshotVersion TEXT NOT NULL,
  generatedAt TEXT NOT NULL,
  payload TEXT NOT NULL,
  privacyLevel TEXT NOT NULL,
  privacyMode TEXT NOT NULL DEFAULT 'standard',
  expiresAt TEXT
);

CREATE INDEX IF NOT EXISTS idx_widget_snapshots_widgetId ON widget_snapshots (widgetId);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY NOT NULL,
  eventType TEXT NOT NULL,
  entityType TEXT,
  entityId TEXT,
  timestamp TEXT NOT NULL,
  severity TEXT NOT NULL,
  details TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs (timestamp);

CREATE TABLE IF NOT EXISTS premium_entitlements (
  id TEXT PRIMARY KEY NOT NULL,
  planId TEXT NOT NULL,
  status TEXT NOT NULL,
  activatedAt TEXT,
  expiresAt TEXT,
  lastValidatedAt TEXT,
  source TEXT NOT NULL
);
`;

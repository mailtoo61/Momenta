import type { DataResult } from "../dataResult";

export type MigrationId = string;

export const MIGRATION_STATUSES = [
  "pending",
  "running",
  "completed",
  "failed",
  "rolled-back"
] as const;

export type MigrationStatus = (typeof MIGRATION_STATUSES)[number];

export type MigrationDefinition = Readonly<{
  id: MigrationId;
  description: string;
  up: () => Promise<DataResult<void>>;
  down: () => Promise<DataResult<void>>;
}>;

export type MigrationResult = Readonly<{
  id: MigrationId;
  status: MigrationStatus;
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
}>;

export type MigrationRunner = {
  listPending: () => Promise<DataResult<ReadonlyArray<MigrationDefinition>>>;
  run: (migration: MigrationDefinition) => Promise<DataResult<MigrationResult>>;
  rollback: (migration: MigrationDefinition) => Promise<DataResult<MigrationResult>>;
};

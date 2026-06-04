import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  dataFailure,
  dataSuccess,
  mapPersistenceErrorToAppError,
  PERSISTENCE_ERROR_CODES,
  type DataResult,
  type PersistenceError
} from "../../src/data";
import { SUPPORTED_EXPORT_FORMATS, type ExportContract } from "../../src/data/export";
import { type ImportContract, type ImportValidationResult } from "../../src/data/import";
import { MIGRATION_STATUSES, type MigrationRunner } from "../../src/data/migrations";
import { RECOVERY_ISSUE_TYPES, type RecoveryPlan } from "../../src/data/recovery";
import {
  type AuditLogRepository,
  type MomentRepository,
  type PersistedAuditLog,
  type PersistedMoment,
  type PersistedPremiumEntitlement,
  type PersistedWidgetSnapshot,
  type PremiumEntitlementRepository,
  type SettingsRepository,
  type WidgetSnapshotRepository
} from "../../src/data/repositories";

const isoTimestamp = "2026-06-04T00:00:00.000Z";

const sampleMoment: PersistedMoment = {
  id: "moment-1",
  title: "Persisted title",
  notes: null,
  categoryId: "category-1",
  categoryRegistryId: "family",
  createdAt: isoTimestamp,
  updatedAt: isoTimestamp,
  completedAt: null,
  lastActionAt: null,
  archivedAt: null,
  deletedAt: null,
  isArchived: false,
  isDeleted: false,
  privacyLevel: "private",
  widgetEligible: true,
  presetId: null
};

const sampleWidgetSnapshot: PersistedWidgetSnapshot = {
  id: "snapshot-1",
  widgetId: "home-small",
  snapshotVersion: "v1",
  generatedAt: isoTimestamp,
  payload: {
    count: 1
  },
  privacyLevel: "private",
  privacyMode: "standard",
  expiresAt: null
};

const sampleAuditLog: PersistedAuditLog = {
  id: "audit-1",
  eventType: "moment_created",
  entityType: "moment",
  entityId: "moment-1",
  timestamp: isoTimestamp,
  severity: "info",
  details: {
    categoryId: "family"
  }
};

const samplePremiumEntitlement: PersistedPremiumEntitlement = {
  id: "entitlement-1",
  planId: "free",
  status: "free",
  activatedAt: isoTimestamp,
  expiresAt: null,
  lastValidatedAt: isoTimestamp,
  source: "local"
};

const notFoundError: PersistenceError = {
  code: "DATA_RECORD_NOT_FOUND",
  developerMessage: "Record was not found."
};

describe("data contract foundation", () => {
  it("type-checks repository contracts through compile-safe test doubles", async () => {
    const momentRepository: MomentRepository = {
      create: async (moment) => dataSuccess(moment),
      getById: async () => dataSuccess(sampleMoment),
      listActive: async () => dataSuccess([sampleMoment]),
      search: async () => dataSuccess([sampleMoment]),
      update: async () => dataSuccess(sampleMoment),
      archive: async () => dataSuccess(sampleMoment),
      restore: async () => dataSuccess(sampleMoment),
      softDelete: async () => dataSuccess(sampleMoment)
    };

    const settingsRepository: SettingsRepository = {
      get: async () => dataSuccess(null),
      set: async (setting) => dataSuccess(setting),
      list: async () => dataSuccess([])
    };

    const widgetSnapshotRepository: WidgetSnapshotRepository = {
      getByWidgetId: async () => dataSuccess(sampleWidgetSnapshot),
      save: async (snapshot) => dataSuccess(snapshot),
      remove: async () => dataSuccess(undefined),
      list: async () => dataSuccess([sampleWidgetSnapshot])
    };

    const auditLogRepository: AuditLogRepository = {
      append: async (entry) => dataSuccess(entry),
      listRecent: async () => dataSuccess([sampleAuditLog])
    };

    const premiumEntitlementRepository: PremiumEntitlementRepository = {
      getCurrent: async () => dataSuccess(samplePremiumEntitlement),
      save: async (entitlement) => dataSuccess(entitlement),
      clear: async () => dataSuccess(undefined)
    };

    await expect(momentRepository.create(sampleMoment)).resolves.toEqual(dataSuccess(sampleMoment));
    await expect(settingsRepository.list()).resolves.toEqual(dataSuccess([]));
    await expect(widgetSnapshotRepository.list()).resolves.toEqual(
      dataSuccess([sampleWidgetSnapshot])
    );
    await expect(auditLogRepository.listRecent(5)).resolves.toEqual(dataSuccess([sampleAuditLog]));
    await expect(premiumEntitlementRepository.getCurrent()).resolves.toEqual(
      dataSuccess(samplePremiumEntitlement)
    );
  });

  it("keeps persisted date fields as strings", () => {
    expect(typeof sampleMoment.createdAt).toBe("string");
    expect(typeof sampleMoment.updatedAt).toBe("string");
    expect(typeof sampleWidgetSnapshot.generatedAt).toBe("string");
    expect(typeof sampleAuditLog.timestamp).toBe("string");
    expect(sampleMoment.createdAt).not.toBeInstanceOf(Date);
  });

  it("keeps migration statuses valid and unique", () => {
    expect(MIGRATION_STATUSES).toEqual([
      "pending",
      "running",
      "completed",
      "failed",
      "rolled-back"
    ]);
    expect(new Set(MIGRATION_STATUSES).size).toBe(MIGRATION_STATUSES.length);

    const runner: MigrationRunner = {
      listPending: async () => dataSuccess([]),
      run: async (migration) =>
        dataSuccess({
          id: migration.id,
          status: "completed",
          startedAt: isoTimestamp,
          completedAt: isoTimestamp,
          errorMessage: null
        }),
      rollback: async (migration) =>
        dataSuccess({
          id: migration.id,
          status: "rolled-back",
          startedAt: isoTimestamp,
          completedAt: isoTimestamp,
          errorMessage: null
        })
    };

    expect(runner).toBeDefined();
  });

  it("keeps export contracts versioned and json-only for the placeholder", () => {
    const exportContract: ExportContract = {
      schemaVersion: "v1",
      format: "json",
      exportedAt: isoTimestamp,
      moments: [sampleMoment],
      settings: [],
      widgetSnapshots: [sampleWidgetSnapshot],
      auditLogs: [sampleAuditLog],
      premiumEntitlement: samplePremiumEntitlement
    };

    expect(SUPPORTED_EXPORT_FORMATS).toEqual(["json"]);
    expect(exportContract.schemaVersion).toBe("v1");
  });

  it("supports successful and failed import validation results", () => {
    const successfulResult: ImportValidationResult = {
      isValid: true,
      issues: []
    };
    const failedResult: ImportValidationResult = {
      isValid: false,
      issues: [
        {
          code: "missing-field",
          severity: "error",
          path: "schemaVersion",
          message: "Missing schema version."
        }
      ]
    };

    const importContract: ImportContract = {
      schemaVersion: "v1",
      validate: () => failedResult,
      parse: () => null
    };

    expect(successfulResult.isValid).toBe(true);
    expect(importContract.validate({}).isValid).toBe(false);
  });

  it("keeps recovery issue types typed and unique", () => {
    const recoveryPlan: RecoveryPlan = {
      issues: [
        {
          type: "migration-failed",
          message: "Migration failed.",
          detectedAt: isoTimestamp
        }
      ],
      actions: [
        {
          type: "rollback-migration",
          description: "Rollback the failed migration."
        }
      ]
    };

    expect(new Set(RECOVERY_ISSUE_TYPES).size).toBe(RECOVERY_ISSUE_TYPES.length);
    expect(recoveryPlan.issues[0]?.type).toBe("migration-failed");
  });

  it("maps persistence error codes safely into shared app errors", () => {
    const result: DataResult<null> = dataFailure(notFoundError);
    const mappedError = mapPersistenceErrorToAppError(notFoundError);

    expect(PERSISTENCE_ERROR_CODES).toContain("DATA_RECORD_NOT_FOUND");
    expect(result.isSuccess).toBe(false);
    expect(mappedError.userMessageKey).toBe("errors.unknown");
  });

  it("keeps repository contracts free of UI and platform imports", async () => {
    const repositoryFiles = ["entities.ts", "repositoryContracts.ts"];

    for (const fileName of repositoryFiles) {
      const source = await readFile(
        join(process.cwd(), "src", "data", "repositories", fileName),
        "utf8"
      );
      const importLines = source
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");

      expect(importLines).not.toContain("../../features");
      expect(importLines).not.toContain("../../app");
      expect(importLines).not.toContain("../../platform");
      expect(importLines).not.toContain("react-native");
      expect(importLines).not.toContain("expo");
      expect(importLines).not.toContain("sqlite");
    }
  });
});

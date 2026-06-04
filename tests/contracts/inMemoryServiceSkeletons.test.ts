import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { createInMemoryRepositories, type PersistedMoment } from "../../src/data/repositories";
import { toPersistedAppSetting } from "../../src/data/mappers";
import type { AnalyticsProvider } from "../../src/platform/analytics";
import { createAuditService } from "../../src/services/audit";
import { createAnalyticsService } from "../../src/services/analytics";
import { createReminderOrchestrationService } from "../../src/services/reminders";
import { createServiceContainer } from "../../src/services";
import { createWidgetSnapshotService } from "../../src/services/widgets";
import type { ReminderRuleId } from "../../src/domain/reminders";

const timestamp = "2026-06-04T00:00:00.000Z";

const testLogger = {
  log: () => undefined
};

describe("in-memory repositories and service skeletons", () => {
  it("supports in-memory MomentRepository create/get/list/search/update/archive/restore/softDelete", async () => {
    const repositories = createInMemoryRepositories();
    const moment = samplePersistedMoment("moment-1");

    await expect(repositories.momentRepository.create(moment)).resolves.toMatchObject({
      isSuccess: true,
      value: moment
    });
    await expect(repositories.momentRepository.getById("moment-1")).resolves.toMatchObject({
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

    const updated = await repositories.momentRepository.update("moment-1", {
      title: "Updated title",
      updatedAt: timestamp
    });
    expect(updated.isSuccess && updated.value.title).toBe("Updated title");

    const archived = await repositories.momentRepository.archive("moment-1", timestamp);
    expect(archived.isSuccess && archived.value.isArchived).toBe(true);

    const restored = await repositories.momentRepository.restore("moment-1", timestamp);
    expect(restored.isSuccess && restored.value.isArchived).toBe(false);

    const deleted = await repositories.momentRepository.softDelete("moment-1", timestamp);
    expect(deleted.isSuccess && deleted.value.isDeleted).toBe(true);
  });

  it("supports in-memory SettingsRepository get/set/list", async () => {
    const repositories = createInMemoryRepositories();
    const setting = toPersistedAppSetting("theme", "system", timestamp);

    await expect(repositories.settingsRepository.set(setting)).resolves.toMatchObject({
      isSuccess: true,
      value: setting
    });
    await expect(repositories.settingsRepository.get("theme")).resolves.toMatchObject({
      isSuccess: true,
      value: setting
    });
    await expect(repositories.settingsRepository.list()).resolves.toMatchObject({
      isSuccess: true,
      value: [setting]
    });
  });

  it("supports in-memory WidgetSnapshotRepository save/get/list/remove", async () => {
    const repositories = createInMemoryRepositories();
    const snapshot = {
      id: "snapshot-1",
      widgetId: "home-small",
      snapshotVersion: "v1",
      generatedAt: timestamp,
      payload: { payloadVersion: "v1" },
      privacyLevel: "private" as const,
      privacyMode: "standard" as const,
      expiresAt: null
    };

    await expect(repositories.widgetSnapshotRepository.save(snapshot)).resolves.toMatchObject({
      isSuccess: true,
      value: snapshot
    });
    await expect(
      repositories.widgetSnapshotRepository.getByWidgetId("home-small")
    ).resolves.toMatchObject({
      isSuccess: true,
      value: snapshot
    });
    await expect(repositories.widgetSnapshotRepository.list()).resolves.toMatchObject({
      isSuccess: true,
      value: [snapshot]
    });
    await expect(repositories.widgetSnapshotRepository.remove("snapshot-1")).resolves.toMatchObject(
      {
        isSuccess: true
      }
    );
  });

  it("records approved audit events through AuditService", async () => {
    const repositories = createInMemoryRepositories();
    const auditService = createAuditService(
      {
        auditLogRepository: repositories.auditLogRepository,
        logger: testLogger
      },
      { idFactory: () => "audit-1", nowIso: () => timestamp }
    );

    await expect(auditService.record("moment_created", { momentId: "moment-1" })).resolves.toEqual({
      isSuccess: true,
      value: undefined
    });
    await expect(auditService.listRecent()).resolves.toMatchObject({
      isSuccess: true,
      value: [{ eventType: "moment_created" }]
    });
  });

  it("tracks approved analytics events through provider abstraction", async () => {
    const trackedEvents: string[] = [];
    const analyticsProvider: AnalyticsProvider = {
      track: async (eventName) => {
        trackedEvents.push(eventName);
      }
    };
    const analyticsService = createAnalyticsService({
      analyticsProvider,
      logger: testLogger
    });

    await expect(
      analyticsService.track("moment_created", { categoryId: "family", notes: "blocked" })
    ).resolves.toEqual({ isSuccess: true, value: undefined });
    expect(trackedEvents).toEqual(["moment_created"]);
  });

  it("creates moments through MomentWorkflowService with validation and persistence", async () => {
    const { repositories, momentWorkflowService } = createTestContainer();

    const result = await momentWorkflowService.createMoment({
      title: "Doctor appointment",
      categoryId: "health",
      privacyLevel: "private",
      widgetEligible: false,
      currentPlanId: "free"
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      await expect(repositories.momentRepository.getById(result.value.id)).resolves.toMatchObject({
        isSuccess: true,
        value: result.value
      });
    }
  });

  it("rejects invalid create moment input", async () => {
    const { momentWorkflowService } = createTestContainer();

    const result = await momentWorkflowService.createMoment({
      title: " ",
      categoryId: "family",
      privacyLevel: "private",
      widgetEligible: true,
      currentPlanId: "free"
    });

    expect(result.isSuccess).toBe(false);
  });

  it("archives, restores, and soft deletes moments through MomentWorkflowService", async () => {
    const { momentWorkflowService } = createTestContainer();
    const created = await momentWorkflowService.createMoment({
      title: "Vehicle inspection",
      categoryId: "vehicle",
      privacyLevel: "private",
      widgetEligible: true,
      currentPlanId: "free"
    });

    if (!created.isSuccess) {
      throw new Error("Expected test moment to be created.");
    }

    const archived = await momentWorkflowService.archiveMoment({ id: created.value.id });
    expect(archived.isSuccess && archived.value.isArchived).toBe(true);

    const restored = await momentWorkflowService.restoreMoment({ id: created.value.id });
    expect(restored.isSuccess && restored.value.isArchived).toBe(false);

    const deleted = await momentWorkflowService.softDeleteMoment({ id: created.value.id });
    expect(deleted.isSuccess && deleted.value.isDeleted).toBe(true);
  });

  it("rejects unknown reminder rule ids in ReminderOrchestrationService", async () => {
    const repositories = createInMemoryRepositories();
    await repositories.momentRepository.create(samplePersistedMoment("moment-1"));
    const reminderService = createReminderOrchestrationService({
      momentRepository: repositories.momentRepository,
      notificationProvider: {
        getPermissionStatus: async () => "unknown",
        requestPermission: async () => "undetermined",
        scheduleReminder: async (input) => ({ id: input.id, isScheduled: false }),
        cancelReminder: async () => undefined
      },
      auditService: {
        record: async () => ({ isSuccess: true, value: undefined }),
        recordFailure: async () => ({ isSuccess: true, value: undefined }),
        listRecent: async () => ({ isSuccess: true, value: [] })
      },
      logger: testLogger
    });

    const result = await reminderService.evaluateReminderRules({
      momentId: "moment-1",
      reminderRuleIds: ["unknown-rule" as ReminderRuleId]
    });

    expect(result.isSuccess).toBe(false);
  });

  it("saves widget snapshots through WidgetSnapshotService", async () => {
    const repositories = createInMemoryRepositories();
    const widgetSnapshotService = createWidgetSnapshotService({
      momentRepository: repositories.momentRepository,
      widgetSnapshotRepository: repositories.widgetSnapshotRepository,
      widgetProvider: {
        refreshWidgets: async () => undefined,
        refreshWidget: async () => undefined,
        getWidgetCapabilities: async () => ({
          supportsHomeScreenWidgets: false,
          supportsLockScreenWidgets: false
        })
      },
      auditService: {
        record: async () => ({ isSuccess: true, value: undefined }),
        recordFailure: async () => ({ isSuccess: true, value: undefined }),
        listRecent: async () => ({ isSuccess: true, value: [] })
      },
      logger: testLogger
    });

    const result = await widgetSnapshotService.saveSnapshot({
      snapshot: {
        id: "snapshot-1",
        widgetId: "home-small",
        snapshotVersion: "v1",
        generatedAt: timestamp,
        payload: { payloadVersion: "v1" },
        privacyLevel: "private",
        privacyMode: "standard",
        expiresAt: null
      }
    });

    expect(result.isSuccess).toBe(true);
    await expect(repositories.widgetSnapshotRepository.list()).resolves.toMatchObject({
      isSuccess: true,
      value: [{ id: "snapshot-1" }]
    });
  });

  it("wires services through the service container without concrete SDKs", () => {
    const repositories = createInMemoryRepositories();
    const container = createServiceContainer({
      repositories,
      idFactory: () => "container-id",
      nowIso: () => timestamp
    });

    expect(container.auditService).toBeDefined();
    expect(container.analyticsService).toBeDefined();
    expect(container.homeReadService).toBeDefined();
    expect(container.momentWorkflowService).toBeDefined();
    expect(container.reminderOrchestrationService).toBeDefined();
    expect(container.widgetSnapshotService).toBeDefined();
  });

  it("keeps in-memory repositories and service skeletons free of UI, SQLite, and real SDK imports", async () => {
    const files = [
      "src/data/repositories/inMemory/inMemoryRepositories.ts",
      "src/services/audit/auditService.ts",
      "src/services/analytics/analyticsService.ts",
      "src/services/moments/momentWorkflowService.ts",
      "src/services/reminders/reminderOrchestrationService.ts",
      "src/services/widgets/widgetSnapshotService.ts",
      "src/services/serviceContainer.ts"
    ];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");
      const importLines = source
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");

      expect(importLines).not.toContain("../../app");
      expect(importLines).not.toContain("../../features");
      expect(importLines).not.toContain("react-native");
      expect(importLines).not.toContain("sqlite");
      expect(importLines.toLowerCase()).not.toContain("revenuecat");
    }
  });
});

function createTestContainer() {
  const repositories = createInMemoryRepositories();
  const container = createServiceContainer({
    repositories,
    idFactory: () => "moment-generated",
    nowIso: () => timestamp
  });

  return {
    repositories,
    ...container
  };
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

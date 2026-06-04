import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { AppRuntimeState } from "../../src/app/runtime";
import { selectHomeReadService } from "../../src/app/runtime";
import { createInMemoryRepositories, type PersistedMoment } from "../../src/data/repositories";
import { createServiceContainer } from "../../src/services";
import { createHomeReadService, noopHomeReadService } from "../../src/services/home";

const timestamp = "2026-06-04T00:00:00.000Z";

describe("home read service boundary", () => {
  it("returns an empty HomeScreenViewModel when no moments exist", async () => {
    const repositories = createInMemoryRepositories();
    const homeReadService = createHomeReadService({
      momentRepository: repositories.momentRepository
    });

    const result = await homeReadService.getHomeViewModel();

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.upcoming.items).toEqual([]);
      expect(result.value.overdue.items).toEqual([]);
      expect(result.value.recent.items).toEqual([]);
      expect(result.value.upcoming.emptyDescriptionKey).toBe("home.upcomingEmpty");
    }
  });

  it("builds HomeScreenViewModel sections from in-memory repository data", async () => {
    const repositories = createInMemoryRepositories();
    await repositories.momentRepository.create(samplePersistedMoment("upcoming-1", "vehicle"));
    await repositories.momentRepository.create(samplePersistedMoment("overdue-1", "health"));
    await repositories.momentRepository.create(samplePersistedMoment("recent-1", "family"));
    const homeReadService = createHomeReadService({
      momentRepository: repositories.momentRepository
    });

    const result = await homeReadService.getHomeViewModel({
      momentStates: {
        "overdue-1": {
          countdownDays: 2,
          status: "overdue"
        },
        "recent-1": {
          elapsedDays: 3,
          status: "recent"
        },
        "upcoming-1": {
          countdownDays: 7,
          status: "upcoming"
        }
      }
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.upcoming.items).toHaveLength(1);
      expect(result.value.overdue.items).toHaveLength(1);
      expect(result.value.recent.items).toHaveLength(1);
      expect(result.value.upcoming.items[0]?.timeValue).toBe(7);
      expect(result.value.overdue.items[0]?.statusLabelKey).toBe(
        "momentPresentation.status.overdue"
      );
    }
  });

  it("does not expose persistence models through HomeReadService results", async () => {
    const repositories = createInMemoryRepositories();
    await repositories.momentRepository.create(samplePersistedMoment("moment-1", "vehicle"));
    const homeReadService = createHomeReadService({
      momentRepository: repositories.momentRepository
    });
    const result = await homeReadService.getHomeViewModel({
      momentStates: {
        "moment-1": {
          status: "recent"
        }
      }
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      const item = result.value.recent.items[0];
      expect(item).toBeDefined();
      expect("categoryRegistryId" in (item ?? {})).toBe(false);
      expect("createdAt" in (item ?? {})).toBe(false);
      expect("repositories" in result.value).toBe(false);
      expect("sqliteAdapter" in result.value).toBe(false);
    }
  });

  it("wires HomeReadService through the service container", () => {
    const repositories = createInMemoryRepositories();
    const container = createServiceContainer({
      idFactory: () => "home-service-id",
      nowIso: () => timestamp,
      repositories
    });

    expect(container.homeReadService).toBeDefined();
    expect(Object.keys(container).sort()).toContain("homeReadService");
  });

  it("runtime selector exposes only HomeReadService from ready runtime state", () => {
    const state: AppRuntimeState = {
      bootstrap: {
        appName: "Momenta",
        bootstrappedAt: timestamp,
        environment: "development",
        featureFlags: {
          cloudSyncEnabled: false,
          debugConsoleEnabled: true,
          exportEnabled: false,
          futureAiEnabled: false,
          importEnabled: false,
          premiumEnabled: false,
          weeklySummaryEnabled: false,
          widgetsEnabled: false
        },
        locale: "tr",
        persistenceMode: "inMemory",
        providerRegistryHealth: {},
        services: {
          analyticsService: {
            flush: async () => ({ isSuccess: true, value: undefined }),
            identifyAnonymousUser: async () => ({ isSuccess: true, value: undefined }),
            track: async () => ({ isSuccess: true, value: undefined })
          },
          auditService: {
            listRecent: async () => ({ isSuccess: true, value: [] }),
            record: async () => ({ isSuccess: true, value: undefined }),
            recordFailure: async () => ({ isSuccess: true, value: undefined })
          },
          homeReadService: noopHomeReadService,
          momentWorkflowService: {
            archiveMoment: async () => ({
              isSuccess: true,
              value: samplePersistedMoment("x", "custom")
            }),
            createMoment: async () => ({
              isSuccess: true,
              value: samplePersistedMoment("x", "custom")
            }),
            restoreMoment: async () => ({
              isSuccess: true,
              value: samplePersistedMoment("x", "custom")
            }),
            searchMoments: async () => ({ isSuccess: true, value: [] }),
            softDeleteMoment: async () => ({
              isSuccess: true,
              value: samplePersistedMoment("x", "custom")
            }),
            updateMoment: async () => ({
              isSuccess: true,
              value: samplePersistedMoment("x", "custom")
            })
          },
          reminderOrchestrationService: {
            cancelMomentReminders: async () => ({ isSuccess: true, value: undefined }),
            evaluateReminderRules: async () => ({
              isSuccess: true,
              value: { momentId: "x", rules: [] }
            }),
            rescheduleMomentReminders: async () => ({
              isSuccess: true,
              value: { momentId: "x", scheduledReminderIds: [] }
            }),
            scheduleMomentReminders: async () => ({
              isSuccess: true,
              value: { momentId: "x", scheduledReminderIds: [] }
            })
          },
          widgetSnapshotService: {
            generateSnapshot: async () => ({
              isSuccess: true,
              value: {
                payload: {},
                privacyLevel: "private",
                snapshotVersion: "v1",
                widgetId: "widget"
              }
            }),
            refreshAllSnapshots: async () => ({
              isSuccess: true,
              value: { refreshedSnapshotIds: [] }
            }),
            refreshSnapshotForMoment: async () => ({
              isSuccess: true,
              value: { refreshedSnapshotIds: [] }
            }),
            saveSnapshot: async (input) => ({ isSuccess: true, value: input.snapshot })
          }
        },
        themePreference: "system"
      },
      readyAt: timestamp,
      startedAt: timestamp,
      status: "ready"
    };
    const selected = selectHomeReadService(state);

    expect(selected).toBe(noopHomeReadService);
    expect("repositories" in (selected ?? {})).toBe(false);
    expect("sqliteAdapter" in (selected ?? {})).toBe(false);
  });

  it("keeps Home hook and screen free of persistence, SQLite, and SDK imports", async () => {
    const files = ["src/features/home/useHomeScreenModel.ts", "src/features/home/HomeScreen.tsx"];

    for (const relativePath of files) {
      const importLines = await readImportLines(relativePath);

      expect(importLines).not.toContain("/data/");
      expect(importLines).not.toContain("repositories");
      expect(importLines).not.toContain("sqlite");
      expect(importLines).not.toContain("../../platform");
      expect(importLines.toLowerCase()).not.toContain("revenuecat");
    }
  });

  it("keeps HomeReadService free of concrete SDK, SQLite, and UI component imports", async () => {
    const importLines = await readImportLines("src/services/home/homeReadService.ts");

    expect(importLines).not.toContain("react-native");
    expect(importLines).not.toContain("sqlite");
    expect(importLines).not.toContain("../../platform");
    expect(importLines).not.toContain("../../shared/ui");
    expect(importLines.toLowerCase()).not.toContain("revenuecat");
  });
});

async function readImportLines(relativePath: string): Promise<string> {
  const source = await readFile(join(process.cwd(), relativePath), "utf8");

  return source
    .split("\n")
    .filter((line) => line.trimStart().startsWith("import"))
    .join("\n");
}

function samplePersistedMoment(
  id: string,
  categoryRegistryId: PersistedMoment["categoryRegistryId"]
): PersistedMoment {
  return {
    archivedAt: null,
    categoryId: categoryRegistryId,
    categoryRegistryId,
    completedAt: null,
    createdAt: timestamp,
    deletedAt: null,
    id,
    isArchived: false,
    isDeleted: false,
    lastActionAt: null,
    notes: null,
    presetId: null,
    privacyLevel: "private",
    title: "Service boundary moment",
    updatedAt: timestamp,
    widgetEligible: true
  };
}

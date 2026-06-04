import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { CategoryId, Moment } from "../../src/domain/moments";
import { categoryRegistry } from "../../src/domain/moments";
import { buildHomeScreenViewModel } from "../../src/features/home/homeViewModel";
import {
  mapMomentToListItemViewModel,
  mapMomentToUpcomingViewModel
} from "../../src/features/moments/viewModels";
import { resources } from "../../src/shared/i18n/resources";
import { lightSemanticColors } from "../../src/shared/theme";

describe("moment view models", () => {
  it("maps a valid moment into a UI-safe list item view model", () => {
    const moment = createMoment({ categoryId: "vehicle", id: "moment-1" });
    const viewModel = mapMomentToListItemViewModel({
      countdownDays: 7,
      moment,
      status: "upcoming"
    });

    expect(viewModel).toMatchObject({
      id: "moment-1",
      title: "Vehicle inspection",
      categoryLabelKey: "categories.vehicle.label",
      categoryColor: "vehicle",
      status: "upcoming",
      statusLabelKey: "momentPresentation.status.upcoming",
      timeSummaryLabelKey: "momentPresentation.time.countdownDays",
      timeValue: 7
    });
    expect("repositories" in viewModel).toBe(false);
    expect("sqliteAdapter" in viewModel).toBe(false);
  });

  it("handles unknown category safely with the custom category fallback", () => {
    const moment = createMoment({
      categoryId: "unknown-category" as CategoryId,
      id: "moment-unknown"
    });
    const viewModel = mapMomentToListItemViewModel({
      elapsedDays: 2,
      moment,
      status: "recent"
    });

    expect(viewModel.categoryLabelKey).toBe("categories.custom.label");
    expect(viewModel.categoryColor).toBe("custom");
  });

  it("builds home sections from safe moment read-model input", () => {
    const viewModel = buildHomeScreenViewModel({
      moments: [
        {
          countdownDays: 4,
          moment: createMoment({ categoryId: "vehicle", id: "upcoming-1" }),
          status: "upcoming"
        },
        {
          countdownDays: 1,
          moment: createMoment({ categoryId: "health", id: "overdue-1" }),
          status: "overdue"
        },
        {
          elapsedDays: 3,
          moment: createMoment({ categoryId: "family", id: "recent-1" }),
          status: "recent"
        }
      ]
    });

    expect(viewModel.upcoming.items).toHaveLength(1);
    expect(viewModel.overdue.items).toHaveLength(1);
    expect(viewModel.recent.items).toHaveLength(1);
    expect(viewModel.insight.items).toEqual([]);
    expect(viewModel.quickAction.actionLabelKey).toBe("home.quickAddAction");
  });

  it("keeps HomeScreen free of repository, SQLite, and service imports", async () => {
    const importLines = await readImportLines("src/features/home/HomeScreen.tsx");

    expect(importLines).not.toContain("/data/");
    expect(importLines).not.toContain("repositories");
    expect(importLines).not.toContain("sqlite");
    expect(importLines).not.toContain("../../services");
    expect(importLines).not.toContain("../../platform");
  });

  it("keeps moment presentation components free of domain, data, service, and platform imports", async () => {
    const files = [
      "src/features/moments/components/MomentListItem.tsx",
      "src/features/moments/components/MomentStatusBadge.tsx",
      "src/features/moments/components/MomentTimeSummary.tsx"
    ];

    for (const relativePath of files) {
      const importLines = await readImportLines(relativePath);

      expect(importLines).not.toContain("../../domain");
      expect(importLines).not.toContain("/data/");
      expect(importLines).not.toContain("sqlite");
      expect(importLines).not.toContain("../../services");
      expect(importLines).not.toContain("../../platform");
    }
  });

  it("keeps UI components free of raw date math", async () => {
    const files = [
      "src/features/home/HomeScreen.tsx",
      "src/features/moments/components/MomentListItem.tsx",
      "src/features/moments/components/MomentStatusBadge.tsx",
      "src/features/moments/components/MomentTimeSummary.tsx"
    ];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");

      expect(source).not.toContain("new Date");
      expect(source).not.toContain("Date.now");
      expect(source).not.toContain("getTime(");
    }
  });

  it("contains i18n keys for moment presentation labels", () => {
    const resourcePairs = [resources.tr, resources.en];

    for (const resource of resourcePairs) {
      expect(resource.momentPresentation["status.upcoming"]).toBeTruthy();
      expect(resource.momentPresentation["status.overdue"]).toBeTruthy();
      expect(resource.momentPresentation["status.recent"]).toBeTruthy();
      expect(resource.momentPresentation["time.countdownDays"]).toBeTruthy();
      expect(resource.momentPresentation["time.overdueDays"]).toBeTruthy();
      expect(resource.momentPresentation["time.elapsedDays"]).toBeTruthy();
      expect(resource.home.upcomingEmpty).toBeTruthy();
      expect(resource.home.overdueEmpty).toBeTruthy();
      expect(resource.home.recentEmpty).toBeTruthy();
    }
  });

  it("resolves category semantic color tokens through the theme", () => {
    for (const category of categoryRegistry) {
      expect(lightSemanticColors[category.semanticColor]).toBeTruthy();
    }

    expect(
      lightSemanticColors[
        mapMomentToUpcomingViewModel({
          countdownDays: 2,
          moment: createMoment({ categoryId: "vehicle", id: "color-1" })
        }).categoryColor
      ]
    ).toBeTruthy();
  });

  it("keeps new presentation files free of obvious hardcoded UI copy", async () => {
    const files = [
      "src/features/home/HomeScreen.tsx",
      "src/features/home/homeSampleData.ts",
      "src/features/moments/components/MomentListItem.tsx",
      "src/features/moments/components/MomentStatusBadge.tsx",
      "src/features/moments/components/MomentTimeSummary.tsx"
    ];
    const visiblePhrases = ["Vehicle inspection", "Upcoming", "Overdue", "Recent", "Days left"];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");

      for (const phrase of visiblePhrases) {
        expect(source).not.toContain(phrase);
      }
    }
  });
});

async function readImportLines(relativePath: string): Promise<string> {
  const source = await readFile(join(process.cwd(), relativePath), "utf8");

  return source
    .split("\n")
    .filter((line) => line.trimStart().startsWith("import"))
    .join("\n");
}

function createMoment(input: { id: string; categoryId: CategoryId }): Moment {
  return {
    archivedAt: null,
    categoryId: input.categoryId,
    createdAt: "2026-06-04T00:00:00.000Z",
    deletedAt: null,
    id: input.id,
    isArchived: false,
    isDeleted: false,
    lastActionAt: null,
    notes: null,
    presetId: null,
    privacyLevel: "private",
    title: "Vehicle inspection",
    updatedAt: "2026-06-04T00:00:00.000Z",
    widgetEligible: true
  };
}

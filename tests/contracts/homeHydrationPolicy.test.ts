import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { CategoryId, Moment } from "../../src/domain/moments";
import {
  buildHomeSectionsFromMoments,
  HOME_SECTION_LIMITS
} from "../../src/features/home/homeHydrationPolicy";
import { resources } from "../../src/shared/i18n/resources";

const nowIso = "2026-06-04T12:00:00.000Z";

describe("home hydration policy", () => {
  it("excludes archived and deleted moments", () => {
    const viewModel = buildHomeSectionsFromMoments({
      moments: [
        sampleMoment({ id: "active", updatedAt: "2026-06-04T10:00:00.000Z" }),
        sampleMoment({ id: "archived", isArchived: true }),
        sampleMoment({ id: "deleted", isDeleted: true })
      ],
      nowIso
    });

    expect(viewModel.recent.items.map((item) => item.id)).toEqual(["active"]);
    expect(viewModel.insight.emptyDescriptionKey).toBe("home.insightQuiet");
  });

  it("classifies lastActionAt past signals as overdue and future signals as upcoming", () => {
    const viewModel = buildHomeSectionsFromMoments({
      moments: [
        sampleMoment({ id: "past", lastActionAt: "2026-06-01T12:00:00.000Z" }),
        sampleMoment({ id: "future", lastActionAt: "2026-06-08T12:00:00.000Z" })
      ],
      nowIso
    });

    expect(viewModel.overdue.items.map((item) => item.id)).toEqual(["past"]);
    expect(viewModel.upcoming.items.map((item) => item.id)).toEqual(["future"]);
    expect(viewModel.overdue.items[0]?.timeValue).toBe(3);
    expect(viewModel.upcoming.items[0]?.timeValue).toBe(4);
  });

  it("sorts recent moments deterministically by activity and id", () => {
    const viewModel = buildHomeSectionsFromMoments({
      moments: [
        sampleMoment({ id: "b", updatedAt: "2026-06-03T12:00:00.000Z" }),
        sampleMoment({ id: "a", updatedAt: "2026-06-03T12:00:00.000Z" }),
        sampleMoment({ id: "newest", updatedAt: "2026-06-04T11:00:00.000Z" })
      ],
      nowIso
    });

    expect(viewModel.recent.items.map((item) => item.id)).toEqual(["newest", "a", "b"]);
  });

  it("respects centralized section limits", () => {
    const viewModel = buildHomeSectionsFromMoments({
      moments: [
        sampleMoment({ id: "one" }),
        sampleMoment({ id: "two" }),
        sampleMoment({ id: "three" })
      ],
      nowIso,
      sectionLimits: {
        maxRecentItems: 2
      }
    });

    expect(HOME_SECTION_LIMITS.maxRecentItems).toBe(5);
    expect(viewModel.recent.items).toHaveLength(2);
  });

  it("returns safe empty view model when no moments exist", () => {
    const viewModel = buildHomeSectionsFromMoments({
      moments: [],
      nowIso
    });

    expect(viewModel.overdue.items).toEqual([]);
    expect(viewModel.upcoming.items).toEqual([]);
    expect(viewModel.recent.items).toEqual([]);
    expect(viewModel.insight.emptyDescriptionKey).toBe("home.insightNoMoments");
  });

  it("selects deterministic insight placeholders", () => {
    const overdue = buildHomeSectionsFromMoments({
      moments: [sampleMoment({ id: "overdue", lastActionAt: "2026-06-01T12:00:00.000Z" })],
      nowIso
    });
    const upcoming = buildHomeSectionsFromMoments({
      moments: [sampleMoment({ id: "upcoming", lastActionAt: "2026-06-05T12:00:00.000Z" })],
      nowIso
    });

    expect(overdue.insight.emptyDescriptionKey).toBe("home.insightOverdue");
    expect(upcoming.insight.emptyDescriptionKey).toBe("home.insightUpcoming");
  });

  it("keeps insight placeholders i18n-key based", () => {
    for (const resource of [resources.tr, resources.en]) {
      expect(resource.home.insightNoMoments).toBeTruthy();
      expect(resource.home.insightOverdue).toBeTruthy();
      expect(resource.home.insightUpcoming).toBeTruthy();
      expect(resource.home.insightQuiet).toBeTruthy();
    }
  });

  it("keeps hydration policy free of rendering, repository, SQLite, service, and SDK imports", async () => {
    const importLines = await readImportLines("src/features/home/homeHydrationPolicy.ts");

    expect(importLines).not.toContain("react-native");
    expect(importLines).not.toContain("../../data");
    expect(importLines).not.toContain("repositories");
    expect(importLines).not.toContain("sqlite");
    expect(importLines).not.toContain("../../services");
    expect(importLines).not.toContain("../../platform");
    expect(importLines).not.toContain("../../shared/ui");
  });

  it("uses Time Engine helpers for date behavior", async () => {
    const source = await readFile(
      join(process.cwd(), "src/features/home/homeHydrationPolicy.ts"),
      "utf8"
    );

    expect(source).toContain("getElapsedDays");
    expect(source).toContain("getCountdownDays");
    expect(source).toContain("isPast");
    expect(source).not.toContain("getTime(");
    expect(source).not.toContain("MS_PER_DAY");
  });
});

async function readImportLines(relativePath: string): Promise<string> {
  const source = await readFile(join(process.cwd(), relativePath), "utf8");

  return source
    .split("\n")
    .filter((line) => line.trimStart().startsWith("import"))
    .join("\n");
}

function sampleMoment(
  input: Partial<Moment> & {
    id: string;
    categoryId?: CategoryId;
  }
): Moment {
  return {
    archivedAt: null,
    categoryId: input.categoryId ?? "vehicle",
    createdAt: input.createdAt ?? "2026-06-01T12:00:00.000Z",
    deletedAt: null,
    id: input.id,
    isArchived: input.isArchived ?? false,
    isDeleted: input.isDeleted ?? false,
    lastActionAt: input.lastActionAt ?? null,
    notes: null,
    presetId: null,
    privacyLevel: "private",
    title: input.title ?? "Policy test moment",
    updatedAt: input.updatedAt ?? "2026-06-02T12:00:00.000Z",
    widgetEligible: true
  };
}

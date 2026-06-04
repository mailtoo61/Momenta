import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { DOMAIN_ERROR_CODES, domainFailure, domainSuccess } from "../../src/domain";
import {
  MOMENT_TITLE_MAX_LENGTH,
  validateCreateMomentInput,
  validateMomentPrivacyLevel,
  type Moment
} from "../../src/domain/moments";
import { evaluateReminderEligibility } from "../../src/domain/reminders";
import { validateSettingSection } from "../../src/domain/settings";
import { canMomentAppearInWidget } from "../../src/domain/widgets";

const baseMoment: Moment = {
  id: "moment-1",
  title: "Vehicle inspection",
  notes: null,
  categoryId: "vehicle",
  createdAt: "2026-06-04T00:00:00.000Z",
  updatedAt: "2026-06-04T00:00:00.000Z",
  lastActionAt: null,
  archivedAt: null,
  deletedAt: null,
  isArchived: false,
  isDeleted: false,
  privacyLevel: "private",
  widgetEligible: true,
  presetId: null
};

describe("domain model and validation contracts", () => {
  it("supports typed domain success and failure results", () => {
    expect(DOMAIN_ERROR_CODES).toContain("DOMAIN_VALIDATION_FAILED");
    expect(domainSuccess("ok")).toEqual({ isSuccess: true, value: "ok" });
    expect(domainFailure("DOMAIN_UNKNOWN_ERROR", "Unknown.").isSuccess).toBe(false);
  });

  it("accepts valid create moment input and trims title", () => {
    const result = validateCreateMomentInput({
      title: "  Doctor appointment  ",
      categoryId: "health",
      privacyLevel: "private",
      widgetEligible: false,
      reminderRuleIds: ["tomorrow"]
    });

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.title).toBe("Doctor appointment");
    }
  });

  it("rejects empty moment titles", () => {
    const result = validateCreateMomentInput({
      title: "   ",
      categoryId: "family",
      privacyLevel: "private",
      widgetEligible: true
    });

    expect(result).toEqual(domainFailure("DOMAIN_VALIDATION_FAILED", "Moment title is required."));
  });

  it("rejects unknown moment categories", () => {
    const result = validateCreateMomentInput({
      title: "Insurance renewal",
      categoryId: "unknown-category",
      privacyLevel: "private",
      widgetEligible: false
    });

    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) {
      expect(result.error.code).toBe("DOMAIN_INVALID_CATEGORY");
    }
  });

  it("validates privacy levels", () => {
    expect(validateMomentPrivacyLevel("private").isSuccess).toBe(true);

    const result = validateMomentPrivacyLevel("secret");
    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) {
      expect(result.error.code).toBe("DOMAIN_INVALID_PRIVACY_LEVEL");
    }
  });

  it("rejects unknown reminder rule ids during eligibility", () => {
    const result = evaluateReminderEligibility({
      moment: baseMoment,
      reminderRuleId: "unknown-rule"
    });

    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) {
      expect(result.error.code).toBe("DOMAIN_INVALID_REMINDER_RULE");
    }
  });

  it("rejects archived and deleted moments from reminder eligibility", () => {
    const archivedResult = evaluateReminderEligibility({
      moment: { ...baseMoment, isArchived: true },
      reminderRuleId: "today"
    });
    const deletedResult = evaluateReminderEligibility({
      moment: { ...baseMoment, isDeleted: true },
      reminderRuleId: "today"
    });

    expect(archivedResult.isSuccess).toBe(true);
    expect(deletedResult.isSuccess).toBe(true);
    if (archivedResult.isSuccess && deletedResult.isSuccess) {
      expect(archivedResult.value.isEligible).toBe(false);
      expect(deletedResult.value.isEligible).toBe(false);
    }
  });

  it("prevents sensitive moment exposure in widgets by default", () => {
    const sensitiveMoment: Moment = {
      ...baseMoment,
      privacyLevel: "sensitive",
      widgetEligible: true
    };

    expect(canMomentAppearInWidget(sensitiveMoment, "standard")).toBe(false);
    expect(canMomentAppearInWidget(sensitiveMoment, "hide-sensitive")).toBe(false);
    expect(canMomentAppearInWidget(sensitiveMoment, "allow-sensitive")).toBe(true);
  });

  it("resolves known settings sections", () => {
    const result = validateSettingSection("privacy");

    expect(result).toEqual(domainSuccess("privacy"));
  });

  it("centralizes moment domain constants", () => {
    expect(MOMENT_TITLE_MAX_LENGTH).toBe(120);
  });

  it("keeps domain contracts free of UI, repository, and SDK imports", async () => {
    const domainFiles = [
      "src/domain/domainResult.ts",
      "src/domain/moments/momentModel.ts",
      "src/domain/moments/momentValidation.ts",
      "src/domain/reminders/reminderEligibility.ts",
      "src/domain/widgets/widgetSnapshotDomain.ts",
      "src/domain/insights/insightDomain.ts",
      "src/domain/settings/settingsDomain.ts",
      "src/domain/settings/settingsRegistry.ts"
    ];

    for (const relativePath of domainFiles) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");
      const importLines = source
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");

      expect(importLines).not.toContain("../data");
      expect(importLines).not.toContain("../../data");
      expect(importLines).not.toContain("../app");
      expect(importLines).not.toContain("../../app");
      expect(importLines).not.toContain("../features");
      expect(importLines).not.toContain("../../features");
      expect(importLines).not.toContain("../platform");
      expect(importLines).not.toContain("../../platform");
      expect(importLines).not.toContain("react-native");
      expect(importLines).not.toContain("expo");
      expect(importLines).not.toContain("sqlite");
    }
  });
});

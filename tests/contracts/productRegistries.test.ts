import { describe, expect, it } from "vitest";

import { appRoutes } from "../../src/app/navigation";
import {
  canCreateMoment,
  canExport,
  canImport,
  canUseFutureSync,
  canUseTheme,
  canUseWeeklySummary,
  canUseWidget,
  getPlanById,
  planRegistry
} from "../../src/domain/monetization";
import { categoryRegistry, presetTemplateRegistry } from "../../src/domain/moments";
import { insightTemplateRegistry } from "../../src/domain/insights";
import { notificationCopyRegistry, reminderRuleRegistry } from "../../src/domain/reminders";
import { settingsRegistry } from "../../src/domain/settings";
import { analyticsEventRegistry } from "../../src/shared/analytics";
import { resources } from "../../src/shared/i18n";
import { lightSemanticColors } from "../../src/shared/theme";
import { auditEventRegistry } from "../../src/services/audit";

function expectUnique(values: ReadonlyArray<string>): void {
  expect(new Set(values).size).toBe(values.length);
}

function hasTranslationKey(key: string): boolean {
  const separatorIndex = key.indexOf(".");
  const namespace = key.slice(0, separatorIndex) as keyof typeof resources.en;
  const valueKey = key.slice(separatorIndex + 1);

  return valueKey in resources.en[namespace] && valueKey in resources.tr[namespace];
}

function collectI18nKeys(registry: ReadonlyArray<Record<string, unknown>>): string[] {
  const i18nKeyFields = new Set(["labelKey", "descriptionKey", "titleKey", "bodyKey"]);

  return registry.flatMap((item) =>
    Object.entries(item)
      .filter(([key, value]) => i18nKeyFields.has(key) && typeof value === "string")
      .map(([, value]) => value as string)
  );
}

function collectRawUiFields(registry: ReadonlyArray<Record<string, unknown>>): string[] {
  const forbiddenFields = new Set(["label", "title", "description"]);

  return registry.flatMap((item) =>
    Object.keys(item).filter((key) => forbiddenFields.has(key) || key.endsWith("Text"))
  );
}

describe("product registry contracts", () => {
  it("keeps category ids unique and semantic colors valid", () => {
    expectUnique(categoryRegistry.map((category) => category.id));

    for (const category of categoryRegistry) {
      expect(category.semanticColor in lightSemanticColors).toBe(true);
    }
  });

  it("keeps preset category and reminder references resolvable", () => {
    const categoryIds = new Set(categoryRegistry.map((category) => category.id));
    const reminderRuleIds = new Set(reminderRuleRegistry.map((rule) => rule.id));

    for (const preset of presetTemplateRegistry) {
      expect(categoryIds.has(preset.categoryId)).toBe(true);

      for (const reminderRuleId of preset.defaultReminderRuleIds) {
        expect(reminderRuleIds.has(reminderRuleId)).toBe(true);
      }
    }
  });

  it("keeps reminder rule and notification copy ids aligned", () => {
    expectUnique(reminderRuleRegistry.map((rule) => rule.id));

    const notificationRuleIds = new Set(
      notificationCopyRegistry.map((copy) => copy.reminderRuleId)
    );

    for (const rule of reminderRuleRegistry) {
      expect(notificationRuleIds.has(rule.id)).toBe(true);
    }
  });

  it("keeps plan ids unique and premium gates centralized", () => {
    expectUnique(planRegistry.map((plan) => plan.id));

    const freePlan = getPlanById("free");
    const lifetimePlan = getPlanById("lifetime");

    expect(canCreateMoment(freePlan, 4)).toBe(true);
    expect(canCreateMoment(freePlan, 5)).toBe(false);
    expect(canUseWidget(freePlan, true)).toBe(false);
    expect(canUseTheme(freePlan, true)).toBe(false);
    expect(canExport(freePlan)).toBe(false);
    expect(canImport(freePlan)).toBe(true);
    expect(canUseWeeklySummary(freePlan)).toBe(false);
    expect(canUseFutureSync(freePlan)).toBe(false);

    expect(canCreateMoment(lifetimePlan, 500)).toBe(true);
    expect(canUseWidget(lifetimePlan, true)).toBe(true);
    expect(canUseTheme(lifetimePlan, true)).toBe(true);
    expect(canExport(lifetimePlan)).toBe(true);
    expect(canUseFutureSync(lifetimePlan)).toBe(true);
  });

  it("keeps analytics and audit event names unique", () => {
    expectUnique(analyticsEventRegistry.map((event) => event.name));
    expectUnique(auditEventRegistry.map((event) => event.name));
  });

  it("keeps insight category references valid", () => {
    const categoryIds = new Set(categoryRegistry.map((category) => category.id));

    for (const insight of insightTemplateRegistry) {
      if (insight.supportedCategoryIds === "all") {
        continue;
      }

      for (const categoryId of insight.supportedCategoryIds) {
        expect(categoryIds.has(categoryId)).toBe(true);
      }
    }
  });

  it("keeps settings sections routed through the navigation contract", () => {
    const routePaths = new Set(Object.values(appRoutes));

    for (const section of settingsRegistry) {
      expect(routePaths.has(section.routePath)).toBe(true);
      expect(hasTranslationKey(section.labelKey)).toBe(true);
      expect(hasTranslationKey(section.descriptionKey)).toBe(true);
    }
  });

  it("keeps all registry i18n references resolvable", () => {
    const registryKeys = [
      ...collectI18nKeys(categoryRegistry),
      ...collectI18nKeys(presetTemplateRegistry),
      ...collectI18nKeys(reminderRuleRegistry),
      ...collectI18nKeys(notificationCopyRegistry),
      ...collectI18nKeys(planRegistry),
      ...collectI18nKeys(insightTemplateRegistry),
      ...collectI18nKeys(settingsRegistry)
    ];

    for (const key of registryKeys) {
      expect(hasTranslationKey(key), key).toBe(true);
    }
  });

  it("keeps registries free of raw user-facing label fields", () => {
    const rawFields = [
      ...collectRawUiFields(categoryRegistry),
      ...collectRawUiFields(presetTemplateRegistry),
      ...collectRawUiFields(reminderRuleRegistry),
      ...collectRawUiFields(notificationCopyRegistry),
      ...collectRawUiFields(planRegistry),
      ...collectRawUiFields(insightTemplateRegistry),
      ...collectRawUiFields(settingsRegistry)
    ];

    expect(rawFields).toEqual([]);
  });
});

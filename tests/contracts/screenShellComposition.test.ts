import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { planRegistry } from "../../src/domain/monetization";
import { settingsRegistry } from "../../src/domain/settings";
import { resources } from "../../src/shared/i18n/resources";

describe("screen shell composition", () => {
  it("keeps home and onboarding shells free of persistence imports", async () => {
    const files = [
      "src/features/home/HomeScreen.tsx",
      "src/features/onboarding/OnboardingScreen.tsx"
    ];

    for (const relativePath of files) {
      const importLines = await readImportLines(relativePath);

      expect(importLines).not.toContain("/data/");
      expect(importLines).not.toContain("repositories");
      expect(importLines).not.toContain("sqlite");
      expect(importLines).not.toContain("../../services");
      expect(importLines).not.toContain("../../platform");
    }
  });

  it("renders settings shell from registry-backed section metadata", async () => {
    const source = await readFile(
      join(process.cwd(), "src/features/settings/SettingsScreen.tsx"),
      "utf8"
    );

    expect(source).toContain("settingsRegistry");
    expect(settingsRegistry.map((section) => section.id)).toEqual([
      "appearance",
      "language",
      "notifications",
      "widgets",
      "privacy",
      "data",
      "premium",
      "about"
    ]);

    for (const section of settingsRegistry) {
      expect(resolveResourceKey(section.labelKey)).toBeTruthy();
      expect(resolveResourceKey(section.descriptionKey)).toBeTruthy();
    }
  });

  it("uses plan registry in paywall without billing provider access", async () => {
    const source = await readFile(
      join(process.cwd(), "src/features/paywall/PaywallScreen.tsx"),
      "utf8"
    );
    const importLines = await readImportLines("src/features/paywall/PaywallScreen.tsx");

    expect(source).toContain("planRegistry");
    expect(planRegistry.map((plan) => plan.id)).toEqual(["free", "weekly", "monthly", "lifetime"]);
    expect(importLines).not.toContain("billing");
    expect(importLines.toLowerCase()).not.toContain("revenuecat");
    expect(importLines).not.toContain("../../platform");
  });

  it("keeps debug shell on safe runtime selectors only", async () => {
    const source = await readFile(
      join(process.cwd(), "src/features/debug/DebugScreen.tsx"),
      "utf8"
    );
    const importLines = await readImportLines("src/features/debug/DebugScreen.tsx");

    expect(source).toContain("useRuntimeStatus");
    expect(source).toContain("useRuntimeEnvironment");
    expect(source).toContain("useRuntimePersistenceMode");
    expect(source).toContain("useFeatureFlags");
    expect(source).not.toContain("useServices");
    expect(importLines).not.toContain("/data/");
    expect(importLines).not.toContain("repositories");
    expect(importLines).not.toContain("sqlite");
    expect(importLines).not.toContain("../../platform");
  });

  it("keeps shared feature components presentation-only", async () => {
    const files = [
      "src/features/shared/InfoRow.tsx",
      "src/features/shared/PlaceholderScreen.tsx",
      "src/features/shared/PlaceholderSection.tsx",
      "src/features/shared/ScreenHeader.tsx",
      "src/features/shared/SectionCard.tsx",
      "src/features/shared/SettingsSectionRow.tsx",
      "src/features/shared/ValueCard.tsx"
    ];

    for (const relativePath of files) {
      const importLines = await readImportLines(relativePath);

      expect(importLines).not.toContain("/data/");
      expect(importLines).not.toContain("sqlite");
      expect(importLines).not.toContain("../../services");
      expect(importLines).not.toContain("../../platform");
      expect(importLines).not.toContain("../../domain");
    }
  });

  it("contains localized keys for new shell copy", () => {
    const resourcePairs = [resources.tr, resources.en];

    for (const resource of resourcePairs) {
      expect(resource.common.placeholder).toBeTruthy();
      expect(resource.home.shellSubtitle).toBeTruthy();
      expect(resource.home.quickAddAction).toBeTruthy();
      expect(resource.onboarding.valueMomentsTitle).toBeTruthy();
      expect(resource.onboarding.valueTimeTitle).toBeTruthy();
      expect(resource.onboarding.valueWidgetsTitle).toBeTruthy();
      expect(resource.onboarding.getStartedAction).toBeTruthy();
      expect(resource.settings.shellSubtitle).toBeTruthy();
      expect(resource.paywall.plansTitle).toBeTruthy();
      expect(resource.paywall.premiumWidgets).toBeTruthy();
      expect(resource.paywall.restorePurchase).toBeTruthy();
      expect(resource.debug.runtimeStatus).toBeTruthy();
      expect(resource.debug.persistenceMode).toBeTruthy();
    }
  });

  it("keeps screen shell files free of visible hardcoded copy", async () => {
    const files = [
      "src/features/home/HomeScreen.tsx",
      "src/features/onboarding/OnboardingScreen.tsx",
      "src/features/settings/SettingsScreen.tsx",
      "src/features/paywall/PaywallScreen.tsx",
      "src/features/debug/DebugScreen.tsx"
    ];
    const visiblePhrases = [
      "Upcoming",
      "Overdue",
      "Remember important moments",
      "Get started",
      "Premium widgets",
      "Restore purchase",
      "Runtime status"
    ];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");

      for (const phrase of visiblePhrases) {
        expect(source).not.toContain(phrase);
      }
    }
  });

  it("keeps route files as thin delegates", async () => {
    const files = [
      "app/index.tsx",
      "app/onboarding.tsx",
      "app/settings.tsx",
      "app/paywall.tsx",
      "app/debug.tsx"
    ];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");

      expect(source).not.toContain("StyleSheet");
      expect(source).not.toContain("useRuntime");
      expect(source).not.toContain("/data/");
      expect(
        source.split("\n").filter((line) => line.trim().length > 0).length
      ).toBeLessThanOrEqual(3);
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

function resolveResourceKey(key: string): string | undefined {
  const separatorIndex = key.indexOf(".");
  const namespace = key.slice(0, separatorIndex) as keyof typeof resources.en;
  const valueKey = key.slice(separatorIndex + 1);
  const namespaceResource = resources.en[namespace];

  return namespaceResource[valueKey as keyof typeof namespaceResource];
}

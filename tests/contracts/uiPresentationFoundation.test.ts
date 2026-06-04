import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-native", () => ({
  Pressable: "Pressable",
  StyleSheet: {
    create: <TStyle extends Record<string, unknown>>(styles: TStyle): TStyle => styles
  },
  Text: "Text",
  View: "View"
}));

import type { AppRuntimeBootstrapContext, AppRuntimeState } from "../../src/app/runtime";
import { RuntimeStatusGateView } from "../../src/features/runtime";
import { createAppError } from "../../src/shared/errors";
import { defaultFeatureFlags } from "../../src/shared/featureFlags";
import { resources } from "../../src/shared/i18n/resources";
import {
  AppBadge,
  AppButton,
  AppCard,
  AppDivider,
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
  AppScreen,
  AppStack,
  AppText
} from "../../src/shared/ui";
import { noopAnalyticsService } from "../../src/services/analytics";
import { noopAuditService } from "../../src/services/audit";
import { noopMomentWorkflowService } from "../../src/services/moments";
import { noopReminderOrchestrationService } from "../../src/services/reminders";
import { noopWidgetSnapshotService } from "../../src/services/widgets";

describe("ui presentation foundation", () => {
  it("creates shared UI primitives without crashing", () => {
    expect(AppScreen({ children: null })).toBeDefined();
    expect(AppText({ children: "Label" })).toBeDefined();
    expect(AppCard({ children: null })).toBeDefined();
    expect(AppButton({ label: "Action" })).toBeDefined();
    expect(AppStack({ children: null })).toBeDefined();
    expect(AppDivider({})).toBeDefined();
    expect(AppBadge({ label: "Ready" })).toBeDefined();
    expect(AppLoadingState({})).toBeDefined();
    expect(AppErrorState({ messageKey: "errors.unknown" })).toBeDefined();
    expect(AppEmptyState({})).toBeDefined();
  });

  it("exposes button accessibility role by default", () => {
    const button = AppButton({ label: "Action" });

    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Action");
  });

  it("renders runtime pending, failed, and ready states through the gate view", () => {
    const pending = RuntimeStatusGateView({
      state: {
        status: "pending",
        startedAt: "2026-06-04T00:00:00.000Z"
      },
      children: "ready"
    });
    const failed = RuntimeStatusGateView({
      state: {
        status: "failed",
        startedAt: "2026-06-04T00:00:00.000Z",
        failedAt: "2026-06-04T00:00:01.000Z",
        error: createAppError({
          code: "STORAGE_UNAVAILABLE",
          developerMessage: "Safe failure."
        })
      },
      children: "ready"
    });
    const ready = RuntimeStatusGateView({
      state: readyRuntimeState(),
      children: "ready"
    });

    expect(isValidElement(pending)).toBe(true);
    expect(isValidElement(failed)).toBe(true);
    expect(isValidElement(pending) ? pending.type : null).toBe(AppLoadingState);
    expect(isValidElement(failed) ? failed.type : null).toBe(AppErrorState);
    expect(ready).toBe("ready");
  });

  it("contains localized keys for presentation states and route placeholders", () => {
    const requiredNamespaces = [resources.tr, resources.en];

    for (const resource of requiredNamespaces) {
      expect(resource.common.retry).toBeTruthy();
      expect(resource.common.continue).toBeTruthy();
      expect(resource.appStates.loadingTitle).toBeTruthy();
      expect(resource.appStates.loadingDescription).toBeTruthy();
      expect(resource.appStates.errorTitle).toBeTruthy();
      expect(resource.appStates.emptyTitle).toBeTruthy();
      expect(resource.appStates.emptyDescription).toBeTruthy();
      expect(resource.home.title).toBeTruthy();
      expect(resource.onboarding.subtitle).toBeTruthy();
      expect(resource.settings.subtitle).toBeTruthy();
      expect(resource.paywall.subtitle).toBeTruthy();
      expect(resource.debug.subtitle).toBeTruthy();
    }
  });

  it("keeps shared UI primitives free of domain, data, service, and platform imports", async () => {
    const files = [
      "src/shared/ui/AppBadge.tsx",
      "src/shared/ui/AppButton.tsx",
      "src/shared/ui/AppCard.tsx",
      "src/shared/ui/AppDivider.tsx",
      "src/shared/ui/AppEmptyState.tsx",
      "src/shared/ui/AppErrorState.tsx",
      "src/shared/ui/AppLoadingState.tsx",
      "src/shared/ui/AppScreen.tsx",
      "src/shared/ui/AppStack.tsx",
      "src/shared/ui/AppText.tsx",
      "src/shared/ui/index.ts"
    ];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");
      const importLines = source
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");

      expect(importLines).not.toContain("../../domain");
      expect(importLines).not.toContain("../../data");
      expect(importLines).not.toContain("../../services");
      expect(importLines).not.toContain("../../platform");
      expect(importLines).not.toContain("../domain");
      expect(importLines).not.toContain("../data");
      expect(importLines).not.toContain("../services");
      expect(importLines).not.toContain("../platform");
    }
  });

  it("keeps route modules free of persistence and SDK internals", async () => {
    const files = [
      "app/index.tsx",
      "app/onboarding.tsx",
      "app/settings.tsx",
      "app/paywall.tsx",
      "app/debug.tsx",
      "src/features/home/HomeScreen.tsx",
      "src/features/onboarding/OnboardingScreen.tsx",
      "src/features/settings/SettingsScreen.tsx",
      "src/features/paywall/PaywallScreen.tsx",
      "src/features/debug/DebugScreen.tsx"
    ];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");
      const importLines = source
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");

      expect(importLines).not.toContain("/data/");
      expect(importLines).not.toContain("repositories");
      expect(importLines).not.toContain("sqlite");
      expect(importLines.toLowerCase()).not.toContain("revenuecat");
      expect(importLines).not.toContain("/platform/");
    }
  });

  it("keeps new primitive styles free of raw color literals", async () => {
    const files = [
      "src/shared/ui/AppBadge.tsx",
      "src/shared/ui/AppButton.tsx",
      "src/shared/ui/AppCard.tsx",
      "src/shared/ui/AppDivider.tsx",
      "src/shared/ui/AppScreen.tsx",
      "src/shared/ui/AppText.tsx"
    ];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");

      expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}/);
      expect(source).not.toMatch(/\brgba?\(/);
      expect(source).not.toMatch(/\bhsla?\(/);
    }
  });
});

function readyRuntimeState(): AppRuntimeState {
  return {
    status: "ready",
    startedAt: "2026-06-04T00:00:00.000Z",
    readyAt: "2026-06-04T00:00:01.000Z",
    bootstrap: readyBootstrapContext()
  };
}

function readyBootstrapContext(): AppRuntimeBootstrapContext {
  return {
    appName: "Momenta",
    environment: "development",
    locale: "tr",
    featureFlags: defaultFeatureFlags,
    services: {
      analyticsService: noopAnalyticsService,
      auditService: noopAuditService,
      momentWorkflowService: noopMomentWorkflowService,
      reminderOrchestrationService: noopReminderOrchestrationService,
      widgetSnapshotService: noopWidgetSnapshotService
    },
    providerRegistryHealth: {
      analytics: "disabled",
      billing: "disabled",
      crash: "disabled",
      notifications: "disabled",
      widgets: "disabled"
    },
    themePreference: "system",
    bootstrappedAt: "2026-06-04T00:00:01.000Z"
  };
}

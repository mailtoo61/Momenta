import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { AppBootstrapContext } from "../../src/app/bootstrap";
import {
  createAppRuntimeBootstrapContext,
  selectCurrentLocale,
  selectCurrentThemePreference,
  selectFeatureFlags,
  selectIsRuntimeReady,
  selectRuntimeEnvironment,
  selectRuntimeError,
  selectRuntimePersistenceMode,
  selectRuntimeServices,
  selectRuntimeStatus,
  type AppRuntimeState
} from "../../src/app/runtime";
import { dataSuccess } from "../../src/data";
import { createInMemoryRepositories } from "../../src/data/repositories";
import { createAppError } from "../../src/shared/errors";
import { defaultFeatureFlags } from "../../src/shared/featureFlags";
import type { ServiceContainer } from "../../src/services";
import { noopAnalyticsService } from "../../src/services/analytics";
import { noopAuditService } from "../../src/services/audit";
import { noopMomentWorkflowService } from "../../src/services/moments";
import { noopReminderOrchestrationService } from "../../src/services/reminders";
import { noopWidgetSnapshotService } from "../../src/services/widgets";

const startedAt = "2026-06-04T00:00:00.000Z";
const readyAt = "2026-06-04T00:00:01.000Z";
const failedAt = "2026-06-04T00:00:02.000Z";

describe("app runtime context", () => {
  it("starts in a typed pending state", () => {
    const state: AppRuntimeState = {
      status: "pending",
      startedAt
    };

    expect(selectRuntimeStatus(state)).toBe("pending");
    expect(selectIsRuntimeReady(state)).toBe(false);
    expect(selectRuntimeServices(state)).toBeNull();
    expect(selectRuntimeEnvironment(state)).toBeNull();
  });

  it("can become ready with a sanitized bootstrap context", () => {
    const bootstrap = createAppRuntimeBootstrapContext(createBootstrapContext());
    const state: AppRuntimeState = {
      status: "ready",
      bootstrap,
      startedAt,
      readyAt
    };

    expect(selectRuntimeStatus(state)).toBe("ready");
    expect(selectIsRuntimeReady(state)).toBe(true);
    expect(selectRuntimeEnvironment(state)).toBe("development");
    expect(selectRuntimePersistenceMode(state)).toBe("inMemory");
    expect(selectFeatureFlags(state)).toBe(defaultFeatureFlags);
    expect(selectCurrentLocale(state)).toBe("tr");
    expect(selectCurrentThemePreference(state)).toBe("system");
    expect(selectRuntimeServices(state)?.momentWorkflowService).toBeDefined();
  });

  it("can become failed with a safe shared app error", () => {
    const error = createAppError({
      code: "STORAGE_UNAVAILABLE",
      developerMessage: "Persistence failed safely.",
      severity: "recoverable"
    });
    const state: AppRuntimeState = {
      status: "failed",
      error,
      startedAt,
      failedAt
    };

    expect(selectRuntimeStatus(state)).toBe("failed");
    expect(selectIsRuntimeReady(state)).toBe(false);
    expect(selectRuntimeError(state)).toBe(error);
    expect(selectRuntimeServices(state)).toBeNull();
  });

  it("does not expose repositories, SQLite adapters, or provider internals through runtime context", () => {
    const runtimeBootstrap = createAppRuntimeBootstrapContext(createBootstrapContext());

    expect(Object.keys(runtimeBootstrap)).toEqual([
      "appName",
      "environment",
      "locale",
      "featureFlags",
      "persistenceMode",
      "services",
      "providerRegistryHealth",
      "themePreference",
      "bootstrappedAt"
    ]);
    expect("repositories" in runtimeBootstrap).toBe(false);
    expect("sqliteAdapter" in runtimeBootstrap).toBe(false);
    expect("providerRegistry" in runtimeBootstrap).toBe(false);
    expect("analyticsProvider" in runtimeBootstrap).toBe(false);
    expect("notificationProvider" in runtimeBootstrap).toBe(false);
    expect("widgetProvider" in runtimeBootstrap).toBe(false);
  });

  it("useServices exposes only the service container shape", () => {
    const state: AppRuntimeState = {
      status: "ready",
      bootstrap: createAppRuntimeBootstrapContext(createBootstrapContext()),
      startedAt,
      readyAt
    };
    const services = selectRuntimeServices(state);

    expect(services).not.toBeNull();
    expect(Object.keys(services ?? {}).sort()).toEqual(
      [
        "analyticsService",
        "auditService",
        "momentWorkflowService",
        "reminderOrchestrationService",
        "widgetSnapshotService"
      ].sort()
    );
    expect("momentRepository" in (services ?? {})).toBe(false);
    expect("repositories" in (services ?? {})).toBe(false);
  });

  it("wires AppProviders through AppRuntimeProvider without route or business logic", async () => {
    const source = await readFile(
      join(process.cwd(), "src/app/providers/AppProviders.tsx"),
      "utf8"
    );

    expect(source).toContain("AppRuntimeProvider");
    expect(source).not.toContain("safeAppBootstrap");
    expect(source).not.toContain("createServiceContainer");
    expect(source).not.toContain("repositories");
    expect(source).not.toContain("expo-sqlite");
  });

  it("keeps route and feature UI modules free of persistence and SDK internals", async () => {
    const files = [
      "app/_layout.tsx",
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

      expect(importLines).not.toContain("expo-sqlite");
      expect(importLines).not.toContain("/data/");
      expect(importLines).not.toContain("\\data\\");
      expect(importLines).not.toContain("repositories");
      expect(importLines.toLowerCase()).not.toContain("revenuecat");
      expect(importLines).not.toContain("ProviderRegistry");
    }
  });
});

function createBootstrapContext(): AppBootstrapContext {
  return {
    appName: "Momenta",
    environment: "development",
    locale: "tr",
    featureFlags: defaultFeatureFlags,
    persistenceMode: "inMemory",
    repositories: {
      mode: "inMemory",
      repositories: createInMemoryRepositories(),
      close: async () => dataSuccess(undefined)
    },
    services: createTestServiceContainer(),
    providerRegistryHealth: {
      analytics: "disabled",
      billing: "disabled",
      crash: "disabled",
      notifications: "disabled",
      widgets: "disabled"
    },
    bootstrappedAt: readyAt
  };
}

function createTestServiceContainer(): ServiceContainer {
  return {
    analyticsService: noopAnalyticsService,
    auditService: noopAuditService,
    momentWorkflowService: noopMomentWorkflowService,
    reminderOrchestrationService: noopReminderOrchestrationService,
    widgetSnapshotService: noopWidgetSnapshotService
  };
}

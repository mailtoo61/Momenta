import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { analyticsEventRegistry } from "../../src/shared/analytics";
import { auditEventRegistry, noopAuditService, type AuditService } from "../../src/services/audit";
import {
  createServiceError,
  mapServiceErrorToAppError,
  serviceFailure,
  serviceSuccess,
  SERVICE_ERROR_CODES
} from "../../src/services";
import type { AnalyticsService } from "../../src/services/analytics";
import type { AppLifecycleService } from "../../src/services/lifecycle";
import type { MomentWorkflowService } from "../../src/services/moments";
import type { ReminderOrchestrationService } from "../../src/services/reminders";
import type { WidgetSnapshotService } from "../../src/services/widgets";

describe("service contract foundation", () => {
  it("supports typed service success and failure results", () => {
    const success = serviceSuccess({ id: "ok" });
    const error = createServiceError({
      code: "SERVICE_VALIDATION_FAILED",
      developerMessage: "Validation failed."
    });
    const failure = serviceFailure(error);
    const mappedError = mapServiceErrorToAppError(error);

    expect(SERVICE_ERROR_CODES).toContain("SERVICE_PREMIUM_REQUIRED");
    expect(success.isSuccess).toBe(true);
    expect(failure.isSuccess).toBe(false);
    expect(mappedError.userMessageKey).toBe("errors.unknown");
  });

  it("type-checks the moment workflow service contract through a test double", async () => {
    const service: MomentWorkflowService = {
      createMoment: async () => serviceFailure(unavailableError()),
      updateMoment: async () => serviceFailure(unavailableError()),
      archiveMoment: async () => serviceFailure(unavailableError()),
      restoreMoment: async () => serviceFailure(unavailableError()),
      softDeleteMoment: async () => serviceFailure(unavailableError()),
      searchMoments: async () => serviceSuccess([])
    };

    await expect(service.searchMoments({ query: "family" })).resolves.toEqual(serviceSuccess([]));
  });

  it("type-checks the reminder orchestration service contract through a test double", async () => {
    const service: ReminderOrchestrationService = {
      evaluateReminderRules: async (input) =>
        serviceSuccess({
          momentId: input.momentId,
          rules: []
        }),
      scheduleMomentReminders: async (input) =>
        serviceSuccess({
          momentId: input.momentId,
          scheduledReminderIds: []
        }),
      cancelMomentReminders: async () => serviceSuccess(undefined),
      rescheduleMomentReminders: async (input) =>
        serviceSuccess({
          momentId: input.momentId,
          scheduledReminderIds: []
        })
    };

    await expect(
      service.evaluateReminderRules({
        momentId: "moment-1",
        reminderRuleIds: ["today"]
      })
    ).resolves.toEqual(
      serviceSuccess({
        momentId: "moment-1",
        rules: []
      })
    );
  });

  it("type-checks the widget snapshot service contract through a test double", async () => {
    const service: WidgetSnapshotService = {
      generateSnapshot: async (input) =>
        serviceSuccess({
          widgetId: input.widgetId,
          snapshotVersion: "v1",
          payload: {},
          privacyLevel: input.privacyLevel
        }),
      saveSnapshot: async (input) => serviceSuccess(input.snapshot),
      refreshAllSnapshots: async () => serviceSuccess({ refreshedSnapshotIds: [] }),
      refreshSnapshotForMoment: async () => serviceSuccess({ refreshedSnapshotIds: [] })
    };

    await expect(
      service.refreshSnapshotForMoment({
        momentId: "moment-1"
      })
    ).resolves.toEqual(serviceSuccess({ refreshedSnapshotIds: [] }));
  });

  it("aligns audit service event names with the audit registry", async () => {
    const registryNames = new Set(auditEventRegistry.map((event) => event.name));
    const service: AuditService = noopAuditService;

    expect(registryNames.has("moment_created")).toBe(true);
    await expect(service.record("moment_created")).resolves.toEqual(serviceSuccess(undefined));
  });

  it("aligns analytics service event names with the analytics registry", async () => {
    const registryNames = new Set(analyticsEventRegistry.map((event) => event.name));
    const service: AnalyticsService = {
      track: async () => serviceSuccess(undefined),
      flush: async () => serviceSuccess(undefined),
      identifyAnonymousUser: async () => serviceSuccess(undefined)
    };

    expect(registryNames.has("app_bootstrapped")).toBe(true);
    await expect(
      service.track("app_bootstrapped", { environment: "development" })
    ).resolves.toEqual(serviceSuccess(undefined));
  });

  it("defines all required lifecycle service methods", async () => {
    const service: AppLifecycleService = {
      onAppStarted: async () => serviceSuccess(undefined),
      onAppBecameActive: async () => serviceSuccess(undefined),
      onAppMovedToBackground: async () => serviceSuccess(undefined),
      onDayChanged: async () => serviceSuccess(undefined),
      onTimezoneChanged: async () => serviceSuccess(undefined)
    };

    await expect(service.onAppStarted()).resolves.toEqual(serviceSuccess(undefined));
    expect(Object.keys(service).sort()).toEqual(
      [
        "onAppBecameActive",
        "onAppMovedToBackground",
        "onAppStarted",
        "onDayChanged",
        "onTimezoneChanged"
      ].sort()
    );
  });

  it("keeps service contracts free of UI and concrete SDK imports", async () => {
    const serviceFiles = [
      "src/services/serviceResult.ts",
      "src/services/serviceDependencies.ts",
      "src/services/moments/momentWorkflowService.ts",
      "src/services/reminders/reminderOrchestrationService.ts",
      "src/services/widgets/widgetSnapshotService.ts",
      "src/services/audit/auditService.ts",
      "src/services/analytics/analyticsService.ts",
      "src/services/lifecycle/appLifecycleService.ts"
    ];

    for (const relativePath of serviceFiles) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");
      const importLines = source
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");

      expect(importLines).not.toContain("../features");
      expect(importLines).not.toContain("../app");
      expect(importLines).not.toContain("react-native");
      expect(importLines).not.toContain("expo");
      expect(importLines).not.toContain("sqlite");
      expect(importLines.toLowerCase()).not.toContain("revenuecat");
    }
  });
});

function unavailableError() {
  return createServiceError({
    code: "SERVICE_DEPENDENCY_UNAVAILABLE",
    developerMessage: "Test double has no dependency implementation."
  });
}

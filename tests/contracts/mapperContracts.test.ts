import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  auditEventToPersistedLog,
  createInputToPersistedDraft,
  toDomainMoment,
  toDomainPremiumEntitlement,
  toDomainReminderPlan,
  toDomainSetting,
  toDomainWidgetSnapshot,
  toPersistedAppSetting,
  toPersistedMoment,
  toPersistedPremiumEntitlement,
  toPersistedReminderPlan,
  toPersistedWidgetSnapshot
} from "../../src/data/mappers";
import type { PremiumEntitlement } from "../../src/domain/monetization";
import type { Moment } from "../../src/domain/moments";
import type { ReminderPlan } from "../../src/domain/reminders";
import type { WidgetSnapshotDomainModel } from "../../src/domain/widgets";
import { auditEventRegistry } from "../../src/services/audit";

const timestamp = "2026-06-04T00:00:00.000Z";

const domainMoment: Moment = {
  id: "moment-1",
  title: "Vehicle inspection",
  notes: "Annual inspection",
  categoryId: "vehicle",
  createdAt: timestamp,
  updatedAt: timestamp,
  lastActionAt: timestamp,
  archivedAt: null,
  deletedAt: null,
  isArchived: false,
  isDeleted: false,
  privacyLevel: "private",
  widgetEligible: true,
  presetId: "vehicle-inspection"
};

describe("domain persistence mapper contracts", () => {
  it("maps moments while preserving ids and timestamps", () => {
    const persistedMoment = toPersistedMoment(domainMoment);
    const mappedMoment = toDomainMoment(persistedMoment);

    expect(persistedMoment.id).toBe(domainMoment.id);
    expect(persistedMoment.createdAt).toBe(timestamp);
    expect(persistedMoment.updatedAt).toBe(timestamp);
    expect(mappedMoment).toEqual(domainMoment);
  });

  it("maps create moment input into a repository-safe draft", () => {
    const draft = createInputToPersistedDraft(
      {
        title: "  Call mother  ",
        notes: null,
        categoryId: "family",
        privacyLevel: "private",
        widgetEligible: true,
        reminderRuleIds: ["today"]
      },
      {
        generatedId: "moment-generated",
        currentIsoTimestamp: timestamp
      }
    );

    expect(draft.id).toBe("moment-generated");
    expect(draft.title).toBe("Call mother");
    expect(draft.createdAt).toBe(timestamp);
    expect(draft.updatedAt).toBe(timestamp);
    expect(draft.isArchived).toBe(false);
    expect(draft.isDeleted).toBe(false);
  });

  it("preserves archived and deleted flags", () => {
    const persistedMoment = toPersistedMoment({
      ...domainMoment,
      archivedAt: timestamp,
      deletedAt: timestamp,
      isArchived: true,
      isDeleted: true
    });

    expect(persistedMoment.isArchived).toBe(true);
    expect(persistedMoment.isDeleted).toBe(true);
    expect(toDomainMoment(persistedMoment).isArchived).toBe(true);
  });

  it("maps reminder plans without scheduling notifications", () => {
    const reminderPlan: ReminderPlan = {
      id: "reminder-plan-1",
      momentId: "moment-1",
      createdAt: timestamp,
      updatedAt: timestamp,
      isEnabled: true,
      ruleId: "tomorrow",
      nextTriggerAt: timestamp,
      lastTriggeredAt: null,
      lastScheduledAt: null,
      priority: 20
    };

    expect(toDomainReminderPlan(toPersistedReminderPlan(reminderPlan))).toEqual(reminderPlan);
  });

  it("preserves widget snapshot privacy mode and payload version", () => {
    const domainSnapshot: WidgetSnapshotDomainModel = {
      id: "snapshot-1",
      widgetId: "home-small",
      type: "timeline-summary",
      snapshotVersion: "v1",
      generatedAt: timestamp,
      payload: {
        payloadVersion: "v1",
        count: 2
      },
      privacyLevel: "private",
      privacyMode: "hide-sensitive"
    };

    const persistedSnapshot = toPersistedWidgetSnapshot(domainSnapshot);
    const mappedSnapshot = toDomainWidgetSnapshot(persistedSnapshot);

    expect(persistedSnapshot.privacyMode).toBe("hide-sensitive");
    expect(persistedSnapshot.payload.payloadVersion).toBe("v1");
    expect(mappedSnapshot.snapshotVersion).toBe("v1");
  });

  it("maps only approved audit event names", () => {
    const approvedNames = new Set(auditEventRegistry.map((event) => event.name));
    const auditLog = auditEventToPersistedLog({
      id: "audit-1",
      eventName: "moment_created",
      severity: "info",
      timestamp,
      entityType: "moment",
      entityId: "moment-1",
      payload: {
        categoryId: "vehicle"
      }
    });

    expect(approvedNames.has(auditLog.eventType)).toBe(true);
    expect(auditLog.timestamp).toBe(timestamp);
  });

  it("keeps setting values serializable", () => {
    const persistedSetting = toPersistedAppSetting("theme", "system", timestamp);
    const domainSetting = toDomainSetting(persistedSetting);

    expect(persistedSetting.settingValue).toBe('"system"');
    expect(domainSetting).toEqual({
      key: "theme",
      value: "system",
      updatedAt: timestamp
    });
  });

  it("preserves premium entitlement plan, status, and expiry", () => {
    const entitlement: PremiumEntitlement = {
      id: "entitlement-1",
      planId: "lifetime",
      status: "active",
      activatedAt: timestamp,
      expiresAt: null,
      lastValidatedAt: timestamp,
      source: "local"
    };

    const persistedEntitlement = toPersistedPremiumEntitlement(entitlement);

    expect(persistedEntitlement.planId).toBe("lifetime");
    expect(persistedEntitlement.status).toBe("active");
    expect(persistedEntitlement.expiresAt).toBeNull();
    expect(toDomainPremiumEntitlement(persistedEntitlement)).toEqual(entitlement);
  });

  it("keeps mappers free of UI, SDK, and persistence implementation imports", async () => {
    const mapperFiles = [
      "src/data/mappers/momentMapper.ts",
      "src/data/mappers/reminderPlanMapper.ts",
      "src/data/mappers/widgetSnapshotMapper.ts",
      "src/data/mappers/auditLogMapper.ts",
      "src/data/mappers/premiumEntitlementMapper.ts",
      "src/data/mappers/settingsMapper.ts"
    ];

    for (const relativePath of mapperFiles) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");
      const importLines = source
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");

      expect(importLines).not.toContain("../../app");
      expect(importLines).not.toContain("../../features");
      expect(importLines).not.toContain("../../platform");
      expect(importLines).not.toContain("react-native");
      expect(importLines).not.toContain("expo");
      expect(importLines).not.toContain("sqlite");
      expect(importLines.toLowerCase()).not.toContain("revenuecat");
    }
  });
});

import type { AuditEntityType, AuditEventName, AuditEventSeverity } from "../../services/audit";
import type { PlanId } from "../../domain/monetization";
import type { CategoryId, PresetTemplateId } from "../../domain/moments";
import type { PrivacyLevel } from "../../domain/privacy";
import type { ReminderRuleId } from "../../domain/reminders";

export type IsoTimestamp = string;
export type PersistedId = string;

export type PersistedCategoryReference = Readonly<{
  id: PersistedId;
  registryId: CategoryId;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
  isCustom: boolean;
  customName: string | null;
  customIcon: string | null;
  customColor: string | null;
}>;

export type PersistedReminderPlanReference = Readonly<{
  id: PersistedId;
  momentId: PersistedId;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
  isEnabled: boolean;
  ruleId: ReminderRuleId;
  nextTriggerAt: IsoTimestamp | null;
  lastTriggeredAt: IsoTimestamp | null;
  lastScheduledAt: IsoTimestamp | null;
  priority: number;
}>;

export type PersistedMoment = Readonly<{
  id: PersistedId;
  title: string;
  notes: string | null;
  categoryId: PersistedId;
  categoryRegistryId: CategoryId;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
  completedAt: IsoTimestamp | null;
  lastActionAt: IsoTimestamp | null;
  archivedAt: IsoTimestamp | null;
  deletedAt: IsoTimestamp | null;
  isArchived: boolean;
  isDeleted: boolean;
  privacyLevel: PrivacyLevel;
  widgetEligible: boolean;
  presetId: PresetTemplateId | null;
}>;

export type WidgetSnapshotPayload = Readonly<Record<string, string | number | boolean | null>>;
export type PersistedWidgetSnapshotPrivacyMode = "standard" | "hide-sensitive" | "allow-sensitive";

export type PersistedWidgetSnapshot = Readonly<{
  id: PersistedId;
  widgetId: string;
  snapshotVersion: string;
  generatedAt: IsoTimestamp;
  payload: WidgetSnapshotPayload;
  privacyLevel: PrivacyLevel;
  privacyMode: PersistedWidgetSnapshotPrivacyMode;
  expiresAt: IsoTimestamp | null;
}>;

export type PersistedAppSetting = Readonly<{
  id: PersistedId;
  settingKey: string;
  settingValue: string;
  updatedAt: IsoTimestamp;
}>;

export type PersistedAuditLog = Readonly<{
  id: PersistedId;
  eventType: AuditEventName;
  entityType: AuditEntityType | null;
  entityId: PersistedId | null;
  timestamp: IsoTimestamp;
  severity: AuditEventSeverity;
  details: Readonly<Record<string, string | number | boolean | null>>;
}>;

export type PremiumEntitlementStatus = "free" | "active" | "expired" | "unknown";
export type PremiumEntitlementSource = "local" | "billing-provider" | "restore" | "unknown";

export type PersistedPremiumEntitlement = Readonly<{
  id: PersistedId;
  planId: PlanId;
  status: PremiumEntitlementStatus;
  activatedAt: IsoTimestamp | null;
  expiresAt: IsoTimestamp | null;
  lastValidatedAt: IsoTimestamp | null;
  source: PremiumEntitlementSource;
}>;

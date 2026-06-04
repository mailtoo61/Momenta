import type {
  PersistedAppSetting,
  PersistedAuditLog,
  PersistedMoment,
  PersistedPremiumEntitlement,
  PersistedWidgetSnapshot
} from "../repositories";

export const SUPPORTED_EXPORT_FORMATS = ["json"] as const;

export type ExportFormat = (typeof SUPPORTED_EXPORT_FORMATS)[number];
export type ExportSchemaVersion = "v1";

export type ExportContract = Readonly<{
  schemaVersion: ExportSchemaVersion;
  format: ExportFormat;
  exportedAt: string;
  moments: ReadonlyArray<PersistedMoment>;
  settings: ReadonlyArray<PersistedAppSetting>;
  widgetSnapshots: ReadonlyArray<PersistedWidgetSnapshot>;
  auditLogs: ReadonlyArray<PersistedAuditLog>;
  premiumEntitlement: PersistedPremiumEntitlement | null;
}>;

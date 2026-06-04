import type { DataResult } from "../dataResult";
import type {
  PersistedAppSetting,
  PersistedAuditLog,
  PersistedId,
  PersistedMoment,
  PersistedPremiumEntitlement,
  PersistedWidgetSnapshot
} from "./entities";

export type MomentSearchInput = Readonly<{
  query: string;
  limit?: number;
}>;

export type MomentUpdateInput = Readonly<Partial<Omit<PersistedMoment, "id" | "createdAt">>>;

export type MomentRepository = {
  create: (moment: PersistedMoment) => Promise<DataResult<PersistedMoment>>;
  getById: (id: PersistedId) => Promise<DataResult<PersistedMoment | null>>;
  listActive: () => Promise<DataResult<ReadonlyArray<PersistedMoment>>>;
  search: (input: MomentSearchInput) => Promise<DataResult<ReadonlyArray<PersistedMoment>>>;
  update: (id: PersistedId, input: MomentUpdateInput) => Promise<DataResult<PersistedMoment>>;
  archive: (id: PersistedId, archivedAt: string) => Promise<DataResult<PersistedMoment>>;
  restore: (id: PersistedId, restoredAt: string) => Promise<DataResult<PersistedMoment>>;
  softDelete: (id: PersistedId, deletedAt: string) => Promise<DataResult<PersistedMoment>>;
};

export type SettingsRepository = {
  get: (settingKey: string) => Promise<DataResult<PersistedAppSetting | null>>;
  set: (setting: PersistedAppSetting) => Promise<DataResult<PersistedAppSetting>>;
  list: () => Promise<DataResult<ReadonlyArray<PersistedAppSetting>>>;
};

export type WidgetSnapshotRepository = {
  getByWidgetId: (widgetId: string) => Promise<DataResult<PersistedWidgetSnapshot | null>>;
  save: (snapshot: PersistedWidgetSnapshot) => Promise<DataResult<PersistedWidgetSnapshot>>;
  remove: (id: PersistedId) => Promise<DataResult<void>>;
  list: () => Promise<DataResult<ReadonlyArray<PersistedWidgetSnapshot>>>;
};

export type AuditLogRepository = {
  append: (entry: PersistedAuditLog) => Promise<DataResult<PersistedAuditLog>>;
  listRecent: (limit: number) => Promise<DataResult<ReadonlyArray<PersistedAuditLog>>>;
};

export type PremiumEntitlementRepository = {
  getCurrent: () => Promise<DataResult<PersistedPremiumEntitlement | null>>;
  save: (
    entitlement: PersistedPremiumEntitlement
  ) => Promise<DataResult<PersistedPremiumEntitlement>>;
  clear: () => Promise<DataResult<void>>;
};

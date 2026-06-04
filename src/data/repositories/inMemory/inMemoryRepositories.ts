import { dataFailure, dataSuccess } from "../../dataResult";
import { createPersistenceError } from "../../persistenceErrors";
import type {
  AuditLogRepository,
  MomentRepository,
  MomentSearchInput,
  MomentUpdateInput,
  PremiumEntitlementRepository,
  SettingsRepository,
  WidgetSnapshotRepository
} from "../repositoryContracts";
import type {
  PersistedAppSetting,
  PersistedAuditLog,
  PersistedId,
  PersistedMoment,
  PersistedPremiumEntitlement,
  PersistedWidgetSnapshot
} from "../entities";

export type InMemoryRepositories = Readonly<{
  momentRepository: MomentRepository;
  settingsRepository: SettingsRepository;
  widgetSnapshotRepository: WidgetSnapshotRepository;
  auditLogRepository: AuditLogRepository;
  premiumEntitlementRepository: PremiumEntitlementRepository;
}>;

export function createInMemoryRepositories(): InMemoryRepositories {
  const moments = new Map<PersistedId, PersistedMoment>();
  const settings = new Map<string, PersistedAppSetting>();
  const widgetSnapshots = new Map<PersistedId, PersistedWidgetSnapshot>();
  const auditLogs: PersistedAuditLog[] = [];
  let premiumEntitlement: PersistedPremiumEntitlement | null = null;

  const momentRepository: MomentRepository = {
    create: async (moment) => {
      moments.set(moment.id, moment);
      return dataSuccess(moment);
    },
    getById: async (id) => dataSuccess(moments.get(id) ?? null),
    listActive: async () =>
      dataSuccess(
        Array.from(moments.values()).filter((moment) => !moment.isArchived && !moment.isDeleted)
      ),
    search: async (input: MomentSearchInput) => {
      const query = input.query.trim().toLowerCase();
      const matchedMoments = Array.from(moments.values())
        .filter((moment) => !moment.isDeleted)
        .filter(
          (moment) =>
            moment.title.toLowerCase().includes(query) ||
            (moment.notes?.toLowerCase().includes(query) ?? false)
        )
        .slice(0, input.limit);

      return dataSuccess(matchedMoments);
    },
    update: async (id, input: MomentUpdateInput) => {
      const existingMoment = moments.get(id);
      if (!existingMoment) {
        return dataFailure(recordNotFound(id));
      }

      const updatedMoment = {
        ...existingMoment,
        ...input,
        id,
        createdAt: existingMoment.createdAt
      };

      moments.set(id, updatedMoment);
      return dataSuccess(updatedMoment);
    },
    archive: async (id, archivedAt) => {
      const existingMoment = moments.get(id);
      if (!existingMoment) {
        return dataFailure(recordNotFound(id));
      }

      const updatedMoment: PersistedMoment = {
        ...existingMoment,
        archivedAt,
        isArchived: true,
        updatedAt: archivedAt
      };
      moments.set(id, updatedMoment);
      return dataSuccess(updatedMoment);
    },
    restore: async (id, restoredAt) => {
      const existingMoment = moments.get(id);
      if (!existingMoment) {
        return dataFailure(recordNotFound(id));
      }

      const updatedMoment: PersistedMoment = {
        ...existingMoment,
        archivedAt: null,
        deletedAt: null,
        isArchived: false,
        isDeleted: false,
        updatedAt: restoredAt
      };
      moments.set(id, updatedMoment);
      return dataSuccess(updatedMoment);
    },
    softDelete: async (id, deletedAt) => {
      const existingMoment = moments.get(id);
      if (!existingMoment) {
        return dataFailure(recordNotFound(id));
      }

      const updatedMoment: PersistedMoment = {
        ...existingMoment,
        deletedAt,
        isDeleted: true,
        updatedAt: deletedAt
      };
      moments.set(id, updatedMoment);
      return dataSuccess(updatedMoment);
    }
  };

  const settingsRepository: SettingsRepository = {
    get: async (settingKey) => dataSuccess(settings.get(settingKey) ?? null),
    set: async (setting) => {
      settings.set(setting.settingKey, setting);
      return dataSuccess(setting);
    },
    list: async () => dataSuccess(Array.from(settings.values()))
  };

  const widgetSnapshotRepository: WidgetSnapshotRepository = {
    getByWidgetId: async (widgetId) =>
      dataSuccess(
        Array.from(widgetSnapshots.values()).find((snapshot) => snapshot.widgetId === widgetId) ??
          null
      ),
    save: async (snapshot) => {
      widgetSnapshots.set(snapshot.id, snapshot);
      return dataSuccess(snapshot);
    },
    remove: async (id) => {
      widgetSnapshots.delete(id);
      return dataSuccess(undefined);
    },
    list: async () => dataSuccess(Array.from(widgetSnapshots.values()))
  };

  const auditLogRepository: AuditLogRepository = {
    append: async (entry) => {
      auditLogs.push(entry);
      return dataSuccess(entry);
    },
    listRecent: async (limit) => dataSuccess(auditLogs.slice(-limit).reverse())
  };

  const premiumEntitlementRepository: PremiumEntitlementRepository = {
    getCurrent: async () => dataSuccess(premiumEntitlement),
    save: async (entitlement) => {
      premiumEntitlement = entitlement;
      return dataSuccess(entitlement);
    },
    clear: async () => {
      premiumEntitlement = null;
      return dataSuccess(undefined);
    }
  };

  return {
    momentRepository,
    settingsRepository,
    widgetSnapshotRepository,
    auditLogRepository,
    premiumEntitlementRepository
  };
}

function recordNotFound(id: PersistedId) {
  return createPersistenceError({
    code: "DATA_RECORD_NOT_FOUND",
    developerMessage: `Record not found: ${id}`
  });
}

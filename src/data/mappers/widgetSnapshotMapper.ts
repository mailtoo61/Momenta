import type { WidgetSnapshotDomainModel } from "../../domain/widgets";
import type { PersistedWidgetSnapshot } from "../repositories";

export function toPersistedWidgetSnapshot(
  domainSnapshot: WidgetSnapshotDomainModel
): PersistedWidgetSnapshot {
  return {
    id: domainSnapshot.id,
    widgetId: domainSnapshot.widgetId,
    snapshotVersion: domainSnapshot.snapshotVersion,
    generatedAt: domainSnapshot.generatedAt,
    payload: domainSnapshot.payload,
    privacyLevel: domainSnapshot.privacyLevel,
    privacyMode: domainSnapshot.privacyMode,
    expiresAt: null
  };
}

export function toDomainWidgetSnapshot(
  persistedSnapshot: PersistedWidgetSnapshot
): WidgetSnapshotDomainModel {
  return {
    id: persistedSnapshot.id,
    widgetId: persistedSnapshot.widgetId,
    type: "timeline-summary",
    snapshotVersion: persistedSnapshot.snapshotVersion,
    generatedAt: persistedSnapshot.generatedAt,
    payload: persistedSnapshot.payload,
    privacyLevel: persistedSnapshot.privacyLevel,
    privacyMode: persistedSnapshot.privacyMode
  };
}

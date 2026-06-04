import type { PrivacyLevel } from "../../domain/privacy";
import type {
  PersistedId,
  PersistedWidgetSnapshot,
  WidgetSnapshotPayload
} from "../../data/repositories";
import { toPersistedWidgetSnapshot } from "../../data/mappers";
import {
  createServiceError,
  serviceFailure,
  serviceSuccess,
  type ServiceResult
} from "../serviceResult";
import type { WidgetSnapshotServiceDependencies } from "../serviceDependencies";

export type GenerateWidgetSnapshotInput = Readonly<{
  widgetId: string;
  momentIds: ReadonlyArray<PersistedId>;
  privacyLevel: PrivacyLevel;
}>;

export type SaveWidgetSnapshotInput = Readonly<{
  snapshot: PersistedWidgetSnapshot;
}>;

export type RefreshAllWidgetSnapshotsInput = Readonly<{
  reason?: "app-started" | "moment-changed" | "manual";
}>;

export type RefreshSnapshotForMomentInput = Readonly<{
  momentId: PersistedId;
}>;

export type GeneratedWidgetSnapshot = Readonly<{
  widgetId: string;
  snapshotVersion: string;
  payload: WidgetSnapshotPayload;
  privacyLevel: PrivacyLevel;
}>;

export type WidgetSnapshotRefreshResult = Readonly<{
  refreshedSnapshotIds: ReadonlyArray<PersistedId>;
}>;

export type WidgetSnapshotService = {
  generateSnapshot: (
    input: GenerateWidgetSnapshotInput
  ) => Promise<ServiceResult<GeneratedWidgetSnapshot>>;
  saveSnapshot: (input: SaveWidgetSnapshotInput) => Promise<ServiceResult<PersistedWidgetSnapshot>>;
  refreshAllSnapshots: (
    input?: RefreshAllWidgetSnapshotsInput
  ) => Promise<ServiceResult<WidgetSnapshotRefreshResult>>;
  refreshSnapshotForMoment: (
    input: RefreshSnapshotForMomentInput
  ) => Promise<ServiceResult<WidgetSnapshotRefreshResult>>;
};

export const noopWidgetSnapshotService: WidgetSnapshotService = {
  generateSnapshot: async (input) =>
    serviceSuccess({
      widgetId: input.widgetId,
      snapshotVersion: "v1",
      payload: {},
      privacyLevel: input.privacyLevel
    }),
  saveSnapshot: async (input) => serviceSuccess(input.snapshot),
  refreshAllSnapshots: async () =>
    serviceSuccess({
      refreshedSnapshotIds: []
    }),
  refreshSnapshotForMoment: async () =>
    serviceSuccess({
      refreshedSnapshotIds: []
    })
};

export function createWidgetSnapshotService(
  dependencies: WidgetSnapshotServiceDependencies
): WidgetSnapshotService {
  return {
    generateSnapshot: async (input) =>
      serviceSuccess({
        widgetId: input.widgetId,
        snapshotVersion: "v1",
        payload: {
          payloadVersion: "v1",
          momentCount: input.momentIds.length
        },
        privacyLevel: input.privacyLevel
      }),
    saveSnapshot: async (input) => {
      const result = await dependencies.widgetSnapshotRepository.save(
        toPersistedWidgetSnapshot({
          id: input.snapshot.id,
          widgetId: input.snapshot.widgetId,
          type: "timeline-summary",
          snapshotVersion: input.snapshot.snapshotVersion,
          generatedAt: input.snapshot.generatedAt,
          payload: input.snapshot.payload,
          privacyLevel: input.snapshot.privacyLevel,
          privacyMode: input.snapshot.privacyMode
        })
      );

      return result.isSuccess
        ? serviceSuccess(result.value)
        : serviceFailure(
            createServiceError({
              code: "SERVICE_DEPENDENCY_UNAVAILABLE",
              developerMessage: result.error.developerMessage
            })
          );
    },
    refreshAllSnapshots: async () =>
      serviceSuccess({
        refreshedSnapshotIds: []
      }),
    refreshSnapshotForMoment: async () =>
      serviceSuccess({
        refreshedSnapshotIds: []
      })
  };
}

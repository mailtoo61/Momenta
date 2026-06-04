import type { AnalyticsEventPayload } from "../../platform/analytics";
import { analyticsEventRegistry, type AnalyticsEventName } from "../../shared/analytics";
import {
  createServiceError,
  serviceFailure,
  serviceSuccess,
  type ServiceResult
} from "../serviceResult";
import type { AnalyticsServiceDependencies } from "../serviceDependencies";

export type AnalyticsService = {
  track: (
    eventName: AnalyticsEventName,
    payload?: AnalyticsEventPayload
  ) => Promise<ServiceResult<void>>;
  flush: () => Promise<ServiceResult<void>>;
  identifyAnonymousUser: (id: string) => Promise<ServiceResult<void>>;
};

export const noopAnalyticsService: AnalyticsService = {
  track: async () => serviceSuccess(undefined),
  flush: async () => serviceSuccess(undefined),
  identifyAnonymousUser: async () => serviceSuccess(undefined)
};

export function createAnalyticsService(
  dependencies: AnalyticsServiceDependencies
): AnalyticsService {
  const approvedEventNames = new Set(analyticsEventRegistry.map((event) => event.name));

  return {
    track: async (eventName, payload) => {
      if (!approvedEventNames.has(eventName)) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_VALIDATION_FAILED",
            developerMessage: "Analytics event is not registered."
          })
        );
      }

      await dependencies.analyticsProvider.track(eventName, sanitizePayload(payload));
      return serviceSuccess(undefined);
    },
    flush: async () => {
      await dependencies.analyticsProvider.flush?.();
      return serviceSuccess(undefined);
    },
    identifyAnonymousUser: async (id) => {
      await dependencies.analyticsProvider.identify?.(id);
      return serviceSuccess(undefined);
    }
  };
}

function sanitizePayload(payload?: AnalyticsEventPayload): AnalyticsEventPayload | undefined {
  if (!payload) {
    return undefined;
  }

  const blockedKeys = new Set(["title", "notes", "content", "privateText"]);

  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !blockedKeys.has(key))
  ) as AnalyticsEventPayload;
}

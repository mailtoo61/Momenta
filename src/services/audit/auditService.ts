import type { PersistedAuditLog } from "../../data/repositories";
import { auditEventToPersistedLog } from "../../data/mappers";
import { auditEventRegistry, type AuditEventName } from "./auditEventRegistry";
import {
  createServiceError,
  serviceFailure,
  serviceSuccess,
  type ServiceResult
} from "../serviceResult";
import type { AuditServiceDependencies } from "../serviceDependencies";

export type AuditPayload = Readonly<Record<string, string | number | boolean | null>>;

export type AuditService = {
  record: (eventName: AuditEventName, payload?: AuditPayload) => Promise<ServiceResult<void>>;
  recordFailure: (
    eventName: AuditEventName,
    error: unknown,
    payload?: AuditPayload
  ) => Promise<ServiceResult<void>>;
  listRecent: (limit?: number) => Promise<ServiceResult<ReadonlyArray<PersistedAuditLog>>>;
};

export const noopAuditService: AuditService = {
  record: async () => serviceSuccess(undefined),
  recordFailure: async () => serviceSuccess(undefined),
  listRecent: async () => serviceSuccess([])
};

export type CreateAuditServiceOptions = Readonly<{
  idFactory: () => string;
  nowIso: () => string;
}>;

export function createAuditService(
  dependencies: AuditServiceDependencies,
  options: CreateAuditServiceOptions
): AuditService {
  const approvedEventNames = new Set(auditEventRegistry.map((event) => event.name));

  return {
    record: async (eventName, payload) => {
      if (!approvedEventNames.has(eventName)) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_VALIDATION_FAILED",
            developerMessage: "Audit event is not registered."
          })
        );
      }

      const eventDefinition = auditEventRegistry.find((event) => event.name === eventName);
      const appendResult = await dependencies.auditLogRepository.append(
        auditEventToPersistedLog({
          id: options.idFactory(),
          eventName,
          severity: eventDefinition?.severity ?? "info",
          entityType: eventDefinition?.entityType ?? null,
          timestamp: options.nowIso(),
          payload
        })
      );

      if (!appendResult.isSuccess) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_DEPENDENCY_UNAVAILABLE",
            developerMessage: appendResult.error.developerMessage
          })
        );
      }

      return serviceSuccess(undefined);
    },
    recordFailure: async (eventName, error, payload) => {
      const appendResult = await dependencies.auditLogRepository.append(
        auditEventToPersistedLog({
          id: options.idFactory(),
          eventName,
          severity: "error",
          timestamp: options.nowIso(),
          payload: {
            ...(payload ?? {}),
            errorName: error instanceof Error ? error.name : "UnknownError"
          }
        })
      );

      if (!appendResult.isSuccess) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_DEPENDENCY_UNAVAILABLE",
            developerMessage: appendResult.error.developerMessage
          })
        );
      }

      return serviceSuccess(undefined);
    },
    listRecent: async (limit = 20) => {
      const result = await dependencies.auditLogRepository.listRecent(limit);

      if (!result.isSuccess) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_DEPENDENCY_UNAVAILABLE",
            developerMessage: result.error.developerMessage
          })
        );
      }

      return serviceSuccess(result.value);
    }
  };
}

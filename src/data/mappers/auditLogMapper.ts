import type { PersistedAuditLog } from "../repositories";
import type { AuditEntityType, AuditEventName, AuditEventSeverity } from "../../services/audit";

export type AuditEventToPersistedLogInput = Readonly<{
  id: string;
  eventName: AuditEventName;
  severity: AuditEventSeverity;
  timestamp: string;
  entityType?: AuditEntityType | null;
  entityId?: string | null;
  payload?: Readonly<Record<string, string | number | boolean | null>>;
}>;

export function auditEventToPersistedLog(input: AuditEventToPersistedLogInput): PersistedAuditLog {
  return {
    id: input.id,
    eventType: input.eventName,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    timestamp: input.timestamp,
    severity: input.severity,
    details: input.payload ?? {}
  };
}

export const AUDIT_EVENT_NAMES = [
  "app_bootstrap_completed",
  "app_bootstrap_failed",
  "moment_created",
  "moment_updated",
  "moment_archived",
  "moment_restored",
  "reminder_rule_selected",
  "widget_snapshot_updated",
  "premium_gate_blocked"
] as const;

export type AuditEventName = (typeof AUDIT_EVENT_NAMES)[number];
export type AuditEventSeverity = "info" | "warning" | "error";
export type AuditEntityType = "app" | "moment" | "reminder" | "widget" | "premium";

export type AuditEventDefinition = Readonly<{
  name: AuditEventName;
  severity: AuditEventSeverity;
  entityType?: AuditEntityType;
}>;

export const auditEventRegistry = [
  { name: "app_bootstrap_completed", severity: "info", entityType: "app" },
  { name: "app_bootstrap_failed", severity: "error", entityType: "app" },
  { name: "moment_created", severity: "info", entityType: "moment" },
  { name: "moment_updated", severity: "info", entityType: "moment" },
  { name: "moment_archived", severity: "info", entityType: "moment" },
  { name: "moment_restored", severity: "info", entityType: "moment" },
  { name: "reminder_rule_selected", severity: "info", entityType: "reminder" },
  { name: "widget_snapshot_updated", severity: "info", entityType: "widget" },
  { name: "premium_gate_blocked", severity: "warning", entityType: "premium" }
] as const satisfies ReadonlyArray<AuditEventDefinition>;

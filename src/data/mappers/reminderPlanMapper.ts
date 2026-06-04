import type { ReminderPlan } from "../../domain/reminders";
import type { PersistedReminderPlanReference } from "../repositories";

export function toPersistedReminderPlan(
  reminderPlan: ReminderPlan
): PersistedReminderPlanReference {
  return {
    id: reminderPlan.id,
    momentId: reminderPlan.momentId,
    createdAt: reminderPlan.createdAt,
    updatedAt: reminderPlan.updatedAt,
    isEnabled: reminderPlan.isEnabled,
    ruleId: reminderPlan.ruleId,
    nextTriggerAt: reminderPlan.nextTriggerAt,
    lastTriggeredAt: reminderPlan.lastTriggeredAt,
    lastScheduledAt: reminderPlan.lastScheduledAt,
    priority: reminderPlan.priority
  };
}

export function toDomainReminderPlan(
  persistedReminderPlan: PersistedReminderPlanReference
): ReminderPlan {
  return {
    id: persistedReminderPlan.id,
    momentId: persistedReminderPlan.momentId,
    createdAt: persistedReminderPlan.createdAt,
    updatedAt: persistedReminderPlan.updatedAt,
    isEnabled: persistedReminderPlan.isEnabled,
    ruleId: persistedReminderPlan.ruleId,
    nextTriggerAt: persistedReminderPlan.nextTriggerAt,
    lastTriggeredAt: persistedReminderPlan.lastTriggeredAt,
    lastScheduledAt: persistedReminderPlan.lastScheduledAt,
    priority: persistedReminderPlan.priority
  };
}

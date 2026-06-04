import type { ReminderRuleId } from "./reminderRuleRegistry";

export type ReminderPlanId = string;

export type ReminderPlan = Readonly<{
  id: ReminderPlanId;
  momentId: string;
  createdAt: string;
  updatedAt: string;
  isEnabled: boolean;
  ruleId: ReminderRuleId;
  nextTriggerAt: string | null;
  lastTriggeredAt: string | null;
  lastScheduledAt: string | null;
  priority: number;
}>;

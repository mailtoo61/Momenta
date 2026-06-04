import { domainFailure, domainSuccess, type DomainResult } from "../domainResult";
import type { Moment } from "../moments/momentModel";
import { reminderRuleRegistry, type ReminderRuleId } from "./reminderRuleRegistry";

export type ReminderEligibilityInput = Readonly<{
  moment: Pick<Moment, "id" | "isArchived" | "isDeleted" | "privacyLevel">;
  reminderRuleId: ReminderRuleId | string;
}>;

export type ReminderEligibilityResult = Readonly<{
  momentId: string;
  reminderRuleId: ReminderRuleId;
  isEligible: boolean;
  reason: "eligible" | "moment-inactive";
}>;

export function evaluateReminderEligibility(
  input: ReminderEligibilityInput
): DomainResult<ReminderEligibilityResult> {
  const reminderRule = reminderRuleRegistry.find((rule) => rule.id === input.reminderRuleId);

  if (!reminderRule) {
    return domainFailure("DOMAIN_INVALID_REMINDER_RULE", "Reminder rule does not exist.");
  }

  if (input.moment.isArchived || input.moment.isDeleted) {
    return domainSuccess({
      momentId: input.moment.id,
      reminderRuleId: reminderRule.id,
      isEligible: false,
      reason: "moment-inactive"
    });
  }

  return domainSuccess({
    momentId: input.moment.id,
    reminderRuleId: reminderRule.id,
    isEligible: true,
    reason: "eligible"
  });
}

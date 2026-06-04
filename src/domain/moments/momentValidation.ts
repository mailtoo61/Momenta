import { domainFailure, domainSuccess, type DomainResult } from "../domainResult";
import { isPrivacyLevel, type PrivacyLevel } from "../privacy";
import { reminderRuleRegistry, type ReminderRuleId } from "../reminders/reminderRuleRegistry";
import { categoryRegistry, type CategoryId } from "./categoryRegistry";
import { MOMENT_TITLE_MAX_LENGTH } from "./momentConstants";
import type { CreateMomentInput, UpdateMomentInput } from "./momentModel";

export function validateMomentTitle(title: string): DomainResult<string> {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    return domainFailure("DOMAIN_VALIDATION_FAILED", "Moment title is required.");
  }

  if (trimmedTitle.length > MOMENT_TITLE_MAX_LENGTH) {
    return domainFailure("DOMAIN_VALIDATION_FAILED", "Moment title exceeds the maximum length.");
  }

  return domainSuccess(trimmedTitle);
}

export function validateMomentCategory(categoryId: string): DomainResult<CategoryId> {
  const category = categoryRegistry.find((item) => item.id === categoryId);

  if (!category) {
    return domainFailure("DOMAIN_INVALID_CATEGORY", "Moment category does not exist.");
  }

  return domainSuccess(category.id);
}

export function validateMomentPrivacyLevel(privacyLevel: string): DomainResult<PrivacyLevel> {
  if (!isPrivacyLevel(privacyLevel)) {
    return domainFailure("DOMAIN_INVALID_PRIVACY_LEVEL", "Moment privacy level is invalid.");
  }

  return domainSuccess(privacyLevel);
}

export function validateCreateMomentInput(
  input: CreateMomentInput
): DomainResult<CreateMomentInput> {
  const titleResult = validateMomentTitle(input.title);
  if (!titleResult.isSuccess) {
    return titleResult;
  }

  const categoryResult = validateMomentCategory(input.categoryId);
  if (!categoryResult.isSuccess) {
    return categoryResult;
  }

  const privacyResult = validateMomentPrivacyLevel(input.privacyLevel);
  if (!privacyResult.isSuccess) {
    return privacyResult;
  }

  if (!canUseWidgetEligibility(input.widgetEligible, privacyResult.value)) {
    return domainFailure(
      "DOMAIN_OPERATION_NOT_ALLOWED",
      "Sensitive moments require explicit widget privacy handling."
    );
  }

  const reminderRuleResult = validateReminderRuleIds(input.reminderRuleIds ?? []);
  if (!reminderRuleResult.isSuccess) {
    return reminderRuleResult;
  }

  return domainSuccess({
    ...input,
    title: titleResult.value,
    categoryId: categoryResult.value,
    privacyLevel: privacyResult.value
  });
}

export function validateUpdateMomentInput(
  input: UpdateMomentInput
): DomainResult<UpdateMomentInput> {
  if (input.title !== undefined) {
    const titleResult = validateMomentTitle(input.title);
    if (!titleResult.isSuccess) {
      return titleResult;
    }
  }

  if (input.categoryId !== undefined) {
    const categoryResult = validateMomentCategory(input.categoryId);
    if (!categoryResult.isSuccess) {
      return categoryResult;
    }
  }

  if (input.privacyLevel !== undefined) {
    const privacyResult = validateMomentPrivacyLevel(input.privacyLevel);
    if (!privacyResult.isSuccess) {
      return privacyResult;
    }

    if (!canUseWidgetEligibility(input.widgetEligible ?? false, privacyResult.value)) {
      return domainFailure(
        "DOMAIN_OPERATION_NOT_ALLOWED",
        "Sensitive moments require explicit widget privacy handling."
      );
    }
  }

  const reminderRuleResult = validateReminderRuleIds(input.reminderRuleIds ?? []);
  if (!reminderRuleResult.isSuccess) {
    return reminderRuleResult;
  }

  return domainSuccess(input);
}

function validateReminderRuleIds(
  reminderRuleIds: ReadonlyArray<ReminderRuleId | string>
): DomainResult<ReadonlyArray<ReminderRuleId>> {
  const knownRuleIds = new Set(reminderRuleRegistry.map((rule) => rule.id));

  for (const reminderRuleId of reminderRuleIds) {
    if (!knownRuleIds.has(reminderRuleId as ReminderRuleId)) {
      return domainFailure("DOMAIN_INVALID_REMINDER_RULE", "Reminder rule does not exist.");
    }
  }

  return domainSuccess(reminderRuleIds as ReadonlyArray<ReminderRuleId>);
}

function canUseWidgetEligibility(widgetEligible: boolean, privacyLevel: PrivacyLevel): boolean {
  return privacyLevel !== "sensitive" || !widgetEligible;
}

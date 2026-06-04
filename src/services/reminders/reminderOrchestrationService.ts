import type { ReminderRule, ReminderRuleId } from "../../domain/reminders";
import type { PersistedId } from "../../data/repositories";
import { evaluateReminderEligibility } from "../../domain/reminders";
import {
  createServiceError,
  serviceFailure,
  serviceSuccess,
  type ServiceResult
} from "../serviceResult";
import type { ReminderOrchestrationServiceDependencies } from "../serviceDependencies";

export type EvaluateReminderRulesInput = Readonly<{
  momentId: PersistedId;
  reminderRuleIds: ReadonlyArray<ReminderRuleId>;
}>;

export type ScheduleMomentRemindersInput = Readonly<{
  momentId: PersistedId;
  reminderRuleIds: ReadonlyArray<ReminderRuleId>;
}>;

export type MomentReminderInput = Readonly<{
  momentId: PersistedId;
}>;

export type EvaluatedReminderRules = Readonly<{
  momentId: PersistedId;
  rules: ReadonlyArray<ReminderRule>;
}>;

export type ReminderScheduleResult = Readonly<{
  momentId: PersistedId;
  scheduledReminderIds: ReadonlyArray<string>;
}>;

export type ReminderOrchestrationService = {
  evaluateReminderRules: (
    input: EvaluateReminderRulesInput
  ) => Promise<ServiceResult<EvaluatedReminderRules>>;
  scheduleMomentReminders: (
    input: ScheduleMomentRemindersInput
  ) => Promise<ServiceResult<ReminderScheduleResult>>;
  cancelMomentReminders: (input: MomentReminderInput) => Promise<ServiceResult<void>>;
  rescheduleMomentReminders: (
    input: ScheduleMomentRemindersInput
  ) => Promise<ServiceResult<ReminderScheduleResult>>;
};

export const noopReminderOrchestrationService: ReminderOrchestrationService = {
  evaluateReminderRules: async (input) =>
    serviceSuccess({
      momentId: input.momentId,
      rules: []
    }),
  scheduleMomentReminders: async (input) =>
    serviceSuccess({
      momentId: input.momentId,
      scheduledReminderIds: []
    }),
  cancelMomentReminders: async () => serviceSuccess(undefined),
  rescheduleMomentReminders: async (input) =>
    serviceSuccess({
      momentId: input.momentId,
      scheduledReminderIds: []
    })
};

export function createReminderOrchestrationService(
  dependencies: ReminderOrchestrationServiceDependencies
): ReminderOrchestrationService {
  return {
    evaluateReminderRules: async (input) => {
      const momentResult = await dependencies.momentRepository.getById(input.momentId);
      if (!momentResult.isSuccess) {
        return dependencyFailure(momentResult.error.developerMessage);
      }

      if (!momentResult.value) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_VALIDATION_FAILED",
            developerMessage: "Moment does not exist."
          })
        );
      }

      for (const reminderRuleId of input.reminderRuleIds) {
        const eligibilityResult = evaluateReminderEligibility({
          moment: {
            id: momentResult.value.id,
            isArchived: momentResult.value.isArchived,
            isDeleted: momentResult.value.isDeleted,
            privacyLevel: momentResult.value.privacyLevel
          },
          reminderRuleId
        });

        if (!eligibilityResult.isSuccess) {
          return serviceFailure(
            createServiceError({
              code: "SERVICE_VALIDATION_FAILED",
              developerMessage: eligibilityResult.error.developerMessage
            })
          );
        }
      }

      return serviceSuccess({
        momentId: input.momentId,
        rules: []
      });
    },
    scheduleMomentReminders: async (input) =>
      serviceSuccess({
        momentId: input.momentId,
        scheduledReminderIds: []
      }),
    cancelMomentReminders: async () => serviceSuccess(undefined),
    rescheduleMomentReminders: async (input) =>
      serviceSuccess({
        momentId: input.momentId,
        scheduledReminderIds: []
      })
  };
}

function dependencyFailure(developerMessage: string) {
  return serviceFailure(
    createServiceError({
      code: "SERVICE_DEPENDENCY_UNAVAILABLE",
      developerMessage
    })
  );
}

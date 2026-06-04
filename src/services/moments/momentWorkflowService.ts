import type { CategoryId, PresetTemplateId } from "../../domain/moments";
import type { PlanId } from "../../domain/monetization";
import type { PrivacyLevel } from "../../domain/privacy";
import type { ReminderRuleId } from "../../domain/reminders";
import type { PersistedId, PersistedMoment } from "../../data/repositories";
import { createInputToPersistedDraft } from "../../data/mappers";
import { validateCreateMomentInput, validateUpdateMomentInput } from "../../domain/moments";
import {
  createServiceError,
  serviceFailure,
  serviceSuccess,
  type ServiceResult
} from "../serviceResult";
import type { MomentWorkflowServiceDependencies } from "../serviceDependencies";

export type CreateMomentInput = Readonly<{
  title: string;
  notes?: string;
  categoryId: CategoryId;
  privacyLevel: PrivacyLevel;
  widgetEligible: boolean;
  presetId?: PresetTemplateId;
  reminderRuleIds?: ReadonlyArray<ReminderRuleId>;
  currentPlanId: PlanId;
}>;

export type UpdateMomentInput = Readonly<{
  id: PersistedId;
  title?: string;
  notes?: string | null;
  categoryId?: CategoryId;
  privacyLevel?: PrivacyLevel;
  widgetEligible?: boolean;
  reminderRuleIds?: ReadonlyArray<ReminderRuleId>;
}>;

export type MomentIdInput = Readonly<{
  id: PersistedId;
}>;

export type SearchMomentsInput = Readonly<{
  query: string;
  limit?: number;
}>;

export type MomentWorkflowService = {
  createMoment: (input: CreateMomentInput) => Promise<ServiceResult<PersistedMoment>>;
  updateMoment: (input: UpdateMomentInput) => Promise<ServiceResult<PersistedMoment>>;
  archiveMoment: (input: MomentIdInput) => Promise<ServiceResult<PersistedMoment>>;
  restoreMoment: (input: MomentIdInput) => Promise<ServiceResult<PersistedMoment>>;
  softDeleteMoment: (input: MomentIdInput) => Promise<ServiceResult<PersistedMoment>>;
  searchMoments: (
    input: SearchMomentsInput
  ) => Promise<ServiceResult<ReadonlyArray<PersistedMoment>>>;
};

export const noopMomentWorkflowService: MomentWorkflowService = {
  createMoment: async () => serviceSuccess(emptyPersistedMoment()),
  updateMoment: async (input) => serviceSuccess(emptyPersistedMoment(input.id)),
  archiveMoment: async (input) => serviceSuccess(emptyPersistedMoment(input.id)),
  restoreMoment: async (input) => serviceSuccess(emptyPersistedMoment(input.id)),
  softDeleteMoment: async (input) => serviceSuccess(emptyPersistedMoment(input.id)),
  searchMoments: async () => serviceSuccess([])
};

export type CreateMomentWorkflowServiceOptions = Readonly<{
  idFactory: () => string;
  nowIso: () => string;
}>;

export function createMomentWorkflowService(
  dependencies: MomentWorkflowServiceDependencies,
  options: CreateMomentWorkflowServiceOptions
): MomentWorkflowService {
  return {
    createMoment: async (input) => {
      const validationResult = validateCreateMomentInput(input);
      if (!validationResult.isSuccess) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_VALIDATION_FAILED",
            developerMessage: validationResult.error.developerMessage
          })
        );
      }

      const persistedDraftInput = {
        ...input,
        title: validationResult.value.title,
        notes: validationResult.value.notes,
        categoryId: input.categoryId,
        privacyLevel: input.privacyLevel
      };

      const createResult = await dependencies.momentRepository.create(
        createInputToPersistedDraft(persistedDraftInput, {
          generatedId: options.idFactory(),
          currentIsoTimestamp: options.nowIso()
        })
      );

      if (!createResult.isSuccess) {
        return dependencyFailure(createResult.error.developerMessage);
      }

      await dependencies.auditService.record("moment_created", {
        momentId: createResult.value.id,
        categoryId: createResult.value.categoryRegistryId
      });
      await dependencies.analyticsService.track("moment_created", {
        categoryId: createResult.value.categoryRegistryId
      });

      return serviceSuccess(createResult.value);
    },
    updateMoment: async (input) => {
      const validationResult = validateUpdateMomentInput(input);
      if (!validationResult.isSuccess) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_VALIDATION_FAILED",
            developerMessage: validationResult.error.developerMessage
          })
        );
      }

      const updateResult = await dependencies.momentRepository.update(input.id, {
        title: input.title,
        notes: input.notes,
        categoryId: input.categoryId,
        categoryRegistryId: input.categoryId,
        privacyLevel: input.privacyLevel,
        widgetEligible: input.widgetEligible,
        updatedAt: options.nowIso()
      });

      if (!updateResult.isSuccess) {
        return dependencyFailure(updateResult.error.developerMessage);
      }

      await dependencies.auditService.record("moment_updated", {
        momentId: updateResult.value.id
      });

      return serviceSuccess(updateResult.value);
    },
    archiveMoment: async (input) => {
      const result = await dependencies.momentRepository.archive(input.id, options.nowIso());
      if (!result.isSuccess) {
        return dependencyFailure(result.error.developerMessage);
      }

      await dependencies.auditService.record("moment_archived", { momentId: input.id });
      return serviceSuccess(result.value);
    },
    restoreMoment: async (input) => {
      const result = await dependencies.momentRepository.restore(input.id, options.nowIso());
      if (!result.isSuccess) {
        return dependencyFailure(result.error.developerMessage);
      }

      await dependencies.auditService.record("moment_restored", { momentId: input.id });
      return serviceSuccess(result.value);
    },
    softDeleteMoment: async (input) => {
      const result = await dependencies.momentRepository.softDelete(input.id, options.nowIso());
      if (!result.isSuccess) {
        return dependencyFailure(result.error.developerMessage);
      }

      await dependencies.auditService.record("moment_archived", { momentId: input.id });
      return serviceSuccess(result.value);
    },
    searchMoments: async (input) => {
      const result = await dependencies.momentRepository.search(input);
      return result.isSuccess
        ? serviceSuccess(result.value)
        : dependencyFailure(result.error.developerMessage);
    }
  };
}

function emptyPersistedMoment(id: PersistedId = "noop-moment"): PersistedMoment {
  return {
    id,
    title: "",
    notes: null,
    categoryId: "noop-category",
    categoryRegistryId: "custom",
    createdAt: "1970-01-01T00:00:00.000Z",
    updatedAt: "1970-01-01T00:00:00.000Z",
    completedAt: null,
    lastActionAt: null,
    archivedAt: null,
    deletedAt: null,
    isArchived: false,
    isDeleted: false,
    privacyLevel: "private",
    widgetEligible: false,
    presetId: null
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

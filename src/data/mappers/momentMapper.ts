import type { CategoryId, CreateMomentInput, Moment } from "../../domain/moments";
import type { PrivacyLevel } from "../../domain/privacy";
import type { PersistedMoment } from "../repositories";

export type PersistableCreateMomentInput = Omit<CreateMomentInput, "categoryId" | "privacyLevel"> &
  Readonly<{
    categoryId: CategoryId;
    privacyLevel: PrivacyLevel;
  }>;

export type CreateMomentDraftOptions = Readonly<{
  generatedId: string;
  currentIsoTimestamp: string;
  categoryPersistedId?: string;
  defaultIsArchived?: boolean;
  defaultIsDeleted?: boolean;
}>;

export function toPersistedMoment(domainMoment: Moment): PersistedMoment {
  return {
    id: domainMoment.id,
    title: domainMoment.title,
    notes: domainMoment.notes,
    categoryId: domainMoment.categoryId,
    categoryRegistryId: domainMoment.categoryId,
    createdAt: domainMoment.createdAt,
    updatedAt: domainMoment.updatedAt,
    completedAt: null,
    lastActionAt: domainMoment.lastActionAt,
    archivedAt: domainMoment.archivedAt,
    deletedAt: domainMoment.deletedAt,
    isArchived: domainMoment.isArchived,
    isDeleted: domainMoment.isDeleted,
    privacyLevel: domainMoment.privacyLevel,
    widgetEligible: domainMoment.widgetEligible,
    presetId: domainMoment.presetId
  };
}

export function toDomainMoment(persistedMoment: PersistedMoment): Moment {
  return {
    id: persistedMoment.id,
    title: persistedMoment.title,
    notes: persistedMoment.notes,
    categoryId: persistedMoment.categoryRegistryId,
    createdAt: persistedMoment.createdAt,
    updatedAt: persistedMoment.updatedAt,
    lastActionAt: persistedMoment.lastActionAt,
    archivedAt: persistedMoment.archivedAt,
    deletedAt: persistedMoment.deletedAt,
    isArchived: persistedMoment.isArchived,
    isDeleted: persistedMoment.isDeleted,
    privacyLevel: persistedMoment.privacyLevel,
    widgetEligible: persistedMoment.widgetEligible,
    presetId: persistedMoment.presetId
  };
}

export function createInputToPersistedDraft(
  input: PersistableCreateMomentInput,
  options: CreateMomentDraftOptions
): PersistedMoment {
  return {
    id: options.generatedId,
    title: input.title.trim(),
    notes: input.notes ?? null,
    categoryId: options.categoryPersistedId ?? input.categoryId,
    categoryRegistryId: input.categoryId,
    createdAt: options.currentIsoTimestamp,
    updatedAt: options.currentIsoTimestamp,
    completedAt: null,
    lastActionAt: null,
    archivedAt: null,
    deletedAt: null,
    isArchived: options.defaultIsArchived ?? false,
    isDeleted: options.defaultIsDeleted ?? false,
    privacyLevel: input.privacyLevel,
    widgetEligible: input.widgetEligible,
    presetId: input.presetId ?? null
  };
}

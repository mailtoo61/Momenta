import type { PrivacyLevel } from "../privacy";
import type { ReminderRuleId } from "../reminders/reminderRuleRegistry";
import type { CategoryId } from "./categoryRegistry";
import type { PresetTemplateId } from "./presetTemplateRegistry";

export type MomentId = string;
export type MomentTitle = string;
export type MomentNotes = string | null;
export type MomentStatus = "active" | "archived" | "deleted";
export type MomentPrivacyLevel = PrivacyLevel;
export type IsoTimestamp = string;

export type Moment = Readonly<{
  id: MomentId;
  title: MomentTitle;
  notes: MomentNotes;
  categoryId: CategoryId;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
  lastActionAt: IsoTimestamp | null;
  archivedAt: IsoTimestamp | null;
  deletedAt: IsoTimestamp | null;
  isArchived: boolean;
  isDeleted: boolean;
  privacyLevel: MomentPrivacyLevel;
  widgetEligible: boolean;
  presetId: PresetTemplateId | null;
}>;

export type CreateMomentInput = Readonly<{
  title: MomentTitle;
  notes?: MomentNotes;
  categoryId: CategoryId | string;
  privacyLevel: MomentPrivacyLevel | string;
  widgetEligible: boolean;
  presetId?: PresetTemplateId | null;
  reminderRuleIds?: ReadonlyArray<ReminderRuleId | string>;
}>;

export type UpdateMomentInput = Readonly<{
  id: MomentId;
  title?: MomentTitle;
  notes?: MomentNotes;
  categoryId?: CategoryId | string;
  privacyLevel?: MomentPrivacyLevel | string;
  widgetEligible?: boolean;
  reminderRuleIds?: ReadonlyArray<ReminderRuleId | string>;
}>;

export type ArchiveMomentInput = Readonly<{
  id: MomentId;
  archivedAt: IsoTimestamp;
}>;

export type RestoreMomentInput = Readonly<{
  id: MomentId;
  restoredAt: IsoTimestamp;
}>;

export type SoftDeleteMomentInput = Readonly<{
  id: MomentId;
  deletedAt: IsoTimestamp;
}>;

export type SearchMomentsInput = Readonly<{
  query: string;
  limit?: number;
}>;

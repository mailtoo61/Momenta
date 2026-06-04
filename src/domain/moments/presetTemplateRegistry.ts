import type { PrivacyLevel } from "../privacy";
import type { ReminderRuleId } from "../reminders";
import type { CategoryId } from "./categoryRegistry";

export const PRESET_TEMPLATE_IDS = [
  "vehicle-inspection",
  "vehicle-maintenance",
  "doctor-appointment",
  "dentist-check",
  "call-mother",
  "exercise",
  "pet-vaccination",
  "insurance-renewal"
] as const;

export type PresetTemplateId = (typeof PRESET_TEMPLATE_IDS)[number];

export type PresetTemplate = Readonly<{
  id: PresetTemplateId;
  titleKey: string;
  descriptionKey: string;
  categoryId: CategoryId;
  defaultReminderRuleIds: ReadonlyArray<ReminderRuleId>;
  defaultPrivacyLevel: PrivacyLevel;
  widgetEligible: boolean;
}>;

export const presetTemplateRegistry = [
  {
    id: "vehicle-inspection",
    titleKey: "presets.vehicleInspection.title",
    descriptionKey: "presets.vehicleInspection.description",
    categoryId: "vehicle",
    defaultReminderRuleIds: ["one-month-before", "one-week-before"],
    defaultPrivacyLevel: "private",
    widgetEligible: true
  },
  {
    id: "vehicle-maintenance",
    titleKey: "presets.vehicleMaintenance.title",
    descriptionKey: "presets.vehicleMaintenance.description",
    categoryId: "vehicle",
    defaultReminderRuleIds: ["one-week-before"],
    defaultPrivacyLevel: "private",
    widgetEligible: true
  },
  {
    id: "doctor-appointment",
    titleKey: "presets.doctorAppointment.title",
    descriptionKey: "presets.doctorAppointment.description",
    categoryId: "health",
    defaultReminderRuleIds: ["tomorrow", "one-week-before"],
    defaultPrivacyLevel: "sensitive",
    widgetEligible: false
  },
  {
    id: "dentist-check",
    titleKey: "presets.dentistCheck.title",
    descriptionKey: "presets.dentistCheck.description",
    categoryId: "health",
    defaultReminderRuleIds: ["one-week-before"],
    defaultPrivacyLevel: "sensitive",
    widgetEligible: false
  },
  {
    id: "call-mother",
    titleKey: "presets.callMother.title",
    descriptionKey: "presets.callMother.description",
    categoryId: "family",
    defaultReminderRuleIds: ["today", "long-time-no-action"],
    defaultPrivacyLevel: "private",
    widgetEligible: true
  },
  {
    id: "exercise",
    titleKey: "presets.exercise.title",
    descriptionKey: "presets.exercise.description",
    categoryId: "self",
    defaultReminderRuleIds: ["long-time-no-action"],
    defaultPrivacyLevel: "private",
    widgetEligible: true
  },
  {
    id: "pet-vaccination",
    titleKey: "presets.petVaccination.title",
    descriptionKey: "presets.petVaccination.description",
    categoryId: "pet",
    defaultReminderRuleIds: ["one-week-before"],
    defaultPrivacyLevel: "private",
    widgetEligible: true
  },
  {
    id: "insurance-renewal",
    titleKey: "presets.insuranceRenewal.title",
    descriptionKey: "presets.insuranceRenewal.description",
    categoryId: "finance",
    defaultReminderRuleIds: ["one-month-before", "one-week-before"],
    defaultPrivacyLevel: "sensitive",
    widgetEligible: false
  }
] as const satisfies ReadonlyArray<PresetTemplate>;

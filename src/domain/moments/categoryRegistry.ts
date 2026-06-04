import type { PrivacyLevel } from "../privacy";
import type { ReminderRuleId } from "../reminders";
import type { SemanticColorRole } from "../../shared/theme";

export const CATEGORY_IDS = [
  "family",
  "health",
  "vehicle",
  "self",
  "home",
  "finance",
  "pet",
  "custom"
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type MomentCategory = Readonly<{
  id: CategoryId;
  labelKey: string;
  descriptionKey: string;
  iconKey: string;
  semanticColor: SemanticColorRole;
  defaultPrivacyLevel: PrivacyLevel;
  widgetEligible: boolean;
  defaultReminderRuleIds: ReadonlyArray<ReminderRuleId>;
}>;

export const categoryRegistry = [
  {
    id: "family",
    labelKey: "categories.family.label",
    descriptionKey: "categories.family.description",
    iconKey: "family",
    semanticColor: "family",
    defaultPrivacyLevel: "private",
    widgetEligible: true,
    defaultReminderRuleIds: ["tomorrow", "one-week-before"]
  },
  {
    id: "health",
    labelKey: "categories.health.label",
    descriptionKey: "categories.health.description",
    iconKey: "heart-pulse",
    semanticColor: "health",
    defaultPrivacyLevel: "sensitive",
    widgetEligible: false,
    defaultReminderRuleIds: ["tomorrow", "one-week-before"]
  },
  {
    id: "vehicle",
    labelKey: "categories.vehicle.label",
    descriptionKey: "categories.vehicle.description",
    iconKey: "car",
    semanticColor: "vehicle",
    defaultPrivacyLevel: "private",
    widgetEligible: true,
    defaultReminderRuleIds: ["one-week-before", "one-month-before"]
  },
  {
    id: "self",
    labelKey: "categories.self.label",
    descriptionKey: "categories.self.description",
    iconKey: "sparkles",
    semanticColor: "self",
    defaultPrivacyLevel: "private",
    widgetEligible: true,
    defaultReminderRuleIds: ["long-time-no-action"]
  },
  {
    id: "home",
    labelKey: "categories.home.label",
    descriptionKey: "categories.home.description",
    iconKey: "home",
    semanticColor: "home",
    defaultPrivacyLevel: "private",
    widgetEligible: true,
    defaultReminderRuleIds: ["one-week-before"]
  },
  {
    id: "finance",
    labelKey: "categories.finance.label",
    descriptionKey: "categories.finance.description",
    iconKey: "wallet",
    semanticColor: "finance",
    defaultPrivacyLevel: "sensitive",
    widgetEligible: false,
    defaultReminderRuleIds: ["one-week-before", "one-month-before"]
  },
  {
    id: "pet",
    labelKey: "categories.pet.label",
    descriptionKey: "categories.pet.description",
    iconKey: "paw-print",
    semanticColor: "pet",
    defaultPrivacyLevel: "private",
    widgetEligible: true,
    defaultReminderRuleIds: ["one-week-before"]
  },
  {
    id: "custom",
    labelKey: "categories.custom.label",
    descriptionKey: "categories.custom.description",
    iconKey: "bookmark",
    semanticColor: "custom",
    defaultPrivacyLevel: "private",
    widgetEligible: true,
    defaultReminderRuleIds: []
  }
] as const satisfies ReadonlyArray<MomentCategory>;

export function getCategoryById(categoryId: CategoryId): MomentCategory {
  return categoryRegistry.find((category) => category.id === categoryId) ?? categoryRegistry[7];
}

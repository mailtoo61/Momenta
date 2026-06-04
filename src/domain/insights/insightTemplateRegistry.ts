import type { CategoryId } from "../moments";
import type { PrivacyLevel } from "../privacy";

export const INSIGHT_TEMPLATE_IDS = [
  "upcoming-moment",
  "overdue-moment",
  "quiet-category",
  "long-time-no-action",
  "weekly-rhythm"
] as const;

export type InsightTemplateId = (typeof INSIGHT_TEMPLATE_IDS)[number];
export type InsightTriggerType =
  | "upcoming"
  | "overdue"
  | "category-quiet"
  | "inactivity"
  | "weekly";
export type SupportedInsightCategories = ReadonlyArray<CategoryId> | "all";

export type InsightTemplate = Readonly<{
  id: InsightTemplateId;
  labelKey: string;
  descriptionKey: string;
  triggerType: InsightTriggerType;
  supportedCategoryIds: SupportedInsightCategories;
  privacyLevel: PrivacyLevel;
  priority: number;
}>;

export const insightTemplateRegistry = [
  {
    id: "upcoming-moment",
    labelKey: "insights.upcomingMoment.label",
    descriptionKey: "insights.upcomingMoment.description",
    triggerType: "upcoming",
    supportedCategoryIds: "all",
    privacyLevel: "private",
    priority: 10
  },
  {
    id: "overdue-moment",
    labelKey: "insights.overdueMoment.label",
    descriptionKey: "insights.overdueMoment.description",
    triggerType: "overdue",
    supportedCategoryIds: "all",
    privacyLevel: "private",
    priority: 20
  },
  {
    id: "quiet-category",
    labelKey: "insights.quietCategory.label",
    descriptionKey: "insights.quietCategory.description",
    triggerType: "category-quiet",
    supportedCategoryIds: "all",
    privacyLevel: "private",
    priority: 30
  },
  {
    id: "long-time-no-action",
    labelKey: "insights.longTimeNoAction.label",
    descriptionKey: "insights.longTimeNoAction.description",
    triggerType: "inactivity",
    supportedCategoryIds: ["family", "self", "pet"],
    privacyLevel: "private",
    priority: 40
  },
  {
    id: "weekly-rhythm",
    labelKey: "insights.weeklyRhythm.label",
    descriptionKey: "insights.weeklyRhythm.description",
    triggerType: "weekly",
    supportedCategoryIds: "all",
    privacyLevel: "private",
    priority: 50
  }
] as const satisfies ReadonlyArray<InsightTemplate>;

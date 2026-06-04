export const UNLIMITED_LIMIT = null;

export const PLAN_IDS = ["free", "weekly", "monthly", "lifetime"] as const;

export type PlanId = (typeof PLAN_IDS)[number];
export type PlanLimit = number | typeof UNLIMITED_LIMIT;

export type MonetizationPlan = Readonly<{
  id: PlanId;
  labelKey: string;
  descriptionKey: string;
  entitlementId: string;
  momentLimit: PlanLimit;
  widgetLimit: PlanLimit;
  premiumWidgetAccess: boolean;
  premiumThemeAccess: boolean;
  exportAccess: boolean;
  importAccess: boolean;
  weeklySummaryAccess: boolean;
  futureSyncAccess: boolean;
}>;

export const planRegistry = [
  {
    id: "free",
    labelKey: "monetization.free.label",
    descriptionKey: "monetization.free.description",
    entitlementId: "free",
    momentLimit: 5,
    widgetLimit: 1,
    premiumWidgetAccess: false,
    premiumThemeAccess: false,
    exportAccess: false,
    importAccess: true,
    weeklySummaryAccess: false,
    futureSyncAccess: false
  },
  {
    id: "weekly",
    labelKey: "monetization.weekly.label",
    descriptionKey: "monetization.weekly.description",
    entitlementId: "premium-weekly",
    momentLimit: UNLIMITED_LIMIT,
    widgetLimit: 4,
    premiumWidgetAccess: true,
    premiumThemeAccess: true,
    exportAccess: true,
    importAccess: true,
    weeklySummaryAccess: true,
    futureSyncAccess: false
  },
  {
    id: "monthly",
    labelKey: "monetization.monthly.label",
    descriptionKey: "monetization.monthly.description",
    entitlementId: "premium-monthly",
    momentLimit: UNLIMITED_LIMIT,
    widgetLimit: 6,
    premiumWidgetAccess: true,
    premiumThemeAccess: true,
    exportAccess: true,
    importAccess: true,
    weeklySummaryAccess: true,
    futureSyncAccess: false
  },
  {
    id: "lifetime",
    labelKey: "monetization.lifetime.label",
    descriptionKey: "monetization.lifetime.description",
    entitlementId: "premium-lifetime",
    momentLimit: UNLIMITED_LIMIT,
    widgetLimit: UNLIMITED_LIMIT,
    premiumWidgetAccess: true,
    premiumThemeAccess: true,
    exportAccess: true,
    importAccess: true,
    weeklySummaryAccess: true,
    futureSyncAccess: true
  }
] as const satisfies ReadonlyArray<MonetizationPlan>;

export function getPlanById(planId: PlanId): MonetizationPlan {
  return planRegistry.find((plan) => plan.id === planId) ?? planRegistry[0];
}

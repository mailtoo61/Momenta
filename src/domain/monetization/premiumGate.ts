import type { MonetizationPlan } from "./planRegistry";

function isWithinLimit(limit: MonetizationPlan["momentLimit"], currentCount: number): boolean {
  return limit === null || currentCount < limit;
}

export function canCreateMoment(plan: MonetizationPlan, currentMomentCount: number): boolean {
  return isWithinLimit(plan.momentLimit, currentMomentCount);
}

export function canUseWidget(plan: MonetizationPlan, widgetIsPremium: boolean): boolean {
  return !widgetIsPremium || plan.premiumWidgetAccess;
}

export function canUseTheme(plan: MonetizationPlan, themeIsPremium: boolean): boolean {
  return !themeIsPremium || plan.premiumThemeAccess;
}

export function canExport(plan: MonetizationPlan): boolean {
  return plan.exportAccess;
}

export function canImport(plan: MonetizationPlan): boolean {
  return plan.importAccess;
}

export function canUseWeeklySummary(plan: MonetizationPlan): boolean {
  return plan.weeklySummaryAccess;
}

export function canUseFutureSync(plan: MonetizationPlan): boolean {
  return plan.futureSyncAccess;
}

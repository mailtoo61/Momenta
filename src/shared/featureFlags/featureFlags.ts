export type FeatureFlagKey =
  | "widgetsEnabled"
  | "premiumEnabled"
  | "weeklySummaryEnabled"
  | "exportEnabled"
  | "importEnabled"
  | "debugConsoleEnabled"
  | "futureAiEnabled"
  | "cloudSyncEnabled";

export type FeatureFlags = Readonly<Record<FeatureFlagKey, boolean>>;

export const defaultFeatureFlags: FeatureFlags = {
  widgetsEnabled: false,
  premiumEnabled: false,
  weeklySummaryEnabled: false,
  exportEnabled: false,
  importEnabled: false,
  debugConsoleEnabled: true,
  futureAiEnabled: false,
  cloudSyncEnabled: false
};

export function isFeatureEnabled(flags: FeatureFlags, key: FeatureFlagKey): boolean {
  return flags[key];
}

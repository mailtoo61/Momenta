export type ProviderKey = "analytics" | "crash" | "billing" | "notifications" | "widgets";

export type SdkKillSwitches = Readonly<Record<ProviderKey, boolean>>;

export const defaultSdkKillSwitches: SdkKillSwitches = {
  analytics: true,
  crash: true,
  billing: true,
  notifications: true,
  widgets: true
};

export function isProviderDisabled(
  killSwitches: SdkKillSwitches,
  providerKey: ProviderKey
): boolean {
  return killSwitches[providerKey];
}

import { noopAnalyticsProvider, type AnalyticsProvider } from "../analytics";
import { noopBillingProvider, type BillingProvider } from "../billing";
import { noopCrashProvider, type CrashProvider } from "../crash";
import { noopNotificationProvider, type NotificationProvider } from "../notifications";
import { noopWidgetProvider, type WidgetProvider } from "../widgets";
import { defaultSdkKillSwitches, type SdkKillSwitches } from "./sdkKillSwitches";
import { disabledSdkHealthState, type SdkHealthState } from "./sdkHealth";

export type ProviderRegistry = {
  analyticsProvider: AnalyticsProvider;
  crashProvider: CrashProvider;
  billingProvider: BillingProvider;
  notificationProvider: NotificationProvider;
  widgetProvider: WidgetProvider;
  sdkHealth: Readonly<Record<keyof SdkKillSwitches, SdkHealthState>>;
  sdkKillSwitches: SdkKillSwitches;
};

export function createProviderRegistry(
  overrides: Partial<
    Pick<
      ProviderRegistry,
      | "analyticsProvider"
      | "crashProvider"
      | "billingProvider"
      | "notificationProvider"
      | "widgetProvider"
      | "sdkKillSwitches"
    >
  > = {}
): ProviderRegistry {
  const sdkKillSwitches = overrides.sdkKillSwitches ?? defaultSdkKillSwitches;

  return {
    analyticsProvider: overrides.analyticsProvider ?? noopAnalyticsProvider,
    crashProvider: overrides.crashProvider ?? noopCrashProvider,
    billingProvider: overrides.billingProvider ?? noopBillingProvider,
    notificationProvider: overrides.notificationProvider ?? noopNotificationProvider,
    widgetProvider: overrides.widgetProvider ?? noopWidgetProvider,
    sdkKillSwitches,
    sdkHealth: {
      analytics: disabledSdkHealthState,
      crash: disabledSdkHealthState,
      billing: disabledSdkHealthState,
      notifications: disabledSdkHealthState,
      widgets: disabledSdkHealthState
    }
  };
}

export const providerRegistry = createProviderRegistry();

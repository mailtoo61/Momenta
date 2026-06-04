export const ANALYTICS_EVENT_NAMES = [
  "app_bootstrapped",
  "onboarding_started",
  "onboarding_completed",
  "moment_create_started",
  "moment_created",
  "reminder_enabled",
  "widget_selected",
  "premium_gate_viewed",
  "paywall_viewed"
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];
export type AnalyticsPrivacyLevel = "operational" | "anonymous";

export type AnalyticsEventDefinition = Readonly<{
  name: AnalyticsEventName;
  allowedPayloadKeys: ReadonlyArray<string>;
  privacyLevel: AnalyticsPrivacyLevel;
}>;

export const analyticsEventRegistry = [
  { name: "app_bootstrapped", allowedPayloadKeys: ["environment"], privacyLevel: "operational" },
  { name: "onboarding_started", allowedPayloadKeys: [], privacyLevel: "anonymous" },
  { name: "onboarding_completed", allowedPayloadKeys: [], privacyLevel: "anonymous" },
  { name: "moment_create_started", allowedPayloadKeys: ["categoryId"], privacyLevel: "anonymous" },
  { name: "moment_created", allowedPayloadKeys: ["categoryId"], privacyLevel: "anonymous" },
  { name: "reminder_enabled", allowedPayloadKeys: ["reminderRuleId"], privacyLevel: "anonymous" },
  { name: "widget_selected", allowedPayloadKeys: ["widgetId"], privacyLevel: "anonymous" },
  { name: "premium_gate_viewed", allowedPayloadKeys: ["gateId"], privacyLevel: "anonymous" },
  { name: "paywall_viewed", allowedPayloadKeys: ["source"], privacyLevel: "anonymous" }
] as const satisfies ReadonlyArray<AnalyticsEventDefinition>;

export const SDK_HEALTH_STATUSES = ["healthy", "degraded", "disabled", "failed"] as const;

export type SdkHealthStatus = (typeof SDK_HEALTH_STATUSES)[number];

export type SdkHealthState = Readonly<{
  status: SdkHealthStatus;
  checkedAtIso: string | null;
}>;

export const disabledSdkHealthState: SdkHealthState = {
  status: "disabled",
  checkedAtIso: null
};

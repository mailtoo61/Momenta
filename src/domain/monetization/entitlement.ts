import type { PlanId } from "./planRegistry";

export type PremiumEntitlementId = string;
export type PremiumEntitlementStatus = "free" | "active" | "expired" | "unknown";
export type PremiumEntitlementSource = "local" | "billing-provider" | "restore" | "unknown";

export type PremiumEntitlement = Readonly<{
  id: PremiumEntitlementId;
  planId: PlanId;
  status: PremiumEntitlementStatus;
  activatedAt: string | null;
  expiresAt: string | null;
  lastValidatedAt: string | null;
  source: PremiumEntitlementSource;
}>;

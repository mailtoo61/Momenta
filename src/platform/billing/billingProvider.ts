export type EntitlementStatus = "none" | "active" | "expired" | "unknown";

export type BillingEntitlement = Readonly<{
  status: EntitlementStatus;
  planId?: string;
}>;

export type PurchaseResult = Readonly<{
  isSuccessful: boolean;
  entitlement: BillingEntitlement;
}>;

export type BillingProvider = {
  getEntitlement: () => Promise<BillingEntitlement>;
  restorePurchases: () => Promise<BillingEntitlement>;
  purchase: (planId: string) => Promise<PurchaseResult>;
};

const emptyEntitlement: BillingEntitlement = {
  status: "none"
};

export const noopBillingProvider: BillingProvider = {
  getEntitlement: async () => emptyEntitlement,
  restorePurchases: async () => emptyEntitlement,
  purchase: async () => ({
    isSuccessful: false,
    entitlement: emptyEntitlement
  })
};

import type { PremiumEntitlement } from "../../domain/monetization";
import type { PersistedPremiumEntitlement } from "../repositories";

export function toPersistedPremiumEntitlement(
  entitlement: PremiumEntitlement
): PersistedPremiumEntitlement {
  return {
    id: entitlement.id,
    planId: entitlement.planId,
    status: entitlement.status,
    activatedAt: entitlement.activatedAt,
    expiresAt: entitlement.expiresAt,
    lastValidatedAt: entitlement.lastValidatedAt,
    source: entitlement.source
  };
}

export function toDomainPremiumEntitlement(
  persistedEntitlement: PersistedPremiumEntitlement
): PremiumEntitlement {
  return {
    id: persistedEntitlement.id,
    planId: persistedEntitlement.planId,
    status: persistedEntitlement.status,
    activatedAt: persistedEntitlement.activatedAt,
    expiresAt: persistedEntitlement.expiresAt,
    lastValidatedAt: persistedEntitlement.lastValidatedAt,
    source: persistedEntitlement.source
  };
}

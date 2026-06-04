import { domainFailure, domainSuccess, type DomainResult } from "../domainResult";
import type { CategoryId } from "../moments";
import type { PrivacyLevel } from "../privacy";
import type { InsightTriggerType } from "./insightTemplateRegistry";

export type InsightId = string;
export type InsightPrivacyLevel = PrivacyLevel;

export type InsightCandidate = Readonly<{
  id: InsightId;
  triggerType: InsightTriggerType;
  categoryId: CategoryId;
  privacyLevel: InsightPrivacyLevel;
  priority: number;
}>;

export function validateInsightCandidate(
  candidate: InsightCandidate
): DomainResult<InsightCandidate> {
  if (candidate.priority < 0) {
    return domainFailure("DOMAIN_VALIDATION_FAILED", "Insight candidate priority is invalid.");
  }

  return domainSuccess(candidate);
}

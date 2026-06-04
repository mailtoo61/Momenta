import { domainFailure, domainSuccess, type DomainResult } from "../domainResult";
import type { Moment } from "../moments/momentModel";
import type { PrivacyLevel } from "../privacy";

export type WidgetSnapshotId = string;
export type WidgetSnapshotType = "timeline-summary" | "upcoming-moment" | "single-moment";
export type WidgetSnapshotPrivacyMode = "standard" | "hide-sensitive" | "allow-sensitive";
export type WidgetSnapshotPayload = Readonly<Record<string, string | number | boolean | null>>;

export type WidgetSnapshotDomainModel = Readonly<{
  id: WidgetSnapshotId;
  widgetId: string;
  type: WidgetSnapshotType;
  snapshotVersion: string;
  generatedAt: string;
  payload: WidgetSnapshotPayload;
  privacyLevel: PrivacyLevel;
  privacyMode: WidgetSnapshotPrivacyMode;
}>;

export function validateWidgetSnapshotPayload(
  payload: WidgetSnapshotPayload
): DomainResult<WidgetSnapshotPayload> {
  if (Object.keys(payload).length === 0) {
    return domainFailure("DOMAIN_VALIDATION_FAILED", "Widget snapshot payload is empty.");
  }

  return domainSuccess(payload);
}

export function canMomentAppearInWidget(
  moment: Pick<Moment, "isArchived" | "isDeleted" | "privacyLevel" | "widgetEligible">,
  widgetPrivacyMode: WidgetSnapshotPrivacyMode
): boolean {
  if (moment.isArchived || moment.isDeleted || !moment.widgetEligible) {
    return false;
  }

  if (moment.privacyLevel === "sensitive") {
    return widgetPrivacyMode === "allow-sensitive";
  }

  return true;
}

import { domainFailure, domainSuccess, type DomainResult } from "../domainResult";
import { settingsRegistry, type SettingsSectionId } from "./settingsRegistry";

export type SettingKey = string;
export type SettingValue = string | number | boolean | null;

export function validateSettingValue(value: SettingValue): DomainResult<SettingValue> {
  if (typeof value === "string" && value.trim().length === 0) {
    return domainFailure("DOMAIN_VALIDATION_FAILED", "Setting value cannot be an empty string.");
  }

  return domainSuccess(value);
}

export function validateSettingSection(sectionId: string): DomainResult<SettingsSectionId> {
  const section = settingsRegistry.find((item) => item.id === sectionId);

  if (!section) {
    return domainFailure("DOMAIN_VALIDATION_FAILED", "Settings section does not exist.");
  }

  return domainSuccess(section.id);
}

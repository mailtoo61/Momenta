import type { SettingKey, SettingValue } from "../../domain/settings";
import type { PersistedAppSetting } from "../repositories";

export type DomainSetting = Readonly<{
  key: SettingKey;
  value: SettingValue;
  updatedAt: string;
}>;

export function toPersistedAppSetting(
  key: SettingKey,
  value: SettingValue,
  updatedAt: string
): PersistedAppSetting {
  return {
    id: key,
    settingKey: key,
    settingValue: JSON.stringify(value),
    updatedAt
  };
}

export function toDomainSetting(persistedSetting: PersistedAppSetting): DomainSetting {
  return {
    key: persistedSetting.settingKey,
    value: JSON.parse(persistedSetting.settingValue) as SettingValue,
    updatedAt: persistedSetting.updatedAt
  };
}

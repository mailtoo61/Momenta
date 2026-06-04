export const SETTINGS_SECTION_IDS = [
  "appearance",
  "language",
  "notifications",
  "widgets",
  "privacy",
  "data",
  "premium",
  "about"
] as const;

export type SettingsSectionId = (typeof SETTINGS_SECTION_IDS)[number];
export type SettingsSectionVisibility = "visible" | "development-only" | "hidden";
export type SettingsRouteName = "settings" | "paywall";
export type SettingsRoutePath = "/settings" | "/paywall";

export type SettingsSection = Readonly<{
  id: SettingsSectionId;
  labelKey: string;
  descriptionKey: string;
  routeName: SettingsRouteName;
  routePath: SettingsRoutePath;
  visibility: SettingsSectionVisibility;
}>;

export const settingsRegistry = [
  {
    id: "appearance",
    labelKey: "settingsSections.appearance.label",
    descriptionKey: "settingsSections.appearance.description",
    routeName: "settings",
    routePath: "/settings",
    visibility: "visible"
  },
  {
    id: "language",
    labelKey: "settingsSections.language.label",
    descriptionKey: "settingsSections.language.description",
    routeName: "settings",
    routePath: "/settings",
    visibility: "visible"
  },
  {
    id: "notifications",
    labelKey: "settingsSections.notifications.label",
    descriptionKey: "settingsSections.notifications.description",
    routeName: "settings",
    routePath: "/settings",
    visibility: "visible"
  },
  {
    id: "widgets",
    labelKey: "settingsSections.widgets.label",
    descriptionKey: "settingsSections.widgets.description",
    routeName: "settings",
    routePath: "/settings",
    visibility: "visible"
  },
  {
    id: "privacy",
    labelKey: "settingsSections.privacy.label",
    descriptionKey: "settingsSections.privacy.description",
    routeName: "settings",
    routePath: "/settings",
    visibility: "visible"
  },
  {
    id: "data",
    labelKey: "settingsSections.data.label",
    descriptionKey: "settingsSections.data.description",
    routeName: "settings",
    routePath: "/settings",
    visibility: "visible"
  },
  {
    id: "premium",
    labelKey: "settingsSections.premium.label",
    descriptionKey: "settingsSections.premium.description",
    routeName: "paywall",
    routePath: "/paywall",
    visibility: "visible"
  },
  {
    id: "about",
    labelKey: "settingsSections.about.label",
    descriptionKey: "settingsSections.about.description",
    routeName: "settings",
    routePath: "/settings",
    visibility: "visible"
  }
] as const satisfies ReadonlyArray<SettingsSection>;

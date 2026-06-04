import { settingsRegistry } from "../../domain/settings";
import { t, type TranslationKey } from "../../shared/i18n";
import { AppScreen, AppStack } from "../../shared/ui";
import { ScreenHeader, SettingsSectionRow } from "../shared";

export function SettingsScreen() {
  return (
    <AppScreen accessibilityLabel={t("settings.title")}>
      <AppStack gap="lg">
        <ScreenHeader subtitleKey="settings.shellSubtitle" titleKey="settings.title" />
        <AppStack gap="md">
          {settingsRegistry
            .filter((section) => section.visibility === "visible")
            .map((section) => (
              <SettingsSectionRow
                descriptionKey={section.descriptionKey as TranslationKey}
                key={section.id}
                labelKey={section.labelKey as TranslationKey}
              />
            ))}
        </AppStack>
      </AppStack>
    </AppScreen>
  );
}

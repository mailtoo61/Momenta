import { t, type TranslationKey } from "../../shared/i18n";
import { AppCard, AppStack, AppText } from "../../shared/ui";

export type SettingsSectionRowProps = {
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
};

export function SettingsSectionRow({ labelKey, descriptionKey }: SettingsSectionRowProps) {
  return (
    <AppCard accessible accessibilityRole="summary" accessibilityLabel={t(labelKey)}>
      <AppStack gap="xs">
        <AppText variant="title">{t(labelKey)}</AppText>
        <AppText tone="secondary">{t(descriptionKey)}</AppText>
      </AppStack>
    </AppCard>
  );
}

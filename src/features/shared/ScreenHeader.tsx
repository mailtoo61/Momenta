import { t, type TranslationKey } from "../../shared/i18n";
import { AppStack, AppText } from "../../shared/ui";

export type ScreenHeaderProps = {
  titleKey: TranslationKey;
  subtitleKey?: TranslationKey;
};

export function ScreenHeader({ titleKey, subtitleKey }: ScreenHeaderProps) {
  return (
    <AppStack gap="sm">
      <AppText accessibilityRole="header" variant="headline">
        {t(titleKey)}
      </AppText>
      {subtitleKey ? <AppText tone="secondary">{t(subtitleKey)}</AppText> : null}
    </AppStack>
  );
}

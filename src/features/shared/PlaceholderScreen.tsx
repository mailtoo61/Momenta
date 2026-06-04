import { t, type TranslationKey } from "../../shared/i18n";
import { AppCard, AppScreen, AppStack, AppText } from "../../shared/ui";

export type PlaceholderScreenProps = {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
};

export function PlaceholderScreen({ titleKey, descriptionKey }: PlaceholderScreenProps) {
  return (
    <AppScreen centered>
      <AppCard accessibilityRole="summary">
        <AppStack align="center" gap="sm">
          <AppText align="center" variant="title">
            {t(titleKey)}
          </AppText>
          <AppText align="center" tone="secondary">
            {t(descriptionKey)}
          </AppText>
        </AppStack>
      </AppCard>
    </AppScreen>
  );
}

import { t, type TranslationKey } from "../../shared/i18n";
import { AppCard, AppStack, AppText } from "../../shared/ui";

export type ValueCardProps = {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
};

export function ValueCard({ titleKey, descriptionKey }: ValueCardProps) {
  return (
    <AppCard accessible accessibilityRole="summary" accessibilityLabel={t(titleKey)}>
      <AppStack gap="xs">
        <AppText variant="title">{t(titleKey)}</AppText>
        <AppText tone="secondary">{t(descriptionKey)}</AppText>
      </AppStack>
    </AppCard>
  );
}

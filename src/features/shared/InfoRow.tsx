import { t, type TranslationKey } from "../../shared/i18n";
import { AppCard, AppStack, AppText } from "../../shared/ui";

export type InfoRowProps = {
  labelKey: TranslationKey;
  value: string;
};

export function InfoRow({ labelKey, value }: InfoRowProps) {
  return (
    <AppCard accessible accessibilityRole="text" accessibilityLabel={t(labelKey)}>
      <AppStack gap="xs">
        <AppText tone="secondary" variant="caption">
          {t(labelKey)}
        </AppText>
        <AppText variant="body">{value}</AppText>
      </AppStack>
    </AppCard>
  );
}

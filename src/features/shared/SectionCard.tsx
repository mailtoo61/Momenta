import type { ReactNode } from "react";

import { t, type TranslationKey } from "../../shared/i18n";
import { AppCard, AppStack, AppText } from "../../shared/ui";

export type SectionCardProps = {
  titleKey: TranslationKey;
  descriptionKey?: TranslationKey;
  children?: ReactNode;
};

export function SectionCard({ titleKey, descriptionKey, children }: SectionCardProps) {
  return (
    <AppCard accessibilityRole="summary">
      <AppStack gap="md">
        <AppStack gap="xs">
          <AppText accessibilityRole="header" variant="title">
            {t(titleKey)}
          </AppText>
          {descriptionKey ? <AppText tone="secondary">{t(descriptionKey)}</AppText> : null}
        </AppStack>
        {children}
      </AppStack>
    </AppCard>
  );
}

import { t, type TranslationKey } from "../../shared/i18n";
import { AppBadge } from "../../shared/ui";
import { SectionCard } from "./SectionCard";

export type PlaceholderSectionProps = {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  badgeKey?: TranslationKey;
};

export function PlaceholderSection({
  titleKey,
  descriptionKey,
  badgeKey = "common.placeholder"
}: PlaceholderSectionProps) {
  return (
    <SectionCard descriptionKey={descriptionKey} titleKey={titleKey}>
      <AppBadge label={t(badgeKey)} tone="neutral" />
    </SectionCard>
  );
}

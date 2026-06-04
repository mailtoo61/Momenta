import { t } from "../../../shared/i18n";
import { AppCard, AppStack, AppText } from "../../../shared/ui";
import type { MomentListItemViewModel } from "../viewModels";
import { MomentStatusBadge } from "./MomentStatusBadge";
import { MomentTimeSummary } from "./MomentTimeSummary";

export type MomentListItemProps = {
  moment: MomentListItemViewModel;
};

export function MomentListItem({ moment }: MomentListItemProps) {
  return (
    <AppCard
      accessible
      accessibilityLabel={t(moment.accessibilityLabelKey)}
      accessibilityRole="summary"
    >
      <AppStack gap="sm">
        <AppText variant="title">{moment.title}</AppText>
        <AppText tone="secondary" variant="caption">
          {t(moment.categoryLabelKey)}
        </AppText>
        <MomentStatusBadge moment={moment} />
        <MomentTimeSummary moment={moment} />
      </AppStack>
    </AppCard>
  );
}

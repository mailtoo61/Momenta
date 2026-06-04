import { t } from "../../../shared/i18n";
import { AppText } from "../../../shared/ui";
import type { MomentListItemViewModel } from "../viewModels";

export type MomentTimeSummaryProps = {
  moment: MomentListItemViewModel;
};

export function MomentTimeSummary({ moment }: MomentTimeSummaryProps) {
  const value = moment.timeValue === null ? t("debug.unavailable") : String(moment.timeValue);

  return (
    <AppText tone="secondary" variant="caption">
      {t(moment.timeSummaryLabelKey)}: {value}
    </AppText>
  );
}

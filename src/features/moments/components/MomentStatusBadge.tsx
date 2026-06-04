import { t } from "../../../shared/i18n";
import { AppBadge } from "../../../shared/ui";
import type { MomentListItemViewModel } from "../viewModels";

export type MomentStatusBadgeProps = {
  moment: MomentListItemViewModel;
};

export function MomentStatusBadge({ moment }: MomentStatusBadgeProps) {
  return <AppBadge label={t(moment.statusLabelKey)} tone={moment.statusTone} />;
}

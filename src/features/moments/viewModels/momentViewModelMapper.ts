import type { Moment, MomentCategory } from "../../../domain/moments";
import { categoryRegistry } from "../../../domain/moments";
import type { TranslationKey } from "../../../shared/i18n";
import type { AppBadgeTone } from "../../../shared/ui";
import type {
  MomentListItemViewModel,
  MomentPresentationStatus,
  OverdueMomentViewModel,
  RecentMomentViewModel,
  UpcomingMomentViewModel
} from "./momentViewModels";

export type MomentViewModelMapperInput = Readonly<{
  moment: Moment;
  category?: MomentCategory;
  status: MomentPresentationStatus;
  elapsedDays?: number;
  countdownDays?: number;
}>;

export function mapMomentToListItemViewModel(
  input: MomentViewModelMapperInput
): MomentListItemViewModel {
  const category = input.category ?? resolveCategory(input.moment.categoryId);

  return {
    id: input.moment.id,
    title: input.moment.title,
    categoryLabelKey: category.labelKey as TranslationKey,
    categoryColor: category.semanticColor,
    status: input.status,
    statusLabelKey: statusLabelKeys[input.status],
    statusTone: statusTones[input.status],
    timeSummaryLabelKey: timeSummaryLabelKeys[input.status],
    timeValue: resolveTimeValue(input),
    accessibilityLabelKey: accessibilityLabelKeys[input.status],
    widgetEligible: input.moment.widgetEligible
  };
}

export function mapMomentToUpcomingViewModel(
  input: Omit<MomentViewModelMapperInput, "status">
): UpcomingMomentViewModel {
  return {
    ...mapMomentToListItemViewModel({ ...input, status: "upcoming" }),
    status: "upcoming"
  };
}

export function mapMomentToOverdueViewModel(
  input: Omit<MomentViewModelMapperInput, "status">
): OverdueMomentViewModel {
  return {
    ...mapMomentToListItemViewModel({ ...input, status: "overdue" }),
    status: "overdue"
  };
}

export function mapMomentToRecentViewModel(
  input: Omit<MomentViewModelMapperInput, "status">
): RecentMomentViewModel {
  return {
    ...mapMomentToListItemViewModel({ ...input, status: "recent" }),
    status: "recent"
  };
}

function resolveCategory(categoryId: string): MomentCategory {
  return categoryRegistry.find((category) => category.id === categoryId) ?? categoryRegistry[7];
}

function resolveTimeValue(input: MomentViewModelMapperInput): number | null {
  if (input.status === "recent") {
    return input.elapsedDays ?? null;
  }

  return input.countdownDays ?? null;
}

const statusLabelKeys: Record<MomentPresentationStatus, TranslationKey> = {
  overdue: "momentPresentation.status.overdue",
  recent: "momentPresentation.status.recent",
  upcoming: "momentPresentation.status.upcoming"
};

const statusTones: Record<MomentPresentationStatus, AppBadgeTone> = {
  overdue: "warning",
  recent: "neutral",
  upcoming: "success"
};

const timeSummaryLabelKeys: Record<MomentPresentationStatus, TranslationKey> = {
  overdue: "momentPresentation.time.overdueDays",
  recent: "momentPresentation.time.elapsedDays",
  upcoming: "momentPresentation.time.countdownDays"
};

const accessibilityLabelKeys: Record<MomentPresentationStatus, TranslationKey> = {
  overdue: "momentPresentation.accessibility.overdueItem",
  recent: "momentPresentation.accessibility.recentItem",
  upcoming: "momentPresentation.accessibility.upcomingItem"
};

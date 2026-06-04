import type { TranslationKey } from "../../../shared/i18n";
import type { SemanticColorRole } from "../../../shared/theme";
import type { AppBadgeTone } from "../../../shared/ui";

export type MomentPresentationStatus = "upcoming" | "overdue" | "recent";

export type MomentListItemViewModel = Readonly<{
  id: string;
  title: string;
  categoryLabelKey: TranslationKey;
  categoryColor: SemanticColorRole;
  status: MomentPresentationStatus;
  statusLabelKey: TranslationKey;
  statusTone: AppBadgeTone;
  timeSummaryLabelKey: TranslationKey;
  timeValue: number | null;
  accessibilityLabelKey: TranslationKey;
  widgetEligible: boolean;
}>;

export type UpcomingMomentViewModel = MomentListItemViewModel &
  Readonly<{
    status: "upcoming";
  }>;

export type OverdueMomentViewModel = MomentListItemViewModel &
  Readonly<{
    status: "overdue";
  }>;

export type RecentMomentViewModel = MomentListItemViewModel &
  Readonly<{
    status: "recent";
  }>;

export type HomeSectionViewModel<TItem extends MomentListItemViewModel = MomentListItemViewModel> =
  Readonly<{
    id: "upcoming" | "overdue" | "recent" | "insight";
    titleKey: TranslationKey;
    descriptionKey: TranslationKey;
    emptyDescriptionKey: TranslationKey;
    items: ReadonlyArray<TItem>;
  }>;

export type HomeScreenViewModel = Readonly<{
  headerTitleKey: TranslationKey;
  headerSubtitleKey: TranslationKey;
  upcoming: HomeSectionViewModel<UpcomingMomentViewModel>;
  overdue: HomeSectionViewModel<OverdueMomentViewModel>;
  recent: HomeSectionViewModel<RecentMomentViewModel>;
  insight: HomeSectionViewModel;
  quickAction: Readonly<{
    titleKey: TranslationKey;
    descriptionKey: TranslationKey;
    actionLabelKey: TranslationKey;
  }>;
}>;

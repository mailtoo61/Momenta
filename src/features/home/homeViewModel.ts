import type { Moment } from "../../domain/moments";
import { categoryRegistry } from "../../domain/moments";
import type {
  HomeScreenViewModel,
  HomeSectionViewModel,
  MomentListItemViewModel,
  OverdueMomentViewModel,
  RecentMomentViewModel,
  UpcomingMomentViewModel
} from "../moments/viewModels";
import {
  mapMomentToOverdueViewModel,
  mapMomentToRecentViewModel,
  mapMomentToUpcomingViewModel
} from "../moments/viewModels";
export { buildHomeSectionsFromMoments } from "./homeHydrationPolicy";

export type HomeMomentReadModelInput = Readonly<{
  moment: Moment;
  status: "upcoming" | "overdue" | "recent";
  elapsedDays?: number;
  countdownDays?: number;
}>;

export type BuildHomeScreenViewModelInput = Readonly<{
  moments: ReadonlyArray<HomeMomentReadModelInput>;
}>;

export function buildHomeScreenViewModel(
  input: BuildHomeScreenViewModelInput
): HomeScreenViewModel {
  const upcomingItems: UpcomingMomentViewModel[] = [];
  const overdueItems: OverdueMomentViewModel[] = [];
  const recentItems: RecentMomentViewModel[] = [];

  for (const item of input.moments) {
    const category = categoryRegistry.find((entry) => entry.id === item.moment.categoryId);

    if (item.status === "upcoming") {
      upcomingItems.push(
        mapMomentToUpcomingViewModel({
          category,
          countdownDays: item.countdownDays,
          moment: item.moment
        })
      );
    }

    if (item.status === "overdue") {
      overdueItems.push(
        mapMomentToOverdueViewModel({
          category,
          countdownDays: item.countdownDays,
          moment: item.moment
        })
      );
    }

    if (item.status === "recent") {
      recentItems.push(
        mapMomentToRecentViewModel({
          category,
          elapsedDays: item.elapsedDays,
          moment: item.moment
        })
      );
    }
  }

  return {
    headerTitleKey: "home.title",
    headerSubtitleKey: "home.shellSubtitle",
    upcoming: createSection({
      descriptionKey: "home.upcomingDescription",
      emptyDescriptionKey: "home.upcomingEmpty",
      id: "upcoming",
      items: upcomingItems,
      titleKey: "home.upcomingTitle"
    }),
    overdue: createSection({
      descriptionKey: "home.overdueDescription",
      emptyDescriptionKey: "home.overdueEmpty",
      id: "overdue",
      items: overdueItems,
      titleKey: "home.overdueTitle"
    }),
    recent: createSection({
      descriptionKey: "home.recentDescription",
      emptyDescriptionKey: "home.recentEmpty",
      id: "recent",
      items: recentItems,
      titleKey: "home.recentTitle"
    }),
    insight: createSection({
      descriptionKey: "home.insightDescription",
      emptyDescriptionKey: "home.insightEmpty",
      id: "insight",
      items: [],
      titleKey: "home.insightTitle"
    }),
    quickAction: {
      actionLabelKey: "home.quickAddAction",
      descriptionKey: "home.quickAddDescription",
      titleKey: "home.quickAddTitle"
    }
  };
}

function createSection<TItem extends MomentListItemViewModel>(
  section: HomeSectionViewModel<TItem>
): HomeSectionViewModel<TItem> {
  return section;
}

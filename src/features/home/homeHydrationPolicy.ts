import type { Moment } from "../../domain/moments";
import { getCountdownDays, getElapsedDays, isPast } from "../../domain/time";
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

export const HOME_SECTION_LIMITS = {
  maxInsightPlaceholders: 1,
  maxOverdueItems: 3,
  maxRecentItems: 5,
  maxUpcomingItems: 3
} as const;

export type HomeSectionLimits = Readonly<{
  maxInsightPlaceholders: number;
  maxOverdueItems: number;
  maxRecentItems: number;
  maxUpcomingItems: number;
}>;

export type HomeHydrationSignal = Readonly<{
  status: "upcoming" | "overdue" | "recent";
  elapsedDays?: number;
  countdownDays?: number;
}>;

export type BuildHomeSectionsFromMomentsInput = Readonly<{
  moments: ReadonlyArray<Moment>;
  nowIso: string;
  sectionLimits?: Partial<HomeSectionLimits>;
  momentSignals?: Readonly<Record<string, HomeHydrationSignal>>;
}>;

type ClassifiedHomeMoments = Readonly<{
  overdue: ReadonlyArray<OverdueMomentViewModel>;
  upcoming: ReadonlyArray<UpcomingMomentViewModel>;
  recent: ReadonlyArray<RecentMomentViewModel>;
}>;

export function buildHomeSectionsFromMoments(
  input: BuildHomeSectionsFromMomentsInput
): HomeScreenViewModel {
  const limits = {
    ...HOME_SECTION_LIMITS,
    ...input.sectionLimits
  };
  const nowDate = new Date(input.nowIso);
  const activeMoments = input.moments
    .filter((moment) => !moment.isArchived && !moment.isDeleted)
    .sort(compareMomentsByActivity);
  const classified = classifyMoments({
    momentSignals: input.momentSignals,
    moments: activeMoments,
    nowDate
  });

  return {
    headerTitleKey: "home.title",
    headerSubtitleKey: "home.shellSubtitle",
    overdue: createSection({
      descriptionKey: "home.overdueDescription",
      emptyDescriptionKey: "home.overdueEmpty",
      id: "overdue",
      items: classified.overdue.slice(0, limits.maxOverdueItems),
      titleKey: "home.overdueTitle"
    }),
    upcoming: createSection({
      descriptionKey: "home.upcomingDescription",
      emptyDescriptionKey: "home.upcomingEmpty",
      id: "upcoming",
      items: classified.upcoming.slice(0, limits.maxUpcomingItems),
      titleKey: "home.upcomingTitle"
    }),
    recent: createSection({
      descriptionKey: "home.recentDescription",
      emptyDescriptionKey: "home.recentEmpty",
      id: "recent",
      items: classified.recent.slice(0, limits.maxRecentItems),
      titleKey: "home.recentTitle"
    }),
    insight: createSection({
      descriptionKey: "home.insightDescription",
      emptyDescriptionKey: resolveInsightPlaceholderKey({
        activeMomentCount: activeMoments.length,
        overdueCount: classified.overdue.length,
        upcomingCount: classified.upcoming.length
      }),
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

function classifyMoments(input: {
  moments: ReadonlyArray<Moment>;
  nowDate: Date;
  momentSignals?: Readonly<Record<string, HomeHydrationSignal>>;
}): ClassifiedHomeMoments {
  const overdue: OverdueMomentViewModel[] = [];
  const upcoming: UpcomingMomentViewModel[] = [];
  const recent: RecentMomentViewModel[] = [];

  for (const moment of input.moments) {
    const signal =
      input.momentSignals?.[moment.id] ?? classifyMomentFromTimeSignal(moment, input.nowDate);

    if (signal.status === "overdue") {
      overdue.push(mapMomentToOverdueViewModel({ countdownDays: signal.countdownDays, moment }));
    }

    if (signal.status === "upcoming") {
      upcoming.push(mapMomentToUpcomingViewModel({ countdownDays: signal.countdownDays, moment }));
    }

    recent.push(
      mapMomentToRecentViewModel({
        elapsedDays:
          signal.elapsedDays ?? getElapsedDays(new Date(resolveActivityIso(moment)), input.nowDate),
        moment
      })
    );
  }

  return { overdue, recent, upcoming };
}

function classifyMomentFromTimeSignal(moment: Moment, nowDate: Date): HomeHydrationSignal {
  if (!moment.lastActionAt) {
    return {
      elapsedDays: getElapsedDays(new Date(resolveActivityIso(moment)), nowDate),
      status: "recent"
    };
  }

  const signalDate = new Date(moment.lastActionAt);

  if (isPast(signalDate, nowDate)) {
    return {
      countdownDays: getElapsedDays(signalDate, nowDate),
      elapsedDays: getElapsedDays(new Date(resolveActivityIso(moment)), nowDate),
      status: "overdue"
    };
  }

  return {
    countdownDays: getCountdownDays(signalDate, nowDate),
    elapsedDays: getElapsedDays(new Date(resolveActivityIso(moment)), nowDate),
    status: "upcoming"
  };
}

function compareMomentsByActivity(left: Moment, right: Moment): number {
  const rightActivity = resolveActivityIso(right);
  const leftActivity = resolveActivityIso(left);

  if (rightActivity === leftActivity) {
    return left.id.localeCompare(right.id);
  }

  return rightActivity.localeCompare(leftActivity);
}

function resolveActivityIso(moment: Moment): string {
  return moment.lastActionAt ?? moment.updatedAt ?? moment.createdAt;
}

function resolveInsightPlaceholderKey(input: {
  activeMomentCount: number;
  overdueCount: number;
  upcomingCount: number;
}): HomeSectionViewModel["emptyDescriptionKey"] {
  if (input.activeMomentCount === 0) {
    return "home.insightNoMoments";
  }

  if (input.overdueCount > 0) {
    return "home.insightOverdue";
  }

  if (input.upcomingCount > 0) {
    return "home.insightUpcoming";
  }

  return "home.insightQuiet";
}

function createSection<TItem extends MomentListItemViewModel>(
  section: HomeSectionViewModel<TItem>
): HomeSectionViewModel<TItem> {
  return section;
}

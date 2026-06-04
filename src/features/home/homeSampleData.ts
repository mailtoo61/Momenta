import type { HomeScreenViewModel } from "../moments";

export const staticHomePresentationSample: HomeScreenViewModel = {
  headerTitleKey: "home.title",
  headerSubtitleKey: "home.shellSubtitle",
  upcoming: {
    descriptionKey: "home.upcomingDescription",
    emptyDescriptionKey: "home.upcomingEmpty",
    id: "upcoming",
    items: [],
    titleKey: "home.upcomingTitle"
  },
  overdue: {
    descriptionKey: "home.overdueDescription",
    emptyDescriptionKey: "home.overdueEmpty",
    id: "overdue",
    items: [],
    titleKey: "home.overdueTitle"
  },
  recent: {
    descriptionKey: "home.recentDescription",
    emptyDescriptionKey: "home.recentEmpty",
    id: "recent",
    items: [],
    titleKey: "home.recentTitle"
  },
  insight: {
    descriptionKey: "home.insightDescription",
    emptyDescriptionKey: "home.insightEmpty",
    id: "insight",
    items: [],
    titleKey: "home.insightTitle"
  },
  quickAction: {
    actionLabelKey: "home.quickAddAction",
    descriptionKey: "home.quickAddDescription",
    titleKey: "home.quickAddTitle"
  }
};

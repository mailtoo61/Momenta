import { t } from "../../shared/i18n";
import { AppButton, AppScreen, AppStack } from "../../shared/ui";
import { PlaceholderSection, ScreenHeader, SectionCard } from "../shared";

export function HomeScreen() {
  return (
    <AppScreen accessibilityLabel={t("home.title")}>
      <AppStack gap="lg">
        <ScreenHeader subtitleKey="home.shellSubtitle" titleKey="home.title" />
        <PlaceholderSection
          descriptionKey="home.upcomingDescription"
          titleKey="home.upcomingTitle"
        />
        <PlaceholderSection descriptionKey="home.overdueDescription" titleKey="home.overdueTitle" />
        <PlaceholderSection descriptionKey="home.recentDescription" titleKey="home.recentTitle" />
        <PlaceholderSection descriptionKey="home.insightDescription" titleKey="home.insightTitle" />
        <SectionCard descriptionKey="home.quickAddDescription" titleKey="home.quickAddTitle">
          <AppButton label={t("home.quickAddAction")} variant="primary" />
        </SectionCard>
      </AppStack>
    </AppScreen>
  );
}

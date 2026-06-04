import { t } from "../../shared/i18n";
import { AppButton, AppScreen, AppStack } from "../../shared/ui";
import { ScreenHeader, ValueCard } from "../shared";

export function OnboardingScreen() {
  return (
    <AppScreen accessibilityLabel={t("onboarding.title")}>
      <AppStack gap="lg">
        <ScreenHeader subtitleKey="onboarding.shellSubtitle" titleKey="onboarding.title" />
        <ValueCard
          descriptionKey="onboarding.valueMomentsDescription"
          titleKey="onboarding.valueMomentsTitle"
        />
        <ValueCard
          descriptionKey="onboarding.valueTimeDescription"
          titleKey="onboarding.valueTimeTitle"
        />
        <ValueCard
          descriptionKey="onboarding.valueWidgetsDescription"
          titleKey="onboarding.valueWidgetsTitle"
        />
        <AppButton label={t("onboarding.getStartedAction")} variant="primary" />
      </AppStack>
    </AppScreen>
  );
}

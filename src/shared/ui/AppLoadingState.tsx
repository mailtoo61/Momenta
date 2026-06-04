import { t, type TranslationKey } from "../i18n";
import { AppScreen } from "./AppScreen";
import { AppStack } from "./AppStack";
import { AppText } from "./AppText";

export type AppLoadingStateProps = {
  titleKey?: TranslationKey;
  descriptionKey?: TranslationKey;
};

export function AppLoadingState({
  titleKey = "appStates.loadingTitle",
  descriptionKey = "appStates.loadingDescription"
}: AppLoadingStateProps) {
  return (
    <AppScreen centered accessibilityRole="progressbar">
      <AppStack align="center" gap="sm">
        <AppText align="center" variant="title">
          {t(titleKey)}
        </AppText>
        <AppText align="center" tone="secondary">
          {t(descriptionKey)}
        </AppText>
      </AppStack>
    </AppScreen>
  );
}

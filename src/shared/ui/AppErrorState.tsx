import { t, type TranslationKey } from "../i18n";
import { AppButton } from "./AppButton";
import { AppScreen } from "./AppScreen";
import { AppStack } from "./AppStack";
import { AppText } from "./AppText";

export type AppErrorStateProps = {
  titleKey?: TranslationKey;
  messageKey: TranslationKey;
  retryLabelKey?: TranslationKey;
  onRetry?: () => void;
};

export function AppErrorState({
  titleKey = "appStates.errorTitle",
  messageKey,
  retryLabelKey = "common.retry",
  onRetry
}: AppErrorStateProps) {
  return (
    <AppScreen centered accessibilityRole="alert">
      <AppStack align="center" gap="lg">
        <AppStack align="center" gap="sm">
          <AppText align="center" tone="danger" variant="title">
            {t(titleKey)}
          </AppText>
          <AppText align="center" tone="secondary">
            {t(messageKey)}
          </AppText>
        </AppStack>
        {onRetry ? (
          <AppButton label={t(retryLabelKey)} onPress={onRetry} variant="secondary" />
        ) : null}
      </AppStack>
    </AppScreen>
  );
}

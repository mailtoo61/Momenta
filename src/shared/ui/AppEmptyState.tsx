import { t, type TranslationKey } from "../i18n";
import { AppButton } from "./AppButton";
import { AppScreen } from "./AppScreen";
import { AppStack } from "./AppStack";
import { AppText } from "./AppText";

export type AppEmptyStateProps = {
  titleKey?: TranslationKey;
  descriptionKey?: TranslationKey;
  actionLabelKey?: TranslationKey;
  onAction?: () => void;
};

export function AppEmptyState({
  titleKey = "appStates.emptyTitle",
  descriptionKey = "appStates.emptyDescription",
  actionLabelKey,
  onAction
}: AppEmptyStateProps) {
  return (
    <AppScreen centered>
      <AppStack align="center" gap="lg">
        <AppStack align="center" gap="sm">
          <AppText align="center" variant="title">
            {t(titleKey)}
          </AppText>
          <AppText align="center" tone="secondary">
            {t(descriptionKey)}
          </AppText>
        </AppStack>
        {actionLabelKey && onAction ? (
          <AppButton label={t(actionLabelKey)} onPress={onAction} variant="secondary" />
        ) : null}
      </AppStack>
    </AppScreen>
  );
}

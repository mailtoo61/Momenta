import {
  useFeatureFlags,
  useRuntimeEnvironment,
  useRuntimePersistenceMode,
  useRuntimeStatus
} from "../../app/runtime";
import { t } from "../../shared/i18n";
import { AppScreen, AppStack } from "../../shared/ui";
import { InfoRow, ScreenHeader } from "../shared";

export function DebugScreen() {
  const runtimeStatus = useRuntimeStatus();
  const environment = useRuntimeEnvironment();
  const persistenceMode = useRuntimePersistenceMode();
  const featureFlags = useFeatureFlags();

  return (
    <AppScreen accessibilityLabel={t("debug.title")}>
      <AppStack gap="lg">
        <ScreenHeader subtitleKey="debug.shellSubtitle" titleKey="debug.title" />
        <AppStack gap="md">
          <InfoRow labelKey="debug.runtimeStatus" value={runtimeStatus} />
          <InfoRow labelKey="debug.environment" value={environment ?? t("debug.unavailable")} />
          <InfoRow
            labelKey="debug.persistenceMode"
            value={persistenceMode ?? t("debug.unavailable")}
          />
          <InfoRow
            labelKey="debug.featureFlags"
            value={featureFlags ? summarizeFeatureFlags(featureFlags) : t("debug.unavailable")}
          />
        </AppStack>
      </AppStack>
    </AppScreen>
  );
}

function summarizeFeatureFlags(flags: Record<string, boolean>): string {
  const enabledCount = Object.values(flags).filter(Boolean).length;
  const totalCount = Object.keys(flags).length;

  return `${enabledCount}/${totalCount}`;
}

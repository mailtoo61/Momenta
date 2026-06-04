import { t } from "../../shared/i18n";
import { AppButton, AppScreen, AppStack, AppText } from "../../shared/ui";
import { MomentListItem, type HomeSectionViewModel } from "../moments";
import { ScreenHeader, SectionCard } from "../shared";
import { staticHomePresentationSample } from "./homeSampleData";

export function HomeScreen() {
  const viewModel = staticHomePresentationSample;

  return (
    <AppScreen accessibilityLabel={t(viewModel.headerTitleKey)}>
      <AppStack gap="lg">
        <ScreenHeader
          subtitleKey={viewModel.headerSubtitleKey}
          titleKey={viewModel.headerTitleKey}
        />
        <HomeMomentSection section={viewModel.upcoming} />
        <HomeMomentSection section={viewModel.overdue} />
        <HomeMomentSection section={viewModel.recent} />
        <HomeMomentSection section={viewModel.insight} />
        <SectionCard
          descriptionKey={viewModel.quickAction.descriptionKey}
          titleKey={viewModel.quickAction.titleKey}
        >
          <AppButton label={t(viewModel.quickAction.actionLabelKey)} variant="primary" />
        </SectionCard>
      </AppStack>
    </AppScreen>
  );
}

function HomeMomentSection({ section }: { section: HomeSectionViewModel }) {
  return (
    <SectionCard descriptionKey={section.descriptionKey} titleKey={section.titleKey}>
      {section.items.length > 0 ? (
        <AppStack gap="md">
          {section.items.map((moment) => (
            <MomentListItem key={moment.id} moment={moment} />
          ))}
        </AppStack>
      ) : (
        <AppText tone="secondary">{t(section.emptyDescriptionKey)}</AppText>
      )}
    </SectionCard>
  );
}

import { planRegistry } from "../../domain/monetization";
import { t, type TranslationKey } from "../../shared/i18n";
import { AppBadge, AppButton, AppScreen, AppStack } from "../../shared/ui";
import { ScreenHeader, SectionCard, ValueCard } from "../shared";

export function PaywallScreen() {
  return (
    <AppScreen accessibilityLabel={t("paywall.title")}>
      <AppStack gap="lg">
        <ScreenHeader subtitleKey="paywall.shellSubtitle" titleKey="paywall.title" />
        <SectionCard descriptionKey="paywall.plansDescription" titleKey="paywall.plansTitle">
          <AppStack gap="md">
            {planRegistry.map((plan) => (
              <ValueCard
                descriptionKey={plan.descriptionKey as TranslationKey}
                key={plan.id}
                titleKey={plan.labelKey as TranslationKey}
              />
            ))}
          </AppStack>
        </SectionCard>
        <SectionCard descriptionKey="paywall.valueDescription" titleKey="paywall.valueTitle">
          <AppStack gap="sm">
            <AppBadge label={t("paywall.premiumWidgets")} tone="premium" />
            <AppBadge label={t("paywall.moreMoments")} tone="success" />
            <AppBadge label={t("paywall.premiumThemes")} tone="premium" />
            <AppBadge label={t("paywall.futureSyncReady")} tone="neutral" />
          </AppStack>
        </SectionCard>
        <AppButton label={t("paywall.restorePurchase")} variant="secondary" />
      </AppStack>
    </AppScreen>
  );
}

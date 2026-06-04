import { describe, expect, it } from "vitest";

import { appConfig } from "../../src/shared/config";
import { defaultFeatureFlags } from "../../src/shared/featureFlags";
import { t } from "../../src/shared/i18n";

describe("phase 1 foundation contracts", () => {
  it("keeps global app configuration centralized", () => {
    expect(appConfig.appName).toBe("Momenta");
    expect(appConfig.defaultLocale).toBe("tr");
    expect(appConfig.fallbackLocale).toBe("en");
  });

  it("keeps initial feature flags centrally typed", () => {
    expect(defaultFeatureFlags.futureAiEnabled).toBe(false);
    expect(defaultFeatureFlags.cloudSyncEnabled).toBe(false);
  });

  it("resolves localized copy through i18n resources", () => {
    expect(t("common.appName", "en")).toBe("Momenta");
  });
});

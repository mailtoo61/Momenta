import { describe, expect, it } from "vitest";

import { createProviderRegistry, isProviderDisabled } from "../../src/platform/providerRegistry";

describe("provider registry contract", () => {
  it("centralizes replaceable no-op providers", async () => {
    const registry = createProviderRegistry();

    await expect(registry.analyticsProvider.track("contract_checked")).resolves.toBeUndefined();
    await expect(
      registry.crashProvider.captureError(new Error("contract"))
    ).resolves.toBeUndefined();
    await expect(registry.billingProvider.getEntitlement()).resolves.toEqual({ status: "none" });
    await expect(registry.notificationProvider.getPermissionStatus()).resolves.toBe("unknown");
    await expect(registry.widgetProvider.getWidgetCapabilities()).resolves.toEqual({
      supportsHomeScreenWidgets: false,
      supportsLockScreenWidgets: false
    });
  });

  it("keeps provider kill switches centralized", () => {
    const registry = createProviderRegistry();

    expect(isProviderDisabled(registry.sdkKillSwitches, "analytics")).toBe(true);
    expect(registry.sdkHealth.analytics.status).toBe("disabled");
  });
});

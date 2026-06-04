import { describe, expect, it } from "vitest";

import { appRoutes } from "../../src/app/navigation";

describe("navigation contract", () => {
  it("keeps current skeleton routes centralized", () => {
    expect(appRoutes).toEqual({
      home: "/",
      onboarding: "/onboarding",
      settings: "/settings",
      paywall: "/paywall",
      debug: "/debug"
    });
  });
});

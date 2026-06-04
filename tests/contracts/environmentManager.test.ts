import { describe, expect, it } from "vitest";

import { createEnvironmentManager, resolveEnvironment } from "../../src/shared/config";

describe("environment manager contract", () => {
  it("resolves supported environments", () => {
    expect(resolveEnvironment("development")).toBe("development");
    expect(resolveEnvironment("preview")).toBe("preview");
    expect(resolveEnvironment("production")).toBe("production");
  });

  it("falls back to development for unknown environment values", () => {
    expect(resolveEnvironment("staging")).toBe("development");
  });

  it("exposes environment helpers from one manager", () => {
    const manager = createEnvironmentManager("preview");

    expect(manager.current).toBe("preview");
    expect(manager.isDevelopment()).toBe(false);
    expect(manager.isPreview()).toBe(true);
    expect(manager.isProduction()).toBe(false);
  });
});

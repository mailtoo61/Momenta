import { describe, expect, it } from "vitest";

import { getCountdownDays, getElapsedDays, isPast, toIsoString } from "../../src/domain/time";

describe("time engine contract", () => {
  it("formats dates as ISO strings", () => {
    expect(toIsoString(new Date("2026-06-04T00:00:00.000Z"))).toBe("2026-06-04T00:00:00.000Z");
  });

  it("calculates elapsed days without negative values", () => {
    const from = new Date("2026-06-01T00:00:00.000Z");
    const to = new Date("2026-06-04T00:00:00.000Z");

    expect(getElapsedDays(from, to)).toBe(3);
    expect(getElapsedDays(to, from)).toBe(0);
  });

  it("calculates countdown days without negative values", () => {
    const from = new Date("2026-06-01T12:00:00.000Z");
    const to = new Date("2026-06-04T00:00:00.000Z");

    expect(getCountdownDays(to, from)).toBe(3);
    expect(getCountdownDays(from, to)).toBe(0);
  });

  it("checks whether a date is in the past", () => {
    expect(isPast(new Date("2026-06-03T00:00:00.000Z"), new Date("2026-06-04T00:00:00.000Z"))).toBe(
      true
    );
  });
});

export type AnalyticsEventPayload = Readonly<Record<string, string | number | boolean | null>>;

export type AnalyticsProvider = {
  track: (eventName: string, payload?: AnalyticsEventPayload) => Promise<void>;
  identify?: (anonymousId: string) => Promise<void>;
  flush?: () => Promise<void>;
};

export const noopAnalyticsProvider: AnalyticsProvider = {
  track: async () => undefined,
  identify: async () => undefined,
  flush: async () => undefined
};

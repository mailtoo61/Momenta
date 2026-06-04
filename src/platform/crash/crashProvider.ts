export type CrashContext = Readonly<Record<string, string | number | boolean | null>>;

export type AnonymousCrashUser = Readonly<{
  anonymousId: string;
}>;

export type CrashProvider = {
  captureError: (error: unknown, context?: CrashContext) => Promise<void>;
  setContext?: (context: CrashContext) => Promise<void>;
  setUser?: (anonymousUser: AnonymousCrashUser) => Promise<void>;
};

export const noopCrashProvider: CrashProvider = {
  captureError: async () => undefined,
  setContext: async () => undefined,
  setUser: async () => undefined
};

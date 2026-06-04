export type WidgetCapabilities = Readonly<{
  supportsHomeScreenWidgets: boolean;
  supportsLockScreenWidgets: boolean;
}>;

export type WidgetProvider = {
  refreshWidgets: () => Promise<void>;
  refreshWidget: (id: string) => Promise<void>;
  getWidgetCapabilities: () => Promise<WidgetCapabilities>;
};

export const noopWidgetProvider: WidgetProvider = {
  refreshWidgets: async () => undefined,
  refreshWidget: async () => undefined,
  getWidgetCapabilities: async () => ({
    supportsHomeScreenWidgets: false,
    supportsLockScreenWidgets: false
  })
};

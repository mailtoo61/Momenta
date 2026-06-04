export type HapticFeedbackType = "success" | "warning" | "error" | "selection";

export type HapticsProvider = Readonly<Record<HapticFeedbackType, () => Promise<void>>>;

const noopHapticsProvider: HapticsProvider = {
  success: async () => undefined,
  warning: async () => undefined,
  error: async () => undefined,
  selection: async () => undefined
};

let activeProvider: HapticsProvider = noopHapticsProvider;

export function setHapticsProvider(provider: HapticsProvider): void {
  activeProvider = provider;
}

export const haptics: HapticsProvider = {
  success: () => activeProvider.success(),
  warning: () => activeProvider.warning(),
  error: () => activeProvider.error(),
  selection: () => activeProvider.selection()
};

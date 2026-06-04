export const touchTarget = {
  minimumSize: 44,
  comfortableSize: 48
} as const;

export function createAccessibilityLabel(parts: ReadonlyArray<string | undefined | null>): string {
  return parts.filter(Boolean).join(", ");
}

export function shouldReduceMotion(isReduceMotionEnabled: boolean): boolean {
  return isReduceMotionEnabled;
}

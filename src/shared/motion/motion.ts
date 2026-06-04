export const motionDurations = {
  instant: 0,
  fast: 120,
  normal: 220,
  slow: 360
} as const;

export const motionEasing = {
  standard: "standard",
  emphasized: "emphasized",
  linear: "linear"
} as const;

export type MotionDuration = keyof typeof motionDurations;
export type MotionEasing = keyof typeof motionEasing;

export function resolveMotionDuration(
  duration: MotionDuration,
  isReduceMotionEnabled: boolean
): number {
  return isReduceMotionEnabled ? motionDurations.instant : motionDurations[duration];
}

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  round: 999
} as const;

export type RadiusToken = keyof typeof radius;

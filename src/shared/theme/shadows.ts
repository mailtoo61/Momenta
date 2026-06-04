export const shadows = {
  none: {
    opacity: 0,
    radius: 0,
    offsetX: 0,
    offsetY: 0,
    elevation: 0
  },
  card: {
    opacity: 0.12,
    radius: 10,
    offsetX: 0,
    offsetY: 4,
    elevation: 2
  }
} as const;

export type ShadowToken = keyof typeof shadows;

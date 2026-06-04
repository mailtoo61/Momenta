export const typography = {
  family: {
    system: "System"
  },
  size: {
    caption: 12,
    body: 16,
    title: 22,
    headline: 28
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700"
  },
  lineHeight: {
    caption: 16,
    body: 22,
    title: 28,
    headline: 34
  }
} as const;

export type Typography = typeof typography;

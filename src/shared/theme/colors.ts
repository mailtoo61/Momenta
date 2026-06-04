export const colors = {
  neutral0: "#FFFFFF",
  neutral50: "#F7F7F2",
  neutral100: "#ECECE5",
  neutral300: "#C9CAC1",
  neutral500: "#7A7D72",
  neutral700: "#3F463B",
  neutral900: "#171B16",
  meadow500: "#2F7D59",
  meadow700: "#1F5F43",
  sun500: "#C98A1D",
  rose500: "#C84F5E",
  sky500: "#3A79B8"
} as const;

export type ColorToken = keyof typeof colors;

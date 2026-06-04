import { colors } from "./colors";

export type SemanticColorRole =
  | "background"
  | "surface"
  | "textPrimary"
  | "textSecondary"
  | "border"
  | "accent"
  | "accentStrong"
  | "family"
  | "health"
  | "vehicle"
  | "home"
  | "finance"
  | "pet"
  | "self"
  | "custom"
  | "warning"
  | "success"
  | "danger"
  | "info"
  | "muted"
  | "premium";

export type SemanticColors = Readonly<Record<SemanticColorRole, string>>;

export const lightSemanticColors: SemanticColors = {
  background: colors.neutral0,
  surface: colors.neutral50,
  textPrimary: colors.neutral900,
  textSecondary: colors.neutral700,
  border: colors.neutral100,
  accent: colors.meadow500,
  accentStrong: colors.meadow700,
  family: colors.rose500,
  health: colors.meadow500,
  vehicle: colors.sky500,
  home: colors.sun500,
  finance: colors.meadow700,
  pet: colors.rose500,
  self: colors.sky500,
  custom: colors.neutral500,
  warning: colors.sun500,
  success: colors.meadow500,
  danger: colors.rose500,
  info: colors.sky500,
  muted: colors.neutral500,
  premium: colors.sun500
} as const;

export const darkSemanticColors: SemanticColors = {
  background: colors.neutral900,
  surface: colors.neutral700,
  textPrimary: colors.neutral0,
  textSecondary: colors.neutral300,
  border: colors.neutral500,
  accent: colors.meadow500,
  accentStrong: colors.meadow700,
  family: colors.rose500,
  health: colors.meadow500,
  vehicle: colors.sky500,
  home: colors.sun500,
  finance: colors.meadow700,
  pet: colors.rose500,
  self: colors.sky500,
  custom: colors.neutral300,
  warning: colors.sun500,
  success: colors.meadow500,
  danger: colors.rose500,
  info: colors.sky500,
  muted: colors.neutral300,
  premium: colors.sun500
} as const;

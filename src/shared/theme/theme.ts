import { darkSemanticColors, lightSemanticColors, type SemanticColors } from "./semanticColors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";

export type ThemeMode = "light" | "dark" | "system";

export type AppTheme = {
  mode: Exclude<ThemeMode, "system">;
  colors: SemanticColors;
  radius: typeof radius;
  shadows: typeof shadows;
  spacing: typeof spacing;
  typography: typeof typography;
};

export const lightTheme: AppTheme = {
  mode: "light",
  colors: lightSemanticColors,
  radius,
  shadows,
  spacing,
  typography
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: darkSemanticColors,
  radius,
  shadows,
  spacing,
  typography
};

export function resolveTheme(mode: ThemeMode, systemMode: Exclude<ThemeMode, "system">): AppTheme {
  if (mode === "system") {
    return systemMode === "dark" ? darkTheme : lightTheme;
  }

  return mode === "dark" ? darkTheme : lightTheme;
}

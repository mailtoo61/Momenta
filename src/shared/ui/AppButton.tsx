import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from "react-native";

import { lightTheme } from "../theme";
import { AppText } from "./AppText";

export type AppButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";

export type AppButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  variant?: AppButtonVariant;
};

export function AppButton({
  label,
  variant = "primary",
  accessibilityLabel = label,
  accessibilityRole = "button",
  style,
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        buttonStyles[variant],
        disabled ? styles.disabled : null,
        pressed ? styles.pressed : null,
        resolvePressableStyle(style, pressed)
      ]}
      {...props}
    >
      <AppText align="center" tone={buttonTextTone[variant]} variant="body">
        {label}
      </AppText>
    </Pressable>
  );
}

function resolvePressableStyle(
  style: PressableProps["style"],
  pressed: boolean
): StyleProp<ViewStyle> {
  if (typeof style === "function") {
    return style({ pressed });
  }

  return style ?? null;
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: lightTheme.radius.md,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: lightTheme.spacing.lg,
    paddingVertical: lightTheme.spacing.md
  },
  disabled: {
    opacity: 0.5
  },
  pressed: {
    opacity: 0.78
  }
});

const buttonStyles = StyleSheet.create({
  destructive: {
    backgroundColor: lightTheme.colors.danger
  },
  primary: {
    backgroundColor: lightTheme.colors.accentStrong
  },
  secondary: {
    backgroundColor: lightTheme.colors.surface,
    borderColor: lightTheme.colors.border,
    borderWidth: 1
  },
  tertiary: {
    backgroundColor: lightTheme.colors.background
  }
});

const buttonTextTone: Record<AppButtonVariant, "primary" | "secondary" | "danger"> = {
  destructive: "primary",
  primary: "primary",
  secondary: "primary",
  tertiary: "secondary"
};

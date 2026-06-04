import { StyleSheet, View, type ViewProps } from "react-native";

import { lightTheme } from "../theme";
import { AppText } from "./AppText";

export type AppBadgeTone = "neutral" | "success" | "warning" | "danger" | "premium";

export type AppBadgeProps = ViewProps & {
  label: string;
  tone?: AppBadgeTone;
};

export function AppBadge({
  label,
  tone = "neutral",
  accessibilityLabel = label,
  style,
  ...props
}: AppBadgeProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.badge, badgeToneStyles[tone], style]}
      {...props}
    >
      <AppText variant="caption">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: lightTheme.radius.round,
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.xs
  }
});

const badgeToneStyles = StyleSheet.create({
  danger: {
    borderColor: lightTheme.colors.danger,
    borderWidth: 1
  },
  neutral: {
    borderColor: lightTheme.colors.border,
    borderWidth: 1
  },
  premium: {
    borderColor: lightTheme.colors.premium,
    borderWidth: 1
  },
  success: {
    borderColor: lightTheme.colors.success,
    borderWidth: 1
  },
  warning: {
    borderColor: lightTheme.colors.warning,
    borderWidth: 1
  }
});

import { StyleSheet, Text, type TextProps } from "react-native";

import { lightTheme } from "../theme";

export type AppTextVariant = "headline" | "title" | "body" | "caption";
export type AppTextTone = "primary" | "secondary" | "danger" | "muted";

export type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  tone?: AppTextTone;
  align?: "left" | "center" | "right";
};

export function AppText({
  variant = "body",
  tone = "primary",
  align = "left",
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[styles.base, variantStyles[variant], toneStyles[tone], { textAlign: align }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: lightTheme.colors.textPrimary
  }
});

const variantStyles = StyleSheet.create({
  body: {
    fontSize: lightTheme.typography.size.body,
    fontWeight: lightTheme.typography.weight.regular,
    lineHeight: lightTheme.typography.lineHeight.body
  },
  caption: {
    fontSize: lightTheme.typography.size.caption,
    fontWeight: lightTheme.typography.weight.medium,
    lineHeight: lightTheme.typography.lineHeight.caption
  },
  headline: {
    fontSize: lightTheme.typography.size.headline,
    fontWeight: lightTheme.typography.weight.bold,
    lineHeight: lightTheme.typography.lineHeight.headline
  },
  title: {
    fontSize: lightTheme.typography.size.title,
    fontWeight: lightTheme.typography.weight.semibold,
    lineHeight: lightTheme.typography.lineHeight.title
  }
});

const toneStyles = StyleSheet.create({
  danger: {
    color: lightTheme.colors.danger
  },
  muted: {
    color: lightTheme.colors.muted
  },
  primary: {
    color: lightTheme.colors.textPrimary
  },
  secondary: {
    color: lightTheme.colors.textSecondary
  }
});

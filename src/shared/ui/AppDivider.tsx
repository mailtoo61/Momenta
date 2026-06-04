import { StyleSheet, View, type ViewProps } from "react-native";

import { lightTheme } from "../theme";

export type AppDividerProps = ViewProps;

export function AppDivider({ style, ...props }: AppDividerProps) {
  return <View accessibilityRole="none" style={[styles.divider, style]} {...props} />;
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: lightTheme.colors.border,
    height: 1,
    width: "100%"
  }
});

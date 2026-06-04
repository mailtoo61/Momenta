import { StyleSheet, View, type ViewProps } from "react-native";

import { lightTheme, type SpacingToken } from "../theme";

export type AppStackProps = ViewProps & {
  gap?: SpacingToken;
  align?: "stretch" | "center" | "flex-start" | "flex-end";
};

export function AppStack({
  gap = "md",
  align = "stretch",
  style,
  children,
  ...props
}: AppStackProps) {
  return (
    <View
      style={[styles.stack, { alignItems: align, gap: lightTheme.spacing[gap] }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: "100%"
  }
});

import { StyleSheet, View, type ViewProps } from "react-native";

import { lightTheme } from "../theme";

export type AppCardProps = ViewProps;

export function AppCard({ style, children, ...props }: AppCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightTheme.colors.surface,
    borderColor: lightTheme.colors.border,
    borderRadius: lightTheme.radius.md,
    borderWidth: 1,
    padding: lightTheme.spacing.lg
  }
});

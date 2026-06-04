import { StyleSheet, View, type ViewProps } from "react-native";

import { lightTheme } from "../theme";

export type AppScreenProps = ViewProps & {
  centered?: boolean;
};

export function AppScreen({ centered = false, style, children, ...props }: AppScreenProps) {
  return (
    <View style={[styles.screen, centered ? styles.centered : null, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    justifyContent: "center"
  },
  screen: {
    backgroundColor: lightTheme.colors.background,
    flex: 1,
    padding: lightTheme.spacing.xl
  }
});

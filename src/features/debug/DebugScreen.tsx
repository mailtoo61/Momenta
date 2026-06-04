import { StyleSheet, Text, View } from "react-native";

import { t } from "../../shared/i18n";
import { lightTheme } from "../../shared/theme";

export function DebugScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("debug.title")}</Text>
      <Text style={styles.subtitle}>{t("debug.subtitle")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: lightTheme.colors.background,
    flex: 1,
    justifyContent: "center",
    padding: lightTheme.spacing.xl
  },
  subtitle: {
    color: lightTheme.colors.textSecondary,
    fontSize: lightTheme.typography.size.body,
    lineHeight: lightTheme.typography.lineHeight.body,
    marginTop: lightTheme.spacing.sm,
    textAlign: "center"
  },
  title: {
    color: lightTheme.colors.textPrimary,
    fontSize: lightTheme.typography.size.title,
    fontWeight: lightTheme.typography.weight.semibold,
    lineHeight: lightTheme.typography.lineHeight.title,
    textAlign: "center"
  }
});

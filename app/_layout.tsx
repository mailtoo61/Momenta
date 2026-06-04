import { Stack } from "expo-router";

import { AppProviders } from "../src/app/providers";
import { RuntimeStatusGate } from "../src/features/runtime";

export default function RootLayout() {
  return (
    <AppProviders>
      <RuntimeStatusGate>
        <Stack screenOptions={{ headerShown: false }} />
      </RuntimeStatusGate>
    </AppProviders>
  );
}

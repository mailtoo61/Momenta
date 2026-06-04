import type { ReactNode } from "react";

import { AppRuntimeProvider } from "../runtime";

export type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps): ReactNode {
  return <AppRuntimeProvider>{children}</AppRuntimeProvider>;
}

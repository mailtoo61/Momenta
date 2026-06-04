import type { ReactNode } from "react";

import { useAppRuntime, type AppRuntimeState } from "../../app/runtime";
import type { TranslationKey } from "../../shared/i18n";
import { AppErrorState, AppLoadingState } from "../../shared/ui";

export type RuntimeStatusGateProps = {
  children: ReactNode;
};

export type RuntimeStatusGateViewProps = RuntimeStatusGateProps & {
  state: AppRuntimeState;
};

export function RuntimeStatusGate({ children }: RuntimeStatusGateProps) {
  const { state } = useAppRuntime();

  return <RuntimeStatusGateView state={state}>{children}</RuntimeStatusGateView>;
}

export function RuntimeStatusGateView({ state, children }: RuntimeStatusGateViewProps) {
  if (state.status === "pending") {
    return <AppLoadingState />;
  }

  if (state.status === "failed") {
    return <AppErrorState messageKey={state.error.userMessageKey as TranslationKey} />;
  }

  return children;
}

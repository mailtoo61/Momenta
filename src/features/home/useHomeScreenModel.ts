import { useCallback, useEffect, useState } from "react";

import { useHomeReadService } from "../../app/runtime";
import { createAppError, type AppError } from "../../shared/errors";
import type { HomeScreenViewModel } from "../moments";

export type HomeScreenModelState =
  | Readonly<{
      status: "loading";
    }>
  | Readonly<{
      status: "ready";
      viewModel: HomeScreenViewModel;
    }>
  | Readonly<{
      status: "error";
      error: AppError;
      retry: () => void;
    }>;

export function useHomeScreenModel(): HomeScreenModelState {
  const homeReadService = useHomeReadService();
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<HomeScreenModelState>({
    status: "loading"
  });

  const retry = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (homeReadService === null) {
      setState({ status: "loading" });
      return () => {
        isMounted = false;
      };
    }

    setState({ status: "loading" });

    void homeReadService.getHomeViewModel().then((result) => {
      if (!isMounted) {
        return;
      }

      if (result.isSuccess) {
        setState({
          status: "ready",
          viewModel: result.value
        });
        return;
      }

      setState({
        status: "error",
        error: createAppError({
          code: "UNKNOWN_ERROR",
          developerMessage: result.error.developerMessage,
          cause: result.error
        }),
        retry
      });
    });

    return () => {
      isMounted = false;
    };
  }, [homeReadService, reloadToken, retry]);

  return state;
}

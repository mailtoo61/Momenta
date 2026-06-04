import type { MomentRepository } from "../../data/repositories";
import { toDomainMoment } from "../../data/mappers";
import type { HomeScreenViewModel } from "../../features/moments/viewModels";
import {
  buildHomeScreenViewModel,
  type BuildHomeScreenViewModelInput,
  type HomeMomentReadModelInput
} from "../../features/home/homeViewModel";
import {
  createServiceError,
  serviceFailure,
  serviceSuccess,
  type ServiceResult
} from "../serviceResult";

export type GetHomeViewModelInput = Readonly<{
  momentStates?: Readonly<Record<string, HomeMomentReadState>>;
}>;

export type HomeMomentReadState = Readonly<{
  status: "upcoming" | "overdue" | "recent";
  elapsedDays?: number;
  countdownDays?: number;
}>;

export type GetHomeViewModelResult = ServiceResult<HomeScreenViewModel>;

export type HomeReadService = Readonly<{
  getHomeViewModel: (input?: GetHomeViewModelInput) => Promise<GetHomeViewModelResult>;
}>;

export type HomeReadServiceDependencies = Readonly<{
  momentRepository: MomentRepository;
  buildHomeViewModel?: (input: BuildHomeScreenViewModelInput) => HomeScreenViewModel;
}>;

export const noopHomeReadService: HomeReadService = {
  getHomeViewModel: async () =>
    serviceSuccess(
      buildHomeScreenViewModel({
        moments: []
      })
    )
};

export function createHomeReadService(dependencies: HomeReadServiceDependencies): HomeReadService {
  const buildHomeViewModel = dependencies.buildHomeViewModel ?? buildHomeScreenViewModel;

  return {
    getHomeViewModel: async (input = {}) => {
      const momentsResult = await dependencies.momentRepository.listActive();

      if (!momentsResult.isSuccess) {
        return serviceFailure(
          createServiceError({
            code: "SERVICE_DEPENDENCY_UNAVAILABLE",
            developerMessage: momentsResult.error.developerMessage,
            cause: momentsResult.error
          })
        );
      }

      const moments = momentsResult.value.map<HomeMomentReadModelInput>((moment) => {
        const readState = input.momentStates?.[moment.id] ?? {
          status: "recent" as const
        };

        return {
          countdownDays: readState.countdownDays,
          elapsedDays: readState.elapsedDays,
          moment: toDomainMoment(moment),
          status: readState.status
        };
      });

      return serviceSuccess(
        buildHomeViewModel({
          moments
        })
      );
    }
  };
}

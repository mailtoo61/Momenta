import type { MomentRepository } from "../../data/repositories";
import { toDomainMoment } from "../../data/mappers";
import type { HomeScreenViewModel } from "../../features/moments/viewModels";
import {
  buildHomeSectionsFromMoments,
  type BuildHomeSectionsFromMomentsInput,
  type HomeHydrationSignal
} from "../../features/home/homeHydrationPolicy";
import {
  createServiceError,
  serviceFailure,
  serviceSuccess,
  type ServiceResult
} from "../serviceResult";

export type GetHomeViewModelInput = Readonly<{
  momentStates?: Readonly<Record<string, HomeHydrationSignal>>;
  nowIso?: string;
  sectionLimits?: BuildHomeSectionsFromMomentsInput["sectionLimits"];
}>;

export type HomeMomentReadState = HomeHydrationSignal;

export type GetHomeViewModelResult = ServiceResult<HomeScreenViewModel>;

export type HomeReadService = Readonly<{
  getHomeViewModel: (input?: GetHomeViewModelInput) => Promise<GetHomeViewModelResult>;
}>;

export type HomeReadServiceDependencies = Readonly<{
  momentRepository: MomentRepository;
  buildHomeViewModel?: (input: BuildHomeSectionsFromMomentsInput) => HomeScreenViewModel;
  nowIso?: () => string;
}>;

export const noopHomeReadService: HomeReadService = {
  getHomeViewModel: async () =>
    serviceSuccess(
      buildHomeSectionsFromMoments({
        moments: [],
        nowIso: new Date().toISOString()
      })
    )
};

export function createHomeReadService(dependencies: HomeReadServiceDependencies): HomeReadService {
  const buildHomeViewModel = dependencies.buildHomeViewModel ?? buildHomeSectionsFromMoments;
  const nowIso = dependencies.nowIso ?? (() => new Date().toISOString());

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

      const moments = momentsResult.value.map((moment) => toDomainMoment(moment));

      return serviceSuccess(
        buildHomeViewModel({
          momentSignals: input.momentStates,
          moments,
          nowIso: input.nowIso ?? nowIso(),
          sectionLimits: input.sectionLimits
        })
      );
    }
  };
}

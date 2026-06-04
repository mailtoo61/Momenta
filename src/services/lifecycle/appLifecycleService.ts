import { serviceSuccess, type ServiceResult } from "../serviceResult";

export type AppLifecycleService = {
  onAppStarted: () => Promise<ServiceResult<void>>;
  onAppBecameActive: () => Promise<ServiceResult<void>>;
  onAppMovedToBackground: () => Promise<ServiceResult<void>>;
  onDayChanged: () => Promise<ServiceResult<void>>;
  onTimezoneChanged: () => Promise<ServiceResult<void>>;
};

export const noopAppLifecycleService: AppLifecycleService = {
  onAppStarted: async () => serviceSuccess(undefined),
  onAppBecameActive: async () => serviceSuccess(undefined),
  onAppMovedToBackground: async () => serviceSuccess(undefined),
  onDayChanged: async () => serviceSuccess(undefined),
  onTimezoneChanged: async () => serviceSuccess(undefined)
};

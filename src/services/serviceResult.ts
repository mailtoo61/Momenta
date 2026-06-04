import { createAppError, type AppError } from "../shared/errors";

export const SERVICE_ERROR_CODES = [
  "SERVICE_UNKNOWN_ERROR",
  "SERVICE_VALIDATION_FAILED",
  "SERVICE_DEPENDENCY_UNAVAILABLE",
  "SERVICE_OPERATION_CANCELLED",
  "SERVICE_PERMISSION_DENIED",
  "SERVICE_PREMIUM_REQUIRED"
] as const;

export type ServiceErrorCode = (typeof SERVICE_ERROR_CODES)[number];

export type ServiceError = Readonly<{
  code: ServiceErrorCode;
  developerMessage: string;
  cause?: unknown;
}>;

export type ServiceSuccess<T> = Readonly<{
  isSuccess: true;
  value: T;
}>;

export type ServiceFailure = Readonly<{
  isSuccess: false;
  error: ServiceError;
}>;

export type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure;

export function serviceSuccess<T>(value: T): ServiceSuccess<T> {
  return {
    isSuccess: true,
    value
  };
}

export function serviceFailure(error: ServiceError): ServiceFailure {
  return {
    isSuccess: false,
    error
  };
}

export function createServiceError(params: {
  code: ServiceErrorCode;
  developerMessage: string;
  cause?: unknown;
}): ServiceError {
  return {
    code: params.code,
    developerMessage: params.developerMessage,
    cause: params.cause
  };
}

export function mapServiceErrorToAppError(error: ServiceError): AppError {
  const appErrorCode =
    error.code === "SERVICE_PREMIUM_REQUIRED" || error.code === "SERVICE_PERMISSION_DENIED"
      ? "FEATURE_DISABLED"
      : "UNKNOWN_ERROR";

  return createAppError({
    code: appErrorCode,
    developerMessage: error.developerMessage,
    cause: error.cause
  });
}

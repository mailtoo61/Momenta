import type { AppError, ErrorCode, ErrorSeverity } from "./errorTypes";

const errorMessageKeys: Record<ErrorCode, string> = {
  UNKNOWN_ERROR: "errors.unknown",
  CONFIG_ERROR: "errors.config",
  LOCALIZATION_ERROR: "errors.localization",
  FEATURE_DISABLED: "errors.featureDisabled",
  STORAGE_UNAVAILABLE: "errors.storageUnavailable"
};

const defaultSeverity: Record<ErrorCode, ErrorSeverity> = {
  UNKNOWN_ERROR: "recoverable",
  CONFIG_ERROR: "fatal",
  LOCALIZATION_ERROR: "recoverable",
  FEATURE_DISABLED: "info",
  STORAGE_UNAVAILABLE: "fatal"
};

export function createAppError(params: {
  code: ErrorCode;
  developerMessage: string;
  cause?: unknown;
  severity?: ErrorSeverity;
}): AppError {
  return {
    code: params.code,
    severity: params.severity ?? defaultSeverity[params.code],
    userMessageKey: errorMessageKeys[params.code],
    developerMessage: params.developerMessage,
    cause: params.cause
  };
}

export function mapUnknownError(
  error: unknown,
  developerMessage = "Unhandled application error"
): AppError {
  if (isAppError(error)) {
    return error;
  }

  return createAppError({
    code: "UNKNOWN_ERROR",
    developerMessage,
    cause: error
  });
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "severity" in error &&
    "userMessageKey" in error &&
    "developerMessage" in error
  );
}

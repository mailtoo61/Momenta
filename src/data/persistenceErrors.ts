import { createAppError, type AppError } from "../shared/errors";

export const PERSISTENCE_ERROR_CODES = [
  "DATA_UNKNOWN_ERROR",
  "DATA_REPOSITORY_UNAVAILABLE",
  "DATA_RECORD_NOT_FOUND",
  "DATA_VALIDATION_FAILED",
  "DATA_MIGRATION_FAILED",
  "DATA_IMPORT_INVALID",
  "DATA_EXPORT_FAILED"
] as const;

export type PersistenceErrorCode = (typeof PERSISTENCE_ERROR_CODES)[number];

export type PersistenceError = Readonly<{
  code: PersistenceErrorCode;
  developerMessage: string;
  cause?: unknown;
}>;

const userMessageKeyByPersistenceCode: Record<PersistenceErrorCode, string> = {
  DATA_UNKNOWN_ERROR: "errors.unknown",
  DATA_REPOSITORY_UNAVAILABLE: "errors.storageUnavailable",
  DATA_RECORD_NOT_FOUND: "errors.unknown",
  DATA_VALIDATION_FAILED: "errors.unknown",
  DATA_MIGRATION_FAILED: "errors.storageUnavailable",
  DATA_IMPORT_INVALID: "errors.storageUnavailable",
  DATA_EXPORT_FAILED: "errors.storageUnavailable"
};

export function createPersistenceError(params: {
  code: PersistenceErrorCode;
  developerMessage: string;
  cause?: unknown;
}): PersistenceError {
  return {
    code: params.code,
    developerMessage: params.developerMessage,
    cause: params.cause
  };
}

export function mapPersistenceErrorToAppError(error: PersistenceError): AppError {
  const mappedError = createAppError({
    code: error.code === "DATA_RECORD_NOT_FOUND" ? "UNKNOWN_ERROR" : "STORAGE_UNAVAILABLE",
    developerMessage: error.developerMessage,
    cause: error.cause
  });

  return {
    ...mappedError,
    userMessageKey: userMessageKeyByPersistenceCode[error.code]
  };
}

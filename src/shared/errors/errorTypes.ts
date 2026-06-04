export const ERROR_CODES = [
  "UNKNOWN_ERROR",
  "CONFIG_ERROR",
  "LOCALIZATION_ERROR",
  "FEATURE_DISABLED",
  "STORAGE_UNAVAILABLE"
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];
export type ErrorSeverity = "info" | "warning" | "recoverable" | "fatal";

export type AppError = {
  code: ErrorCode;
  severity: ErrorSeverity;
  userMessageKey: string;
  developerMessage: string;
  cause?: unknown;
};

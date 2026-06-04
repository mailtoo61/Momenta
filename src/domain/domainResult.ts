export const DOMAIN_ERROR_CODES = [
  "DOMAIN_UNKNOWN_ERROR",
  "DOMAIN_VALIDATION_FAILED",
  "DOMAIN_INVALID_CATEGORY",
  "DOMAIN_INVALID_PRIVACY_LEVEL",
  "DOMAIN_INVALID_REMINDER_RULE",
  "DOMAIN_PREMIUM_REQUIRED",
  "DOMAIN_OPERATION_NOT_ALLOWED"
] as const;

export type DomainErrorCode = (typeof DOMAIN_ERROR_CODES)[number];

export type DomainError = Readonly<{
  code: DomainErrorCode;
  developerMessage: string;
}>;

export type DomainSuccess<T> = Readonly<{
  isSuccess: true;
  value: T;
}>;

export type DomainFailure = Readonly<{
  isSuccess: false;
  error: DomainError;
}>;

export type DomainResult<T> = DomainSuccess<T> | DomainFailure;

export function domainSuccess<T>(value: T): DomainSuccess<T> {
  return {
    isSuccess: true,
    value
  };
}

export function domainFailure(code: DomainErrorCode, developerMessage: string): DomainFailure {
  return {
    isSuccess: false,
    error: {
      code,
      developerMessage
    }
  };
}

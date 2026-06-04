import { createPersistenceError, type PersistenceError } from "../persistenceErrors";

export type SqliteErrorOperation =
  | "databaseOpen"
  | "migration"
  | "query"
  | "transaction"
  | "repository";

export function normalizeSqliteError(
  operation: SqliteErrorOperation,
  cause: unknown,
  developerMessage: string
): PersistenceError {
  if (isPersistenceError(cause)) {
    return cause;
  }

  return createPersistenceError({
    code: operation === "migration" ? "DATA_MIGRATION_FAILED" : "DATA_REPOSITORY_UNAVAILABLE",
    developerMessage,
    cause
  });
}

export function isPersistenceError(value: unknown): value is PersistenceError {
  return Boolean(
    value && typeof value === "object" && "code" in value && "developerMessage" in value
  );
}

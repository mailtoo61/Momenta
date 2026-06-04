import type { PersistenceError } from "./persistenceErrors";

export type DataSuccess<T> = Readonly<{
  isSuccess: true;
  value: T;
}>;

export type DataFailure = Readonly<{
  isSuccess: false;
  error: PersistenceError;
}>;

export type DataResult<T> = DataSuccess<T> | DataFailure;

export function dataSuccess<T>(value: T): DataSuccess<T> {
  return {
    isSuccess: true,
    value
  };
}

export function dataFailure(error: PersistenceError): DataFailure {
  return {
    isSuccess: false,
    error
  };
}

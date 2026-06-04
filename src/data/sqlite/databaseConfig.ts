import { appConfig } from "../../shared/config";

export const sqliteDatabaseConfig = {
  databaseName: appConfig.storage.sqliteDatabaseName
} as const;

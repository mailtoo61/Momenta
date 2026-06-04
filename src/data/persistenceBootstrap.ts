import { environmentManager, type AppEnvironment } from "../shared/config";
import { dataFailure, type DataResult } from "./dataResult";
import type { MomentaDatabase } from "./sqlite";
import type { PersistenceMode } from "./persistenceMode";
import { resolvePersistenceMode } from "./persistenceMode";
import { resolveRepositories, type ResolvedRepositories } from "./repositories";

export type PersistenceBootstrapInput = Readonly<{
  environment?: AppEnvironment;
  modeOverride?: PersistenceMode;
  openSqliteDatabase?: () => Promise<DataResult<MomentaDatabase>>;
}>;

export async function bootstrapPersistence(
  input: PersistenceBootstrapInput = {}
): Promise<DataResult<ResolvedRepositories>> {
  const mode = resolvePersistenceMode({
    environment: input.environment ?? environmentManager.current,
    override: input.modeOverride
  });
  const result = await resolveRepositories({
    mode,
    openSqliteDatabase: input.openSqliteDatabase
  });

  if (!result.isSuccess) {
    return dataFailure(result.error);
  }

  return result;
}

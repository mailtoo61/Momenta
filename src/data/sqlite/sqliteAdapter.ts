import { openDatabaseAsync, type SQLiteDatabase, type SQLiteRunResult } from "expo-sqlite";

export type SqlitePrimitive = string | number | null;
export type SqliteParams = ReadonlyArray<SqlitePrimitive>;
export type SqliteRow = Readonly<Record<string, SqlitePrimitive>>;

export type SqliteExecuteResult = Readonly<{
  changes: number;
  lastInsertRowId: number;
}>;

export type SqliteAdapter = {
  execute: (sql: string, params?: SqliteParams) => Promise<SqliteExecuteResult>;
  query: <TRow extends SqliteRow>(
    sql: string,
    params?: SqliteParams
  ) => Promise<ReadonlyArray<TRow>>;
  transaction: <T>(work: (transactionAdapter: SqliteAdapter) => Promise<T>) => Promise<T>;
  close: () => Promise<void>;
};

export type OpenSqliteAdapterOptions = Readonly<{
  databaseName: string;
}>;

export async function openSqliteAdapter(options: OpenSqliteAdapterOptions): Promise<SqliteAdapter> {
  const database = await openDatabaseAsync(options.databaseName);
  return createExpoSqliteAdapter(database);
}

function createExpoSqliteAdapter(database: SQLiteDatabase): SqliteAdapter {
  return {
    execute: async (sql, params = []) => {
      if (params.length === 0 && containsMultipleStatements(sql)) {
        await database.execAsync(sql);
        return {
          changes: 0,
          lastInsertRowId: 0
        };
      }

      const result = await database.runAsync(sql, [...params]);
      return toExecuteResult(result);
    },
    query: async <TRow extends SqliteRow>(sql: string, params: SqliteParams = []) =>
      database.getAllAsync<TRow>(sql, [...params]),
    transaction: async (work) => {
      let result: Awaited<ReturnType<typeof work>> | undefined;
      let didComplete = false;
      await database.withExclusiveTransactionAsync(async (transactionDatabase) => {
        result = await work(createExpoSqliteAdapter(transactionDatabase));
        didComplete = true;
      });

      if (!didComplete) {
        throw new Error("SQLite transaction completed without a result.");
      }

      return result as Awaited<ReturnType<typeof work>>;
    },
    close: async () => {
      await database.closeAsync();
    }
  };
}

function toExecuteResult(result: SQLiteRunResult): SqliteExecuteResult {
  return {
    changes: result.changes,
    lastInsertRowId: result.lastInsertRowId
  };
}

function containsMultipleStatements(sql: string): boolean {
  return (
    sql
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean).length > 1
  );
}

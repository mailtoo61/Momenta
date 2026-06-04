import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { appBootstrap, safeAppBootstrap } from "../../src/app/bootstrap";
import {
  createPersistenceError,
  dataFailure,
  dataSuccess,
  type PersistenceBootstrapInput
} from "../../src/data";
import { createInMemoryRepositories, createSqliteRepositories } from "../../src/data/repositories";
import type { ResolvedRepositories } from "../../src/data/repositories";
import type { SqliteAdapter, SqliteRow } from "../../src/data/sqlite";

const timestamp = "2026-06-04T00:00:00.000Z";

describe("app bootstrap persistence integration", () => {
  it("succeeds with in-memory persistence mode", async () => {
    const result = await appBootstrap({
      environment: "production",
      persistenceModeOverride: "inMemory",
      persistenceBootstrap: async () => dataSuccess(resolvedRepositories("inMemory")),
      nowIso: () => timestamp
    });

    expect(result.persistenceMode).toBe("inMemory");
    expect(result.environment).toBe("production");
    expect(result.services.momentWorkflowService).toBeDefined();
    expect(result.bootstrappedAt).toBe(timestamp);
  });

  it("succeeds with SQLite persistence mode through a bootstrap-safe adapter", async () => {
    const result = await appBootstrap({
      environment: "development",
      persistenceModeOverride: "sqlite",
      persistenceBootstrap: async (input) => {
        expect(input.modeOverride).toBe("sqlite");
        return dataSuccess(resolvedRepositories("sqlite"));
      },
      nowIso: () => timestamp
    });

    expect(result.persistenceMode).toBe("sqlite");
    expect(result.repositories.repositories.momentRepository).toBeDefined();
    expect(result.services.auditService).toBeDefined();
  });

  it("fails safely when persistence fails and fallback is disabled", async () => {
    const result = await safeAppBootstrap({
      environment: "development",
      persistenceModeOverride: "sqlite",
      allowInMemoryFallbackOnPersistenceFailure: false,
      persistenceBootstrap: async () =>
        dataFailure(
          createPersistenceError({
            code: "DATA_REPOSITORY_UNAVAILABLE",
            developerMessage: "Expected persistence failure."
          })
        )
    });

    expect(result).toMatchObject({
      isSuccessful: false,
      error: { code: "STORAGE_UNAVAILABLE" },
      persistenceMode: "sqlite"
    });
  });

  it("falls back to in-memory only when fallback is enabled", async () => {
    const calls: PersistenceBootstrapInput[] = [];
    const result = await appBootstrap({
      environment: "development",
      persistenceModeOverride: "sqlite",
      allowInMemoryFallbackOnPersistenceFailure: true,
      persistenceBootstrap: async (input) => {
        calls.push(input);
        return input.modeOverride === "sqlite"
          ? dataFailure(
              createPersistenceError({
                code: "DATA_REPOSITORY_UNAVAILABLE",
                developerMessage: "Expected SQLite failure."
              })
            )
          : dataSuccess(resolvedRepositories("inMemory"));
      },
      nowIso: () => timestamp
    });

    expect(calls.map((call) => call.modeOverride)).toEqual(["sqlite", "inMemory"]);
    expect(result.persistenceMode).toBe("inMemory");
    expect(result.services.widgetSnapshotService).toBeDefined();
  });

  it("does not expose raw thrown errors across the bootstrap boundary", async () => {
    const result = await safeAppBootstrap({
      environment: "development",
      persistenceModeOverride: "sqlite",
      persistenceBootstrap: async () => {
        throw new Error("raw persistence crash");
      }
    });

    expect(result).toMatchObject({
      isSuccessful: false,
      error: {
        code: "UNKNOWN_ERROR",
        developerMessage: "Application bootstrap failed."
      }
    });
  });

  it("keeps routes and providers free of SQLite and persistence internals", async () => {
    const files = ["app/_layout.tsx", "src/app/providers/AppProviders.tsx"];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");
      const importLines = source
        .split("\n")
        .filter((line) => line.trimStart().startsWith("import"))
        .join("\n");

      expect(importLines).not.toContain("expo-sqlite");
      expect(importLines).not.toContain("data/sqlite");
      expect(importLines).not.toContain("repositories/sqlite");
      expect(importLines).not.toContain("persistenceBootstrap");
    }
  });

  it("keeps direct expo-sqlite imports isolated to the SQLite adapter", async () => {
    const files = [
      "src/app/bootstrap/appBootstrap.ts",
      "src/data/sqlite/database.ts",
      "src/data/sqlite/sqliteAdapter.ts",
      "src/data/repositories/repositoryResolver.ts"
    ];
    const importers: string[] = [];

    for (const relativePath of files) {
      const source = await readFile(join(process.cwd(), relativePath), "utf8");
      if (source.includes("expo-sqlite")) {
        importers.push(relativePath);
      }
    }

    expect(importers).toEqual(["src/data/sqlite/sqliteAdapter.ts"]);
  });
});

function resolvedRepositories(mode: "inMemory" | "sqlite"): ResolvedRepositories {
  const repositories =
    mode === "inMemory"
      ? createInMemoryRepositories()
      : createSqliteRepositories(new NoopSqliteAdapter());

  return {
    mode,
    repositories,
    close: async () => dataSuccess(undefined)
  };
}

class NoopSqliteAdapter implements SqliteAdapter {
  async execute() {
    return {
      changes: 0,
      lastInsertRowId: 0
    };
  }

  async query<TRow extends SqliteRow>(): Promise<ReadonlyArray<TRow>> {
    return [];
  }

  async transaction<T>(work: (transactionAdapter: SqliteAdapter) => Promise<T>): Promise<T> {
    return work(this);
  }

  async close() {
    return undefined;
  }
}

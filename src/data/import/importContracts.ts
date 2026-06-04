import type { ExportContract, ExportSchemaVersion } from "../export";

export type ImportIssueSeverity = "warning" | "error";
export type ImportIssueCode =
  | "unsupported-version"
  | "invalid-json"
  | "missing-field"
  | "invalid-value";

export type ImportIssue = Readonly<{
  code: ImportIssueCode;
  severity: ImportIssueSeverity;
  path: string;
  message: string;
}>;

export type ImportValidationResult =
  | Readonly<{
      isValid: true;
      issues: readonly [];
    }>
  | Readonly<{
      isValid: false;
      issues: ReadonlyArray<ImportIssue>;
    }>;

export type ImportContract = Readonly<{
  schemaVersion: ExportSchemaVersion;
  validate: (candidate: unknown) => ImportValidationResult;
  parse: (candidate: unknown) => ExportContract | null;
}>;

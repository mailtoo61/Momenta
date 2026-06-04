export const RECOVERY_ISSUE_TYPES = [
  "database-unavailable",
  "migration-failed",
  "corrupted-widget-snapshot",
  "invalid-import",
  "repository-error"
] as const;

export type RecoveryIssueType = (typeof RECOVERY_ISSUE_TYPES)[number];
export type RecoveryActionType = "retry" | "rollback-migration" | "remove-record" | "skip-import";

export type RecoveryIssue = Readonly<{
  type: RecoveryIssueType;
  message: string;
  detectedAt: string;
}>;

export type RecoveryAction = Readonly<{
  type: RecoveryActionType;
  description: string;
}>;

export type RecoveryPlan = Readonly<{
  issues: ReadonlyArray<RecoveryIssue>;
  actions: ReadonlyArray<RecoveryAction>;
}>;

export type RecoveryResult = Readonly<{
  isRecovered: boolean;
  completedAt: string;
  unresolvedIssues: ReadonlyArray<RecoveryIssue>;
}>;

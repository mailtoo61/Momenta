import type {
  AuditLogRepository,
  MomentRepository,
  PremiumEntitlementRepository,
  WidgetSnapshotRepository
} from "../data/repositories";
import type { AnalyticsProvider } from "../platform/analytics";
import type { NotificationProvider } from "../platform/notifications";
import type { WidgetProvider } from "../platform/widgets";
import type { LogContext, LogLevel } from "../shared/logger";
import type { AnalyticsService } from "./analytics";
import type { AuditService } from "./audit";

export type ServiceLogger = Readonly<{
  log: (level: LogLevel, message: string, context: LogContext) => void;
}>;

export type MomentWorkflowServiceDependencies = Readonly<{
  momentRepository: MomentRepository;
  auditService: AuditService;
  analyticsService: AnalyticsService;
  logger: ServiceLogger;
  premiumEntitlementRepository: PremiumEntitlementRepository;
}>;

export type ReminderOrchestrationServiceDependencies = Readonly<{
  momentRepository: MomentRepository;
  notificationProvider: NotificationProvider;
  auditService: AuditService;
  logger: ServiceLogger;
}>;

export type WidgetSnapshotServiceDependencies = Readonly<{
  momentRepository: MomentRepository;
  widgetSnapshotRepository: WidgetSnapshotRepository;
  widgetProvider: WidgetProvider;
  auditService: AuditService;
  logger: ServiceLogger;
}>;

export type AuditServiceDependencies = Readonly<{
  auditLogRepository: AuditLogRepository;
  logger: ServiceLogger;
}>;

export type AnalyticsServiceDependencies = Readonly<{
  analyticsProvider: AnalyticsProvider;
  logger: ServiceLogger;
}>;

import type {
  AuditLogRepository,
  MomentRepository,
  PremiumEntitlementRepository,
  SettingsRepository,
  WidgetSnapshotRepository
} from "../data/repositories";
import type { AnalyticsProvider } from "../platform/analytics";
import type { NotificationProvider } from "../platform/notifications";
import type { WidgetProvider } from "../platform/widgets";
import { noopAnalyticsProvider } from "../platform/analytics";
import { noopNotificationProvider } from "../platform/notifications";
import { noopWidgetProvider } from "../platform/widgets";
import type { LogContext, LogLevel } from "../shared/logger";
import { createAnalyticsService, type AnalyticsService } from "./analytics";
import { createAuditService, type AuditService } from "./audit";
import { createHomeReadService, type HomeReadService } from "./home";
import { createMomentWorkflowService, type MomentWorkflowService } from "./moments";
import { createReminderOrchestrationService, type ReminderOrchestrationService } from "./reminders";
import { createWidgetSnapshotService, type WidgetSnapshotService } from "./widgets";

export type ServiceContainerDependencies = Readonly<{
  repositories: ServiceContainerRepositories;
  analyticsProvider?: AnalyticsProvider;
  notificationProvider?: NotificationProvider;
  widgetProvider?: WidgetProvider;
  logger?: ServiceContainerLogger;
  idFactory?: () => string;
  nowIso?: () => string;
}>;

export type ServiceContainerRepositories = Readonly<{
  momentRepository: MomentRepository;
  settingsRepository: SettingsRepository;
  widgetSnapshotRepository: WidgetSnapshotRepository;
  auditLogRepository: AuditLogRepository;
  premiumEntitlementRepository: PremiumEntitlementRepository;
}>;

export type ServiceContainerLogger = Readonly<{
  log: (level: LogLevel, message: string, context: LogContext) => void;
}>;

export type ServiceContainer = Readonly<{
  auditService: AuditService;
  analyticsService: AnalyticsService;
  homeReadService: HomeReadService;
  momentWorkflowService: MomentWorkflowService;
  reminderOrchestrationService: ReminderOrchestrationService;
  widgetSnapshotService: WidgetSnapshotService;
}>;

let fallbackIdSequence = 0;

export function createServiceContainer(
  dependencies: ServiceContainerDependencies
): ServiceContainer {
  const logger = dependencies.logger ?? noopServiceLogger;
  const idFactory = dependencies.idFactory ?? (() => `service-${++fallbackIdSequence}`);
  const nowIso = dependencies.nowIso ?? (() => new Date().toISOString());

  const auditService = createAuditService(
    {
      auditLogRepository: dependencies.repositories.auditLogRepository,
      logger
    },
    {
      idFactory,
      nowIso
    }
  );
  const analyticsService = createAnalyticsService({
    analyticsProvider: dependencies.analyticsProvider ?? noopAnalyticsProvider,
    logger
  });
  const homeReadService = createHomeReadService({
    momentRepository: dependencies.repositories.momentRepository
  });
  const widgetSnapshotService = createWidgetSnapshotService({
    momentRepository: dependencies.repositories.momentRepository,
    widgetSnapshotRepository: dependencies.repositories.widgetSnapshotRepository,
    widgetProvider: dependencies.widgetProvider ?? noopWidgetProvider,
    auditService,
    logger
  });
  const reminderOrchestrationService = createReminderOrchestrationService({
    momentRepository: dependencies.repositories.momentRepository,
    notificationProvider: dependencies.notificationProvider ?? noopNotificationProvider,
    auditService,
    logger
  });
  const momentWorkflowService = createMomentWorkflowService(
    {
      momentRepository: dependencies.repositories.momentRepository,
      auditService,
      analyticsService,
      logger,
      premiumEntitlementRepository: dependencies.repositories.premiumEntitlementRepository
    },
    {
      idFactory,
      nowIso
    }
  );

  return {
    auditService,
    analyticsService,
    homeReadService,
    momentWorkflowService,
    reminderOrchestrationService,
    widgetSnapshotService
  };
}

const noopServiceLogger: ServiceContainerLogger = {
  log: () => undefined
};

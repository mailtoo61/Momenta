export type NotificationPermissionStatus = "unknown" | "granted" | "denied" | "undetermined";

export type ScheduleReminderInput = Readonly<{
  id: string;
  triggerAt: Date;
  titleKey: string;
  bodyKey: string;
}>;

export type ScheduledReminder = Readonly<{
  id: string;
  isScheduled: boolean;
}>;

export type NotificationProvider = {
  getPermissionStatus: () => Promise<NotificationPermissionStatus>;
  requestPermission: () => Promise<NotificationPermissionStatus>;
  scheduleReminder: (input: ScheduleReminderInput) => Promise<ScheduledReminder>;
  cancelReminder: (id: string) => Promise<void>;
};

export const noopNotificationProvider: NotificationProvider = {
  getPermissionStatus: async () => "unknown",
  requestPermission: async () => "undetermined",
  scheduleReminder: async (input) => ({
    id: input.id,
    isScheduled: false
  }),
  cancelReminder: async () => undefined
};

import type { PrivacyLevel } from "../privacy";
import type { ReminderRuleId } from "./reminderRuleRegistry";

export type NotificationPrivacyMode = PrivacyLevel | "redacted";

export type ReminderNotificationCopy = Readonly<{
  reminderRuleId: ReminderRuleId;
  titleKey: string;
  bodyKey: string;
  privacyMode: NotificationPrivacyMode;
}>;

export const notificationCopyRegistry = [
  {
    reminderRuleId: "today",
    titleKey: "notifications.today.title",
    bodyKey: "notifications.today.body",
    privacyMode: "private"
  },
  {
    reminderRuleId: "tomorrow",
    titleKey: "notifications.tomorrow.title",
    bodyKey: "notifications.tomorrow.body",
    privacyMode: "private"
  },
  {
    reminderRuleId: "one-week-before",
    titleKey: "notifications.oneWeekBefore.title",
    bodyKey: "notifications.oneWeekBefore.body",
    privacyMode: "private"
  },
  {
    reminderRuleId: "one-month-before",
    titleKey: "notifications.oneMonthBefore.title",
    bodyKey: "notifications.oneMonthBefore.body",
    privacyMode: "private"
  },
  {
    reminderRuleId: "overdue",
    titleKey: "notifications.overdue.title",
    bodyKey: "notifications.overdue.body",
    privacyMode: "redacted"
  },
  {
    reminderRuleId: "long-time-no-action",
    titleKey: "notifications.longTimeNoAction.title",
    bodyKey: "notifications.longTimeNoAction.body",
    privacyMode: "redacted"
  }
] as const satisfies ReadonlyArray<ReminderNotificationCopy>;

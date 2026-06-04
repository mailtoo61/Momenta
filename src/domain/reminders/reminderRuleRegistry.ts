export const REMINDER_RULE_IDS = [
  "today",
  "tomorrow",
  "one-week-before",
  "one-month-before",
  "overdue",
  "long-time-no-action"
] as const;

export type ReminderRuleId = (typeof REMINDER_RULE_IDS)[number];
export type ReminderRuleType = "same-day" | "relative-before" | "status" | "inactivity";

export type ReminderRule = Readonly<{
  id: ReminderRuleId;
  labelKey: string;
  descriptionKey: string;
  type: ReminderRuleType;
  offsetDays?: number;
  priority: number;
}>;

export const reminderRuleRegistry = [
  {
    id: "today",
    labelKey: "reminders.today.label",
    descriptionKey: "reminders.today.description",
    type: "same-day",
    offsetDays: 0,
    priority: 10
  },
  {
    id: "tomorrow",
    labelKey: "reminders.tomorrow.label",
    descriptionKey: "reminders.tomorrow.description",
    type: "relative-before",
    offsetDays: 1,
    priority: 20
  },
  {
    id: "one-week-before",
    labelKey: "reminders.oneWeekBefore.label",
    descriptionKey: "reminders.oneWeekBefore.description",
    type: "relative-before",
    offsetDays: 7,
    priority: 30
  },
  {
    id: "one-month-before",
    labelKey: "reminders.oneMonthBefore.label",
    descriptionKey: "reminders.oneMonthBefore.description",
    type: "relative-before",
    offsetDays: 30,
    priority: 40
  },
  {
    id: "overdue",
    labelKey: "reminders.overdue.label",
    descriptionKey: "reminders.overdue.description",
    type: "status",
    priority: 50
  },
  {
    id: "long-time-no-action",
    labelKey: "reminders.longTimeNoAction.label",
    descriptionKey: "reminders.longTimeNoAction.description",
    type: "inactivity",
    priority: 60
  }
] as const satisfies ReadonlyArray<ReminderRule>;

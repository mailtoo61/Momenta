const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function now(): Date {
  return new Date();
}

export function toIsoString(date: Date): string {
  return date.toISOString();
}

export function getElapsedDays(from: Date, to: Date = now()): number {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY));
}

export function getCountdownDays(to: Date, from: Date = now()): number {
  return Math.max(0, Math.ceil((to.getTime() - from.getTime()) / MS_PER_DAY));
}

export function isPast(date: Date, from: Date = now()): boolean {
  return date.getTime() < from.getTime();
}

export const PRIVACY_LEVELS = ["public", "private", "sensitive"] as const;

export type PrivacyLevel = (typeof PRIVACY_LEVELS)[number];

export function isPrivacyLevel(value: string): value is PrivacyLevel {
  return PRIVACY_LEVELS.includes(value as PrivacyLevel);
}

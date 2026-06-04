export const supportedLocales = ["tr", "en"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const fallbackLocale: SupportedLocale = "en";
export const defaultLocale: SupportedLocale = "tr";

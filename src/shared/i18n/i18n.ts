import { defaultLocale, fallbackLocale, supportedLocales, type SupportedLocale } from "./locales";
import { resources, type TranslationNamespace } from "./resources";

type NamespaceKeys<TNamespace extends TranslationNamespace> =
  keyof (typeof resources)["en"][TNamespace];
export type TranslationKey<TNamespace extends TranslationNamespace = TranslationNamespace> =
  TNamespace extends TranslationNamespace
    ? `${TNamespace}.${Extract<NamespaceKeys<TNamespace>, string>}`
    : never;

export type I18nState = {
  locale: SupportedLocale;
};

let activeLocale: SupportedLocale = defaultLocale;

export function initI18n(locale: SupportedLocale = defaultLocale): I18nState {
  activeLocale = supportedLocales.includes(locale) ? locale : fallbackLocale;
  return { locale: activeLocale };
}

export function getActiveLocale(): SupportedLocale {
  return activeLocale;
}

export function t(key: TranslationKey, locale: SupportedLocale = activeLocale): string {
  const separatorIndex = key.indexOf(".");
  const namespace = key.slice(0, separatorIndex) as TranslationNamespace;
  const valueKey = key.slice(separatorIndex + 1);
  const localizedNamespace = resources[locale][namespace];
  const fallbackNamespace = resources[fallbackLocale][namespace];

  return (
    localizedNamespace[valueKey as keyof typeof localizedNamespace] ??
    fallbackNamespace[valueKey as keyof typeof fallbackNamespace] ??
    key
  );
}

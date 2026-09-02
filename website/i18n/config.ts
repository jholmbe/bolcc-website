/**
 * Single source of truth for the locales this site supports.
 *
 * MUST stay in sync with the Sanity Studio language list at
 * `studio/schemaTypes/languages.ts`. If you add or remove a locale, update both
 * files AND the static `matcher` regex in `website/proxy.ts` (Next.js requires
 * that regex to be a literal, so it can't import this constant).
 */
export const LOCALES = ["en", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Locale tag passed to `Intl` / `toLocaleDateString`. */
export const DATE_LOCALE: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

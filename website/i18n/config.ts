/**
 * Single source of truth for the locales this site supports.
 *
 * MUST stay in sync with the Sanity Studio language list at
 * `studio/schemaTypes/languages.ts`. If you add or remove a locale, update both
 * files AND the static `matcher` regex in `website/proxy.ts` (Next.js requires
 * that regex to be a literal, so it can't import this constant).
 */
export const LOCALES = ["zh", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Simplified Chinese is the church's primary language. It is the locale used
 * when the visitor's browser language doesn't match one we support, and the
 * fallback when a Sanity field has no text in the requested locale.
 */
export const DEFAULT_LOCALE: Locale = "zh";

/** Locale tag passed to `Intl` / `toLocaleDateString`. */
export const DATE_LOCALE: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

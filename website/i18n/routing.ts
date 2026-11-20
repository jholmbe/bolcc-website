import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

export const routing = defineRouting({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  // On a visitor's first request to `/`, pick a locale from the locale cookie,
  // then the browser's Accept-Language header, then `defaultLocale` (zh).
  localeDetection: true,
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
});

export type { Locale };

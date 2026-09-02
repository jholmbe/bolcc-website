import { defineRouting } from "next-intl/routing";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

export const routing = defineRouting({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
});

export type { Locale };

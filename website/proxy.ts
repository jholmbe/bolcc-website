import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Next.js requires this to be a static literal, so it can't import LOCALES.
  // Keep the locale alternation in sync with `website/i18n/config.ts`.
  matcher: ["/", "/(en|zh)/:path*"],
};

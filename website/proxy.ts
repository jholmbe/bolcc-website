import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Every page path, so unprefixed links like /about redirect to a locale
  // instead of 500ing. Skips API routes, Next/Vercel internals, and files
  // (anything with a dot: favicon.ico, logo.png, the hero video).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};

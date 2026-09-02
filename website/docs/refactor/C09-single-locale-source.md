# C09 — New `i18n/config.ts` — one locale list

## What changed

New file `website/i18n/config.ts` is the single place the supported locales are declared:

```ts
export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const DATE_LOCALE: Record<Locale, string> = { en: "en-US", zh: "zh-CN" };
```

Updated consumers:

- `i18n/routing.ts` — `defineRouting({ locales: [...LOCALES], defaultLocale: DEFAULT_LOCALE })`
  and re-exports `Locale` from config
- `sanity/queries.ts` — `localizedString()` interpolates `DEFAULT_LOCALE` instead of a
  literal `"en"` (C05)
- `proxy.ts` — the `matcher` regex **must** be a static literal (Next.js parses it at
  build time and can't resolve an imported constant), so it stays `"/(en|zh)/:path*"`
  with a comment pointing at `config.ts`

## Why

The locale set was written out in four places: `routing.ts` (`["en","zh"]`), the
`proxy.ts` matcher (`(en|zh)`), the `"en"` fallback inside the GROQ helper, and the
now-deleted `sanity/i18n.ts`. Adding a language (e.g. `ko`) meant finding all four.

Now it's one constant, plus one commented literal in `proxy.ts` that the tooling forces
to stay separate.

## Before / After

```ts
// before — i18n/routing.ts
export const routing = defineRouting({ locales: ["en", "zh"], defaultLocale: "en" });
export type Locale = (typeof routing.locales)[number]; // widened to `string`
```

```ts
// after
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";
export const routing = defineRouting({ locales: [...LOCALES], defaultLocale: DEFAULT_LOCALE });
export type { Locale }; // real "en" | "zh" union
```

## Files touched

- `website/i18n/config.ts` (new)
- `website/i18n/routing.ts`
- `website/sanity/queries.ts`
- `website/proxy.ts` (comment only)

## Cross-app note

The Studio has its own copy in `studio/schemaTypes/languages.ts` (the apps share no
code). Both files now carry a header comment naming the other as the "must match"
counterpart — see C14.

## Risk & rollback

- **Risk:** low. `Locale` is now a stricter type (`"en" | "zh"` instead of `string`);
  `npx tsc` passes, so nothing depended on the looser type.
- **Rollback:** inline `["en","zh"]` back into `routing.ts` and delete `config.ts`.

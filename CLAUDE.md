# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two **independent npm projects** that share no code. They connect only through the Sanity
project (`iala0u3l`, dataset `production`).

- `website/` — Next.js 16 App Router frontend (React 19, Turbopack, Tailwind v4, next-intl)
- `studio/` — Sanity Studio v5 CMS admin (defines the schemas the website reads)

Each has its own `package.json`, `node_modules`, `tsconfig.json`, and eslint config. There
is no workspace tooling — run commands from inside the relevant folder.

## Commands

### website/
```bash
npm run dev        # dev server (Turbopack) on :3000
npm run build      # production build; statically prerenders pages, so it hits Sanity at build time
npm run start      # serve the build
npm run lint       # eslint (next/core-web-vitals + typescript)
npx tsc --noEmit   # typecheck (no separate script)
```
There is **no test suite**.

If `tsc` reports missing modules under `.next/types/…` after adding/removing routes, the
generated type cache is stale: `rm -rf .next` and re-run.

### studio/
```bash
npm run dev        # Studio on :3333
npm run build      # sanity build
npm run deploy     # deploy Studio to Sanity's hosting
npm run lint       # @sanity/eslint-config-studio
```
Prettier is configured in `package.json` (no semicolons, single quotes, width 100).

The `sanity` CLI needs auth (`npx sanity login`) for any dataset or deploy operation.

### Seeding the Give page (one-time, required)
The live dataset has no `givePage` document, so the Give page renders empty. Import the
seed (wording carried over from the old message-file defaults):
```bash
cd studio && npx sanity dataset import seed/givePage.ndjson --dataset production
```
See `website/docs/refactor/C17`.

## Architecture

### Content source of truth — do not mix the two systems

| Kind of text | Lives in | Editor |
| --- | --- | --- |
| Page copy (hero, mission, service times, about body, give text, footer, addresses) | **Sanity** — `homePage` / `aboutPage` / `givePage` singleton documents | Church staff, in the Studio |
| UI chrome (nav labels, button text, aria labels, iframe titles, SEO `metadata`) | **`website/messages/{en,zh}.json`** via next-intl | Developers |

Pages render **directly** from Sanity: a missing field hides its element/section, there is
no code-level fallback. **Do not reintroduce `defaults.*` blocks in the message files** —
removing that duplication (a value declared in schema + query + type + fallback + two JSON
files) was the point of the refactor documented in `website/docs/refactor/` (start with
its `README.md`).

### Sanity data flow (website side)

- `website/sanity/client.ts` — `createClient` with project constants, `useCdn: false`.
- `website/sanity/queries.ts` — GROQ query strings, each with its result **type colocated
  directly above it** (kept in sync with the schema by hand; Sanity Typegen was
  deliberately not adopted — see `docs/refactor/C16`). The `localizedString(field)` helper
  projects an `internationalizedArray*` field down to one string:
  `coalesce(field[language==$locale][0].value, field[language==DEFAULT_LOCALE][0].value)`.
- `website/sanity/utils.ts` — `urlFor(source)` (image-URL builder, null-safe) and
  `SANITY_FETCH` (`{ next: { revalidate: 30 } }`). Use these; don't re-inline them.
- Pages fetch as `client.fetch<XPageContent>(X_PAGE_QUERY, { locale }, SANITY_FETCH)` and
  render defensively (`content?.field`) since the result can be `null`.

### Localized fields in the schema

Page documents use `internationalizedArrayString` / `internationalizedArrayText`
(`sanity-plugin-internationalized-array`), stored as `[{ _key: <lang>, value }]`. The
`localizedString()` GROQ helper flattens them for the frontend.

`homePage` / `aboutPage` / `givePage` are enforced as **singletons** in
`studio/sanity.config.ts`: a custom desk `structure` lists exactly those three, and
`document.newDocumentOptions` / `document.actions` strip create/duplicate/delete for those
types. The website queries assume one document per type (`*[_type == "homePage"][0]`). See
`docs/refactor/C15`.

### i18n and routing

- Locales: `en`, `zh`. `website/i18n/config.ts` (`LOCALES`, `DEFAULT_LOCALE`, `Locale`,
  `DATE_LOCALE`) is the single source. Two places must be kept in sync **manually**:
  the `matcher` regex in `website/proxy.ts` (Next requires a static literal) and
  `studio/schemaTypes/languages.ts` (separate app, no shared module).
- `website/proxy.ts` is the next-intl middleware — Next 16 renamed `middleware.ts` →
  `proxy.ts`.
- Root `website/app/layout.tsx` only returns `children`; the real `<html>`, fonts, and
  `NextIntlClientProvider` are in `website/app/[locale]/layout.tsx`. The `zh` locale
  additionally loads the Noto Sans SC font there.
- `website/app/[locale]/Header.tsx` is the only client component; it reads nav labels from
  the `nav` message namespace and toggles locale via `usePathname` + `<Link locale>`.

### Events page

`website/app/[locale]/events/page.tsx` does not use Sanity. It embeds a Google Calendar
iframe from `NEXT_PUBLIC_CALENDAR_EMBED_URL` (set in `website/.env.local`), with an
`AGENDA`-mode variant for mobile.

### Styling

Tailwind v4 via `@import "tailwindcss"` in `website/app/globals.css`. Brand colors are CSS
variables (`--primary-green`, `--primary-background`, `--primary-text`, `--hover-green`)
re-exported through `@theme inline` as utilities (`bg-primary-green`, `text-primary-text`,
…).

### Remote images

`next/image` only loads remote hosts listed in `website/next.config.ts` `images.remotePatterns`
— currently `cdn.sanity.io`. Add a pattern before pointing `<Image>` at a new host.

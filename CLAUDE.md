# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Audience:** this is the site of a Chinese Christian church. **Simplified Chinese (`zh`) is
the primary language**; English (`en`) is secondary, for visitors and English-speaking members.
Write and review Chinese copy as Simplified (not Traditional) unless the user says otherwise.
The church already uses LINE, so it is the intended channel for announcements.

## Repository layout

Two **independent npm projects** that share no code. They connect only through the Sanity
project (`iala0u3l`, dataset `production`).

- `website/` — Next.js 16 App Router frontend (React 19, Turbopack, Tailwind v4, next-intl),
  deployed on Vercel from `main`
- `studio/` — Sanity Studio v5 CMS admin (defines the schemas the website reads)

Each has its own `package.json`, `node_modules`, `tsconfig.json`, and eslint config. There
is no workspace tooling — run commands from inside the relevant folder. The root
`README.md` is unedited create-next-app / Sanity boilerplate.

## Commands

### website/
```bash
npm run dev        # dev server (Turbopack) on :3000
npm run build      # production build; statically prerenders pages, so it hits Sanity at build time
npm run start      # serve the build
npm run lint       # eslint (next/core-web-vitals + typescript)
npx tsc --noEmit   # typecheck (no separate script)
```
There is **no test suite**. Verify changes with `tsc`, `lint`, and by loading the page.

If `tsc` reports missing modules under `.next/types/…` after adding/removing routes, the
generated type cache is stale: `rm -rf .next` and re-run.

### studio/
```bash
npm run dev        # Studio on :3333
npm run build      # sanity build
npm run deploy     # deploy Studio to Sanity's hosting
npx eslint .       # @sanity/eslint-config-studio (no lint script)
npx tsc --noEmit   # typecheck
```
Prettier is configured in `package.json` (no semicolons, single quotes, width 100).

The `sanity` CLI needs auth (`npx sanity login`) for any dataset or deploy operation.

### Environment variables (`website/.env.local`, and Vercel for production)

| Var | Used by |
| --- | --- |
| `NEXT_PUBLIC_CALENDAR_EMBED_URL` | Events page Google Calendar iframe |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` | `/api/contact` (returns 503 if unset) |
| `SANITY_API_WRITE_TOKEN` | `sanity/writeClient.ts` — LINE webhook writes |
| `LINE_CHANNEL_SECRET`, `LINE_CHANNEL_ACCESS_TOKEN` | LINE webhook signature check / API calls |
| `LINE_GROUP_ID`, `LINE_ANNOUNCER_USER_ID` | Optional allow-lists; when unset, any group/user is accepted |

Only the first three are in the local `.env.local`, so the LINE webhook only works on Vercel.

## Architecture

### Content source of truth — do not mix the systems

| Kind of text | Lives in | Editor |
| --- | --- | --- |
| Page copy (hero, service times, about body, give text, contact info, footer) | **Sanity** — `homePage` / `aboutPage` / `givePage` / `contactPage` singletons | Church staff, in the Studio |
| Announcements | **Sanity** `announcement` docs, written only by the LINE webhook | Church staff, by posting in a LINE group |
| UI chrome (nav labels, button text, aria labels, iframe titles, SEO `metadata`) | **`website/messages/{en,zh}.json`** via next-intl | Developers |

Pages render **directly** from Sanity: a missing field hides its element/section, there is
no code-level fallback. **Do not reintroduce `defaults.*` blocks in the message files** —
removing that duplication (a value declared in schema + query + type + fallback + two JSON
files) was the point of the refactor documented in `website/docs/refactor/` (start with
its `README.md`).

The church's street address is deliberately **not published anywhere** on the site (no
address fields, no map embed). Don't add one back.

The footer has no document of its own: `FOOTER_QUERY` reads footer fields off `homePage`.

### Sanity data flow (website side)

- `website/sanity/client.ts` — read client, `useCdn: false`.
- `website/sanity/writeClient.ts` — token-authenticated `getWriteClient()`; server-only
  (webhook use). Never import it from a client component.
- `website/sanity/queries.ts` — GROQ query strings, each with its result **type colocated
  directly above it** (kept in sync with the schema by hand; Sanity Typegen was
  deliberately not adopted — see `docs/refactor/C16`). The `localizedString(field)` helper
  projects an `internationalizedArray*` field down to one string:
  `coalesce(field[language==$locale][0].value, field[language==DEFAULT_LOCALE][0].value)`.
- `website/sanity/utils.ts` — `urlFor(source)` (image-URL builder, null-safe) and
  `SANITY_FETCH` (`{ next: { revalidate: 30 } }`). Use these; don't re-inline them.
- Pages fetch as `client.fetch<XPageContent>(X_PAGE_QUERY, { locale }, SANITY_FETCH)` and
  render defensively (`content?.field`) since the result can be `null`.

Adding a field means touching, by hand: the schema in `studio/schemaTypes/`, the GROQ
projection and its type in `queries.ts`, and the rendering page. Deploy the Studio
(`npm run deploy`) so editors see the new field.

### Studio schema

Page documents use `internationalizedArrayString` / `internationalizedArrayText` /
`internationalizedArrayRichText` (`sanity-plugin-internationalized-array`), stored as
`[{ _key: <lang>, value }]`. Rich text renders through `website/components/RichText.tsx`.

The four page types are **singletons**, enforced in `studio/sanity.config.ts`: the
`SINGLETONS` array pins each to a fixed `documentId` (UUIDs for home/about/give — they must
match the live dataset docs, don't "clean them up" without migrating), and
`document.newDocumentOptions` / `document.actions` strip create/duplicate/delete. The
website queries assume one document per type (`*[_type == "homePage"][0]`). A new page
type needs an entry in `SINGLETONS`. See `docs/refactor/C15`.

Every `internationalizedArray*` field gets a "Chinese text is missing" **warning** (not an
error) via `withChineseReminders` in `studio/schemaTypes/chineseReminder.ts`, applied to all
types in `schemaTypes/index.ts` — new localized fields are covered automatically.
`DEFAULT_LANGUAGE` in `studio/schemaTypes/languages.ts` is `zh` and must match the
website's `DEFAULT_LOCALE`.

`announcement` is listed in the Studio but is read-only and hidden from "Create" — LINE owns it.

### LINE announcements pipeline

`POST /api/line/webhook` (`website/app/api/line/webhook/route.ts`) verifies the
`x-line-signature` HMAC, then `lib/line/processWebhook.ts` handles each event:

- Text message → creates `announcement-<lineMessageId>` doc.
- Image message → downloaded from LINE, uploaded as a Sanity asset, and attached to the
  sender's announcement from the last 3 minutes (`ATTACH_WINDOW_MS`), else a new doc.
- Edit / LINE "unsend" / a delete command (`delete`, `删除`, `撤回`, … in
  `DELETE_COMMANDS`) → updates or deletes the matching doc.
- After every write, `revalidateAnnouncements()` calls `revalidatePath` for each locale
  layout so the change shows up without waiting for the 30s window.

`ANNOUNCEMENTS_QUERY` is fetched in `app/[locale]/layout.tsx` and shown in a modal opened
from `components/AnnouncementsButton.tsx` in the header.

### Contact form

`components/ContactForm.tsx` posts to `/api/contact`, which sends via Resend to the address
in `contactPage.email` (Sanity), with `replyTo` set to the visitor. It has a honeypot field
(`website`) and an **in-memory** per-IP rate limit (5/min) — per serverless instance, not
global.

### i18n and routing

- Locales: `zh` (default), `en`. `website/i18n/config.ts` (`LOCALES`, `DEFAULT_LOCALE`,
  `Locale`, `DATE_LOCALE`) is the single source. On a first visit to `/`, next-intl picks the
  locale from the `NEXT_LOCALE` cookie, then the browser's `Accept-Language`, then `zh`.
  `DEFAULT_LOCALE` is also the fallback when a Sanity field has no text in the requested
  locale, so a missing English translation shows the Chinese text. `studio/schemaTypes/languages.ts` must be kept
  in sync **manually** (separate app, no shared module). The `website/proxy.ts` matcher
  runs on every non-API, non-file path, so unprefixed links like `/about` redirect to a
  locale; it lists no locales.
- `website/proxy.ts` is the next-intl middleware — Next 16 renamed `middleware.ts` →
  `proxy.ts`.
- Root `website/app/layout.tsx` only returns `children`; the real `<html>`, fonts,
  `NextIntlClientProvider`, and the announcements fetch are in
  `website/app/[locale]/layout.tsx`. The `zh` locale loads Noto Sans SC and sets `<html lang="zh-Hans">`.
- Everything is a server component except `Header`, `ContactForm`, `AnnouncementsButton`,
  and `GivingOptions`. `Header` reads nav labels from the `nav` message namespace and
  toggles locale via `usePathname` + `<Link locale>`.

### Events page

`website/app/[locale]/events/page.tsx` does not use Sanity. It embeds a Google Calendar
iframe from `NEXT_PUBLIC_CALENDAR_EMBED_URL`, with an `AGENDA`-mode variant for mobile.

### Styling

Tailwind v4 via `@import "tailwindcss"` in `website/app/globals.css`. Brand colors are CSS
variables (`--primary-green`, `--primary-background`, `--primary-text`, `--hover-green`,
`--footer-background`) re-exported through `@theme inline` as utilities
(`bg-primary-green`, `text-primary-text`, …). Use `stone-*` for neutral borders (not
`slate-*`), and keep one `<h1>` per page. There is no dark mode.

### Remote images

`next/image` only loads remote hosts listed in `website/next.config.ts` `images.remotePatterns`
— currently `cdn.sanity.io`. Add a pattern before pointing `<Image>` at a new host.

## Product context

The site's audience and intent per page (newcomers for Home/About, donors for Give, etc.)
are written up for content maintainers in the owner's Google Doc "BOLCC Website
Documentation". Ask the user for it before making content or layout decisions that depend
on audience. `studio/seed/givePage.ndjson` was the one-time initial import for the Give
page (`docs/refactor/C17`); the live document now exists.

# Decoupling refactor — 2026-09

## Why this happened

Editable page text used to live in **two systems at once**:

1. **next-intl messages** (`messages/en.json`, `messages/zh.json`) — held real UI chrome
   (nav, buttons) **and** a big `defaults.*` block mirroring every Sanity field, in each
   language.
2. **Sanity CMS** — the actual editable content.

So one string (e.g. the home hero title) was declared in **six places**: the Sanity
schema, the GROQ query, the hand-written TS type, the `?? defaults.x` fallback line, and
the `defaults.x` value in **both** `en.json` and `zh.json`. Changing text meant editing
several files and keeping two languages of "defaults" in sync by hand.

## The rule now

| Kind of text | Single source of truth | Who edits it |
| --- | --- | --- |
| Page content (hero, mission, service times, about body, give text, addresses, footer) | **Sanity** (one field) | Church staff, in the Studio |
| UI chrome (nav labels, button text, aria labels, iframe titles, SEO title) | **`messages/{en,zh}.json`** (one key per language) | Developers |

Nothing is declared twice. A missing Sanity field simply renders nothing — there is no
code-level fallback to keep in sync.

## Change log

Each file documents one change: what, why, before/after, files touched, risk.

| # | Change |
| --- | --- |
| [C01](./C01-strip-message-defaults.md) | Remove `defaults.*` and `post` from the message files |
| [C02](./C02-home-page-sanity-only.md) | Home page renders from Sanity only |
| [C03](./C03-about-page-sanity-only.md) | About page renders from Sanity only + shared helpers |
| [C04](./C04-give-page-sanity-only.md) | Give page renders from Sanity only + broken-QR fix |
| [C05](./C05-colocate-query-types.md) | Move CMS TS types next to their GROQ queries; drop dead queries |
| [C06](./C06-shared-sanity-utils.md) | New `sanity/utils.ts` — one `urlFor` + one fetch-options const |
| [C07](./C07-split-paragraphs-helper.md) | New `lib/text.ts` — shared `splitParagraphs` |
| [C08](./C08-delete-dead-sanity-i18n.md) | Delete unused `sanity/i18n.ts` |
| [C09](./C09-single-locale-source.md) | New `i18n/config.ts` — one locale list |
| [C10](./C10-remove-posts-route.md) | Delete the `[slug]` posts route |
| [C11](./C11-rename-studio-folder.md) | Rename `studio-hello-world/` → `studio/` |
| [C12](./C12-delete-studio-build-artifacts.md) | Delete committed `dist/` and `.sanity/` |
| [C13](./C13-remove-post-schema.md) | Remove the `post` schema + i18n plugin |
| [C14](./C14-dedupe-language-list.md) | De-duplicate the language list (cross-ref comments) |
| [C15](./C15-studio-singletons.md) | Singleton desk structure for the three page docs |
| [C16](./C16-typegen-deferred.md) | Decision record: no Sanity Typegen (for now) |
| [C17](./C17-seed-give-page.md) | Seed the missing `givePage` document |

## File-necessity verdicts

| Path | Verdict |
| --- | --- |
| `website/app/layout.tsx` (returns bare `children`) | **Keep** — App Router requires a root layout; the real markup is in `[locale]/layout.tsx`. |
| `website/app/[locale]/layout.tsx` | **Keep** — the actual `<html>` / providers layout. |
| `website/proxy.ts` | **Keep** — Next 16's middleware entrypoint (renamed from `middleware.ts`). |
| `website/app/[locale]/[slug]/` | **Deleted** (C10) — posts feature removed. |
| `website/sanity/i18n.ts` | **Deleted** (C08) — never imported. |
| `POSTS_QUERY`, `POST_QUERY` | **Deleted** (C05) — unused. |
| `defaults.*`, `post` namespace in `messages/*.json` | **Deleted** (C01) — Sanity is the source of truth. |
| `studio/dist/`, `studio/.sanity/` | **Deleted** (C12) — build artifacts, gitignored. |
| `studio-hello-world/` (folder name) | **Renamed** → `studio/` (C11). |
| `studio/schemaTypes/postType.ts` | **Deleted** (C13). |
| `studio/schemaTypes/languages.ts` | **Keep** — used by `sanity.config.ts`. |
| `studio/seed/givePage.ndjson` | **Added** (C17) — one-time import for the missing `givePage` document. |
| `website/public/church-hero-vid.mp4` | **Keep** — used by the home hero. |
| everything else | **Keep**. |

## Known issue surfaced, not fixed here

`aboutPage.mapEmbedUrl` in the live dataset contains a full `<iframe …>` HTML string
rather than a bare `src` URL, so `<iframe src={mapEmbedUrl}>` is malformed. Fix by
re-entering just the `src="…"` value in the Studio, or extract `src` defensively in
`about/page.tsx`.

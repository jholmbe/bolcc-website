# C05 — Colocate CMS types with their queries; drop dead queries

## What changed

`sanity/queries.ts` now exports, next to each GROQ query, the TypeScript type of what
that query returns:

- `ServiceTime`, `HomePageContent` — above `HOME_PAGE_QUERY`
- `AboutPageContent` — above `ABOUT_PAGE_QUERY`
- `GivePageContent` — above `GIVE_PAGE_QUERY`

These type definitions previously lived inside the page components
(`app/[locale]/*/page.tsx`), far from the query they described.

Deleted:

- `POSTS_QUERY` — never imported anywhere
- `POST_QUERY` — only used by the `[slug]` route, which is removed (C10)

Also: the `localizedString()` helper's hard-coded `"en"` fallback now interpolates
`DEFAULT_LOCALE` from `@/i18n/config` (C09), so the query's default language tracks the
site's.

## Why

A CMS field's shape was maintained in **two files that never sit next to each other**:
the GROQ projection in `queries.ts` and the `type XPageContent` in the page. Adding a
field meant editing both, in sync, blind. Now the query and its type are adjacent — one
file, one screen.

## Before / After

```tsx
// before — app/[locale]/page.tsx
type HomePageContent = { heroTitle?: string; /* … */ };
```
```ts
// before — sanity/queries.ts
export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{ … }`;
export const POSTS_QUERY = `*[_type == "post" …]{…}`;   // unused
export const POST_QUERY  = `*[_type == "post" …][0]`;   // slug route only
```

```ts
// after — sanity/queries.ts
export type HomePageContent = { heroTitle?: string; /* … */ };
export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{ … }`;
```

## Files touched

- `website/sanity/queries.ts`
- consumers updated to `import { X_PAGE_QUERY, type XPageContent }` in C02–C04

## Risk & rollback

- **Risk:** low — pure move + delete of unused exports. `npx tsc` passes.
- **Note:** the hand-written types are still hand-written (kept in sync with the schema
  by a human). Auto-generating them was considered and deferred — see C16.
- **Rollback:** move the types back into the pages and restore the two queries.

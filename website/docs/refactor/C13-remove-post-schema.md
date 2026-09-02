# C13 — Remove the `post` schema + document-i18n plugin

## What changed

In the Studio:

- deleted `schemaTypes/postType.ts`
- removed `postType` from `schemaTypes/index.ts` (`schemaTypes` array is now
  `[homePageType, aboutPageType, givePageType]`)
- removed the `documentInternationalization({ schemaTypes: ['post'] })` plugin block from
  `sanity.config.ts` — `post` was its only registered type, so the plugin has nothing
  left to do
- kept `internationalizedArray(...)` — that's what powers the per-field `en`/`zh` values
  on the page documents

## Why

Companion to C10 — the website no longer has a blog, so the schema behind it is dead
weight in the Studio. Editors would otherwise still see a "Post" document type they
can't use.

## Before / After

```ts
// before — schemaTypes/index.ts
export const schemaTypes = [postType, homePageType, aboutPageType, givePageType]
```
```ts
// after
export const schemaTypes = [homePageType, aboutPageType, givePageType]
```

```ts
// before — sanity.config.ts plugins: [
  documentInternationalization({ supportedLanguages: [...SUPPORTED_LANGUAGES], schemaTypes: ['post'] }),
// ]
```
(block removed; `@sanity/document-internationalization` import dropped)

## Files touched

- `studio/schemaTypes/postType.ts` — deleted
- `studio/schemaTypes/index.ts`
- `studio/sanity.config.ts`

## Data note

The two existing `post` documents remain in the dataset until manually deleted (see C10).
They no longer have a schema, so the Studio will show them only under "Inspect"/raw
tools, not as editable documents.

## Risk & rollback

- **Risk:** low. `npx tsc` in the Studio passes.
- **Dependency left in `package.json`:** `@sanity/document-internationalization` is no
  longer imported. Left installed for now; safe to `npm uninstall` later.
- **Rollback:** restore `postType.ts`, re-add to the array, re-add the plugin block.

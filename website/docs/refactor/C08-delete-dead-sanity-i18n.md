# C08 — Delete unused `sanity/i18n.ts`

## What changed

Deleted `website/sanity/i18n.ts`. It exported:

```ts
export const SUPPORTED_LANGUAGES = [
  { id: "en", title: "English" },
  { id: "zh", title: "中文" },
] as const;
export const DEFAULT_LANGUAGE = "en";
```

## Why

Grep for `SUPPORTED_LANGUAGES` / `DEFAULT_LANGUAGE` across `website/` returns **only this
file** — nothing imports it. It was a copy of the Studio's
`schemaTypes/languages.ts`, left behind and never wired up. The website's real locale
list is `i18n/routing.ts` (now `i18n/config.ts`, C09).

## Verification

```
$ rg "SUPPORTED_LANGUAGES|DEFAULT_LANGUAGE|sanity/i18n" website
# (no results)
```

## Files touched

- `website/sanity/i18n.ts` — deleted

## Risk & rollback

- **Risk:** none — dead code.
- **Rollback:** `git checkout` the file.

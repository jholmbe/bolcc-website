# C14 — De-duplicate the language list

## Starting state

The `en` / `zh` language list existed in **three** places:

1. `website/i18n/routing.ts` — `["en", "zh"]`
2. `website/sanity/i18n.ts` — `SUPPORTED_LANGUAGES` (+ `DEFAULT_LANGUAGE`)
3. `studio-hello-world/schemaTypes/languages.ts` — `SUPPORTED_LANGUAGES` (+ `DEFAULT_LANGUAGE`)

(plus the `proxy.ts` matcher regex — see C09.)

## What changed

- #2 was pure dead code and is **deleted** (C08).
- #1 is now derived from the new single constant `website/i18n/config.ts` `LOCALES` (C09).
- #3 stays. The website and the Studio are **separate npm projects with no shared module
  graph**, so the Studio genuinely needs its own copy.

Result: **one list per app** — `website/i18n/config.ts` and
`studio/schemaTypes/languages.ts` — instead of three.

To make the remaining duplication safe, both files now carry a header comment naming the
other as the counterpart that must be kept in sync:

```ts
// website/i18n/config.ts
/** MUST stay in sync with the Sanity Studio language list at
 *  `studio/schemaTypes/languages.ts` … also update the matcher in proxy.ts. */

// studio/schemaTypes/languages.ts
/** MUST stay in sync with the website's locale list at
 *  `website/i18n/config.ts` (`LOCALES`) … deliberate second copy. */
```

## Why not fully share it?

A shared package would mean introducing workspaces/monorepo tooling for two tiny
constants. The comment-linked copies are the pragmatic call; revisit if the apps ever
share a build.

## Files touched

- `website/sanity/i18n.ts` — deleted (C08)
- `website/i18n/config.ts` — new, with cross-ref comment (C09)
- `studio/schemaTypes/languages.ts` — cross-ref comment added

## Risk & rollback

- **Risk:** none.
- **Rollback:** recreate `sanity/i18n.ts` if something outside the repo imported it
  (nothing in the repo does).

# C06 — New `sanity/utils.ts` — one `urlFor`, one fetch-options const

## What changed

New file `website/sanity/utils.ts` exports:

- `SANITY_FETCH` — the `{ next: { revalidate: 30 } }` object that was declared separately
  in **four** page files as `const options = …`
- `urlFor(source)` — the Sanity image-URL builder, including the
  `projectId && dataset ? … : null` guard, that was copy-pasted verbatim into **three**
  page files (`about`, `give`, the old `[slug]`)

All call sites now import from `@/sanity/utils`.

## Why

`urlFor` and the fetch-options object are infrastructure, not page content, yet every
page carried its own copy. Changing the revalidate window, or the image-builder guard,
meant a find-and-replace across pages.

## Before / After

```tsx
// before — repeated in about/page.tsx, give/page.tsx, [slug]/page.tsx
const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
const options = { next: { revalidate: 30 } };
```

```tsx
// after — once, in sanity/utils.ts; imported everywhere
import { SANITY_FETCH, urlFor } from "@/sanity/utils";
```

## Files touched

- `website/sanity/utils.ts` (new)
- `website/app/[locale]/page.tsx`, `about/page.tsx`, `give/page.tsx` — import instead of
  redefine

## Risk & rollback

- **Risk:** none functional — same code, one home.
- **Rollback:** delete `utils.ts`, re-inline the helpers.

# C03 — About page renders from Sanity only + shared helpers

## What changed

`app/[locale]/about/page.tsx`:

- removed `type AboutPageContent` (moved to `sanity/queries.ts`, C05)
- removed `t.raw("defaults")` and all seven `?? defaults.x` lines
- deleted the copy-pasted image-builder block
  (`const { projectId, dataset } = client.config(); const urlFor = …`) — now
  `import { urlFor } from "@/sanity/utils"` (C06)
- deleted the local `const options = …` — now `SANITY_FETCH` (C06)
- replaced the inline `body.split(/\n+/).filter(…)` with `splitParagraphs(...)` (C07)
- guarded each section: Location renders only if an address or map URL exists; the mother
  church section only if it has a title or description; the CTA link and image only if
  their values exist. `alt` falls back to `""` when there is no title.

Kept UI labels: `t("eyebrow")`, `t("location")`, `t("mapTitle")`, `t("motherChurch")`,
`t("visitMotherChurch")`.

## Why

Same six-places problem as the home page, plus this file carried its **own private copy**
of `urlFor` and the fetch-options object — two more things duplicated across pages.

## Before / After

```tsx
// before
const { projectId, dataset } = client.config();
const urlFor = (source) => projectId && dataset ? createImageUrlBuilder(...).image(source) : null;
const options = { next: { revalidate: 30 } };
// …
const title = aboutPageContent?.title ?? defaults.title;
const paragraphs = body.split(/\n+/).filter((p) => p.trim());
```

```tsx
// after
import { SANITY_FETCH, urlFor } from "@/sanity/utils";
import { splitParagraphs } from "@/lib/text";
// …
const paragraphs = content?.body ? splitParagraphs(content.body) : [];
```

## Files touched

- `website/app/[locale]/about/page.tsx`

Depends on: C05, C06, C07.

## Risk & rollback

- **Risk:** empty Sanity fields hide their section. Live `aboutPage` is fully populated
  (`en` + `zh`).
- **Pre-existing, not fixed here:** `mapEmbedUrl` in the dataset is a full `<iframe>`
  string, so the map `src` is malformed regardless of this change — see README.
- **Rollback:** restore the previous file and the `about.defaults` block.

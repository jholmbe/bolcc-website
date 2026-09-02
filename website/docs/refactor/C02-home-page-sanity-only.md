# C02 — Home page renders from Sanity only

## What changed

`app/[locale]/page.tsx` was rewritten so that **all page content comes from the Sanity
`homePage` document**. Removed:

- the local `type HomePageContent` / `type ServiceTime` (moved to `sanity/queries.ts`, C05)
- `const t.raw("defaults")` and the large `defaults` shape cast
- all eight `const x = content?.x ?? defaults.x` fallback lines
- the local `const options = { next: { revalidate: 30 } }` (now `SANITY_FETCH`, C06)

Kept the three real UI labels: `t("serviceTimes")`, `t("contactUs")`, `t("mission")`.

Rendering is now **guarded**: the mission `<section>` renders only if a mission title or
description exists; the service-times `<section>` renders only if the filtered array is
non-empty; each footer line renders only if present.

## Why

This page alone had **8 fallback wires + a duplicated defaults type + a duplicated fetch
const**. Every one of those was a place you had to touch (and keep language-correct in
two JSON files) to change a word. Now the component just displays whatever Sanity
returns.

## Before / After

```tsx
// before
const defaults = t.raw("defaults") as { heroTitle: string; /* …9 more… */ };
const homePageContent = await client.fetch<HomePageContent>(HOME_PAGE_QUERY, { locale }, options);
const heroTitle = homePageContent?.heroTitle ?? defaults.heroTitle;
const heroWelcomeMessage = homePageContent?.heroWelcomeMessage ?? defaults.heroWelcomeMessage;
// …6 more …?? defaults.x lines…
<h1>{heroTitle}</h1>
```

```tsx
// after
const content = await client.fetch<HomePageContent>(HOME_PAGE_QUERY, { locale }, SANITY_FETCH);
// …
{content?.heroTitle && <h1>{content.heroTitle}</h1>}
```

## Files touched

- `website/app/[locale]/page.tsx`

Depends on: C05 (`HomePageContent`), C06 (`SANITY_FETCH`).

## Risk & rollback

- **Risk:** if a `homePage` field is empty in Sanity, that element/section disappears
  instead of showing placeholder text. Verified against the live dataset: `homePage` has
  hero, mission, footer and 4 service times in both `en` and `zh`.
- **Rollback:** restore the previous `page.tsx` and the `home.defaults` block in C01.

# C04 — Give page renders from Sanity only + broken-QR fix

## What changed

`app/[locale]/give/page.tsx`:

- removed `type GivePageContent` (moved to `sanity/queries.ts`, C05)
- removed `t.raw("defaults")` and all `?? defaults.x` lines
- deleted the private `urlFor` block and local `options` const — now imported from
  `@/sanity/utils` (C06)
- replaced inline paragraph splitting with `splitParagraphs(...)` (C07)
- **the QR `<Image>` now renders only when `paymentQrCodeUrl` exists.** The old code did
  `paymentQrCodeSource = paymentQrCodeUrl ?? "/zelle-qr-code.png"` — but that file does
  **not** exist in `public/`, so with no Sanity QR the page showed a broken image.
- kept one UI label: `t("give.paymentQrCodeAlt")` for the image `alt`.
- guarded the payment `<section>` so it only renders with a title, instructions, or QR.

## Why

Same decoupling as the other pages, and this page had a latent bug: a fallback pointing
at a non-existent asset.

## Before / After

```tsx
// before
const paymentQrCodeSource = paymentQrCodeUrl ?? "/zelle-qr-code.png"; // file missing
<Image src={paymentQrCodeSource} alt={defaults.paymentQrCodeAlt} … />
```

```tsx
// after
{paymentQrCodeUrl && (
  <Image src={paymentQrCodeUrl} alt={t("paymentQrCodeAlt")} … />
)}
```

## Files touched

- `website/app/[locale]/give/page.tsx`
- `website/next.config.ts` — added `images.remotePatterns` for `cdn.sanity.io` so
  `next/image` can load the QR from Sanity's CDN (the old code only ever pointed `<Image>`
  at a local path, so this was never configured).

Depends on: C05, C06, C07, **C17** (the `givePage` document does not exist yet).

## Risk & rollback

- **Risk:** until C17 is imported, the whole Give page is empty (no `givePage` document
  in the dataset). This is expected and is the reason C17 exists.
- **Rollback:** restore the previous file, the `give.defaults` block, and revert the
  `next.config.ts` change.

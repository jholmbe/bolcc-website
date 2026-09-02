# C07 — New `lib/text.ts` — shared `splitParagraphs`

## What changed

New file `website/lib/text.ts`:

```ts
export const splitParagraphs = (value: string): string[] =>
  value.split(/\n+/).filter((paragraph) => paragraph.trim());
```

The About and Give pages both turned a multi-line Sanity `text` field into `<p>` blocks
with the identical inline expression `body.split(/\n+/).filter((p) => p.trim())`. Both now
call `splitParagraphs`.

## Why

Small, but it was the same regex in two places — if the paragraph rule ever changes
(e.g. handle `\r\n`, or trim each paragraph), it should change once.

## Before / After

```tsx
// before — about/page.tsx and give/page.tsx
const paragraphs = body.split(/\n+/).filter((paragraph) => paragraph.trim());
```

```tsx
// after
import { splitParagraphs } from "@/lib/text";
const paragraphs = content?.body ? splitParagraphs(content.body) : [];
```

## Files touched

- `website/lib/text.ts` (new)
- `website/app/[locale]/about/page.tsx`
- `website/app/[locale]/give/page.tsx`

## Risk & rollback

- **Risk:** none — identical behaviour.
- **Rollback:** delete `lib/text.ts`, re-inline the expression.

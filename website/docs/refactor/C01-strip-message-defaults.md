# C01 — Remove `defaults.*` and `post` from the message files

## What changed

`messages/en.json` and `messages/zh.json` were cut down to **developer-owned UI chrome
only**:

- `metadata`, `nav` — unchanged
- `home` — kept `serviceTimes`, `contactUs`, `mission`; **deleted the `defaults` object**
- `about` — kept `eyebrow`, `location`, `mapTitle`, `motherChurch`, `visitMotherChurch`;
  **deleted the `defaults` object**
- `give` — **deleted everything except `paymentQrCodeAlt`** (the old top-level `title` /
  `eyebrow` were never read; the `defaults` object is gone)
- `events` — unchanged (`title`, `calendarTitle`)
- `post` — **whole namespace deleted** (posts feature removed, see C10/C13)

Each file went from ~90 lines to ~35.

## Why

The `defaults.*` blocks were a second, hand-maintained copy of every Sanity field — in
two languages. They were the main reason a text change touched many files: editing the
hero title in Sanity left a stale English *and* Chinese "default" behind. With Sanity as
the single source of truth, these have no reason to exist.

## Before / After

```jsonc
// before — messages/en.json
"home": {
  "serviceTimes": "Service Times",
  "contactUs": "Contact Us",
  "mission": "MISSION",
  "defaults": {
    "heroTitle": "What is something that represents the church?",
    "heroWelcomeMessage": "Welcome message here.",
    "missionTitle": "Our mission",
    /* …8 more fields, plus a 4-item serviceTimes array… */
  }
}
```

```jsonc
// after
"home": {
  "serviceTimes": "Service Times",
  "contactUs": "Contact Us",
  "mission": "MISSION"
}
```

## Files touched

- `website/messages/en.json`
- `website/messages/zh.json`

## Risk & rollback

- **Risk:** any page still reading `t("…defaults…")` would now get an empty string.
  C02–C04 remove every such read; `npx tsc` + `next build` compile clean, and
  `rg "defaults" website/app` returns nothing.
- **Give page depends on C17.** The live dataset has no `givePage` document, so until the
  seed in C17 is imported the Give page renders blank. Home and About documents are fully
  populated and unaffected.
- **Rollback:** restore the two JSON files from version control and revert C02–C04.

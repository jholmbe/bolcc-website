# C17 — Seed the missing `givePage` document

## The problem

A read-only query against the live `production` dataset shows **no `givePage` document
exists**. The old Give page never noticed because it rendered entirely from
`give.defaults` in the message files. C01 + C04 remove those defaults, so until a
`givePage` document exists the Give page renders blank.

`homePage` and `aboutPage` were checked the same way and **are** fully populated in both
`en` and `zh` — only `givePage` is missing.

## What was added

`studio/seed/givePage.ndjson` — one `givePage` document (`_id: "givePage"`) whose
`internationalizedArray` fields carry the **exact `en` + `zh` wording that was in the
`give.defaults` blocks**, so no copy is lost:

| field | en | zh |
| --- | --- | --- |
| `eyebrow` | Support Bread of Life | 支持生命面包教会 |
| `title` | Give | 奉献 |
| `body` | Your generosity helps Bread of Life… | 您的奉献帮助生命面包基督教会… |
| `paymentTitle` | Ways to Give | 奉献方式 |
| `paymentInstructions` | Scan the QR code… through Zelle. | 扫描二维码…安全地进行奉献。 |

`paymentQrCode` (image) is intentionally left empty — upload the QR in the Studio. Until
then the Give page just omits the QR block (C04).

## How to apply (required deploy step)

```bash
cd studio
npx sanity dataset import seed/givePage.ndjson --dataset production
```

You must be logged in (`npx sanity login`) with write access to the `iala0u3l` project.
`import` creates the document by `_id`; re-running it is safe (idempotent) unless you
pass `--replace`.

Then verify:

```bash
npx sanity documents query '*[_type=="givePage"][0]{title, body}'
```

and open `/en/give` + `/zh/give` in the running site.

## Files touched

- `studio/seed/givePage.ndjson` (new)

## Risk & rollback

- **Risk:** low — adds one document. If the field `_type` values ever mismatch the
  installed `sanity-plugin-internationalized-array` version, edit the doc once in the
  Studio and re-publish; that rewrites them correctly.
- **Rollback:** `npx sanity documents delete givePage`.

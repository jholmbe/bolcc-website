# C10 — Delete the `[slug]` posts route

## What changed

Deleted `website/app/[locale]/[slug]/` (the `page.tsx` for a single Sanity blog post).

Related cleanup lives in other changes:

- `POST_QUERY` / `POSTS_QUERY` removed from `sanity/queries.ts` (C05)
- `post` namespace removed from the message files (C01)
- `post` schema + `documentInternationalization` plugin removed from the Studio (C13)

## Why

The route existed but **nothing linked to it** — there was no posts-index page, and the
only `<Link>` in it pointed back to `/about`. It was half-built scaffolding. The user
chose to remove the blog feature entirely rather than finish it.

Removing it also deletes another `urlFor` copy and another `options` const, and drops the
`next-sanity` `PortableText` dependency surface from the app.

## Files touched

- `website/app/[locale]/[slug]/page.tsx` — deleted (directory removed)

## Data note

Two `post` documents still exist in the Sanity `production` dataset. They are now
unreferenced and harmless; an editor can delete them from the dataset with
`npx sanity documents delete <id>` if desired.

## Risk & rollback

- **Risk:** any external link to `/{locale}/{slug}` now 404s. There were no such links in
  the codebase or sitemap.
- **Rollback:** restore the directory, `POST_QUERY`, the `post` message namespace, and
  the `post` schema.

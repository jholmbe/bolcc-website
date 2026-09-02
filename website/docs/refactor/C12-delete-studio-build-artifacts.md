# C12 — Delete committed `dist/` and `.sanity/`

## What changed

Removed from the Studio folder:

- `dist/` — output of `sanity build` (favicons, bundled JS/CSS, `index.html`, vendored
  React)
- `.sanity/` — the `sanity dev` runtime cache

## Why

Both are generated and both are already listed in `.gitignore`
(`# build artifacts` / `dist/`, `# sanity studio runtime` / `.sanity/`). Having them
present in the working tree just adds noise and stale bundles. They regenerate on the
next `sanity dev` / `sanity build`.

## Files touched

- `studio/dist/` — deleted
- `studio/.sanity/` — deleted

## Risk & rollback

- **Risk:** none — regenerated on next run.
- **Rollback:** `npm run build` inside the Studio.

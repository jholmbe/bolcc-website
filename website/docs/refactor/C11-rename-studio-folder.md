# C11 — Rename `studio-hello-world/` → `studio/`

## What changed

The Sanity Studio project folder was renamed from `studio-hello-world` (the throwaway
name from `npm create sanity`) to `studio`.

The package `name` inside it is already `breadoflife`, so only the directory name and
doc references change.

## Why

The name implied a scratch/tutorial project. `studio/` alongside `website/` reads as
what it is: the two halves of the site.

## Files touched

- directory rename `studio-hello-world/` → `studio/`
- `README.md` and `website/docs/refactor/*` references updated

## Status

**Done.** The rename was applied with `mv studio-hello-world studio` after the running
`sanity dev` server was stopped (it held a Windows lock on the folder). No code inside
the folder or in `website/` references the path, so nothing else changed. Restart the
Studio with `cd studio && npm run dev`.

## Risk & rollback

- **Risk:** none — no absolute paths point at the old name.
- **Rollback:** rename back.

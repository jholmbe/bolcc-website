# C16 — Decision record: no Sanity Typegen (for now)

## Context

After C05, the shapes returned by the GROQ queries are still **hand-written types**
(`HomePageContent`, `AboutPageContent`, `GivePageContent` in `sanity/queries.ts`). A
human keeps them matching both the Studio schema and the query projection. That is
residual coupling: add a field in three files (schema, query, type).

Sanity ships `sanity typegen`, which generates those types automatically from the schema
+ the query strings, removing the hand-written layer.

## Decision

**Not adopting Typegen in this pass.** Types stay hand-written and colocated with their
query (C05).

### Why

- It adds a codegen step to the workflow: run `sanity schema extract` in the Studio, then
  `sanity typegen generate` in the website, and re-run both on every schema/query edit
  (or wire it into `predev` / `prebuild` / CI).
- The surface is tiny — three page documents, ~20 fields total. The colocated types are
  a few lines each and easy to eyeball against the query right above them.
- The user explicitly chose "colocate types with queries" over "set up Typegen".

## If you want it later

```bash
# in studio/
npx sanity@latest schema extract --path ../website/sanity/extract.json

# in website/  (add sanity as a devDependency first)
npx sanity@latest typegen generate     # reads sanity-typegen.json → writes sanity.types.ts
```

Create `website/sanity-typegen.json`:

```json
{ "path": "./**/*.{ts,tsx}", "schema": "./sanity/extract.json", "generates": "./sanity/sanity.types.ts" }
```

Then replace the hand types in `queries.ts` with the generated
`HOME_PAGE_QUERYResult` etc., and add both commands to a `pregenerate` / CI script so
they can't drift.

## Files touched

- none (this file is the record)

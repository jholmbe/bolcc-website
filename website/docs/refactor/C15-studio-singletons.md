# C15 — Singleton desk structure for the three page documents

## What changed

`studio/sanity.config.ts` now gives `structureTool` an explicit `structure`:

```ts
structureTool({
  structure: (S) =>
    S.list().title('Content').items([
      S.documentTypeListItem('homePage').title('Home Page'),
      S.documentTypeListItem('aboutPage').title('About Page'),
      S.documentTypeListItem('givePage').title('Give Page'),
    ]),
})
```

and a `document` policy:

```ts
document: {
  // hide these types from the global "＋ Create" menu
  newDocumentOptions: (prev) => prev.filter((i) => !SINGLETON_TYPES.includes(i.templateId)),
  // on a singleton, allow only publish / discard / restore — no create, duplicate, delete
  actions: (prev, { schemaType }) =>
    SINGLETON_TYPES.includes(schemaType)
      ? prev.filter(({ action }) => ['publish', 'discardChanges', 'restore'].includes(action ?? ''))
      : prev,
}
```

where `SINGLETON_TYPES = ['homePage', 'aboutPage', 'givePage']`.

## Why

The default Studio showed a generic document list. An editor could create a **second**
`homePage`, and the website query `*[_type == "homePage"][0]` would then silently pick
one of them — a real "change text and it breaks" trap. Now:

- the left menu is exactly three entries: Home Page, About Page, Give Page
- you can't create or delete them
- "edit the site's text" has one obvious path per page

This is the Studio-side half of "one source of truth".

## Note on document IDs

The existing `homePage` / `aboutPage` docs in the dataset have random UUIDs, not fixed
ids. This change does **not** force fixed ids (that would need a production data
migration), so `documentTypeListItem` opens the type's single document as-is. The seeded
`givePage` (C17) uses the fixed id `givePage` for tidiness. If the team later wants true
`documentId('homePage')` panes, migrate the two docs to fixed ids first.

## Files touched

- `studio/sanity.config.ts`

## Risk & rollback

- **Risk:** low — desk config only, no data touched. `npx tsc` in the Studio passes.
- **Rollback:** revert `sanity.config.ts` to `structureTool()` with no arguments.

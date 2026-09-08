import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

import {schemaTypes} from './schemaTypes'
import {SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE} from './schemaTypes/languages'

// Page documents are singletons: exactly one of each should ever exist. They
// get a fixed spot in the menu and lose the create/delete/duplicate actions so
// editors can't accidentally make a second one.
//
// documentId must match the live dataset doc. Contact was created with a
// stable id; the others still use the UUIDs they were first saved under
// (migrating those to `homePage` / `aboutPage` / `givePage` is optional).
const SINGLETONS = [
  {type: 'homePage', title: 'Home Page', id: '0b2c1574-4539-4578-9bad-dcba50d009e9'},
  {type: 'aboutPage', title: 'About Page', id: '1b856018-659d-4519-86bf-ca983e409f4e'},
  {type: 'givePage', title: 'Give Page', id: 'ddd962e1-38da-4daf-b402-f4ad888f0b1f'},
  {type: 'contactPage', title: 'Contact Page', id: 'contactPage'},
] as const

const SINGLETON_TYPES: string[] = SINGLETONS.map((s) => s.type)

export default defineConfig({
  name: 'default',
  title: 'breadoflife',

  projectId: 'iala0u3l',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items(
            SINGLETONS.map(({type, title, id}) =>
              S.listItem()
                .title(title)
                .id(type)
                .child(S.document().schemaType(type).documentId(id).title(title)),
            ),
          ),
    }),
    visionTool(),
    internationalizedArray({
      languages: [...SUPPORTED_LANGUAGES],
      defaultLanguages: [DEFAULT_LANGUAGE],
      fieldTypes: ['string', 'text'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  // Keep the global "＋ Create" menu from offering new singleton pages.
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !SINGLETON_TYPES.includes(item.templateId)),
    actions: (prev, {schemaType}) =>
      SINGLETON_TYPES.includes(schemaType)
        ? prev.filter(({action}) =>
            ['publish', 'discardChanges', 'restore'].includes(action ?? ''),
          )
        : prev,
  },
})

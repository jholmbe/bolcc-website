import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

import {schemaTypes} from './schemaTypes'
import {SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE} from './schemaTypes/languages'

// The three page documents are singletons: exactly one of each should ever
// exist. They get a fixed spot in the menu and lose the create/delete/duplicate
// actions so editors can't accidentally make a second one.
const SINGLETON_TYPES = ['homePage', 'aboutPage', 'givePage']

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
          .items([
            S.documentTypeListItem('homePage').title('Home Page'),
            S.documentTypeListItem('aboutPage').title('About Page'),
            S.documentTypeListItem('givePage').title('Give Page'),
          ]),
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

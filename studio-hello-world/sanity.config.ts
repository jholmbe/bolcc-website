import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

import {schemaTypes} from './schemaTypes'
import {SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE} from './schemaTypes/languages'

export default defineConfig({
  name: 'default',
  title: 'breadoflife',

  projectId: 'iala0u3l',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    internationalizedArray({
      languages: [...SUPPORTED_LANGUAGES],
      defaultLanguages: [DEFAULT_LANGUAGE],
      fieldTypes: ['string', 'text'],
    }),
    documentInternationalization({
      supportedLanguages: [...SUPPORTED_LANGUAGES],
      schemaTypes: ['post'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

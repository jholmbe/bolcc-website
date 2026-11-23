import {defineField, defineType} from 'sanity'

import {localizedPreviewValue} from './localizedPreview'

/** One row of the About page "Our Values" accordion. Numbered by its position. */
export const valueItemType = defineType({
  name: 'valueItem',
  title: 'Value',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      description: 'Shown when the visitor opens this value.',
      type: 'internationalizedArrayRichText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Optional photo shown beside the description.',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
    prepare({title, media}) {
      return {title: localizedPreviewValue(title, 'Value'), media}
    },
  },
})

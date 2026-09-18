import {defineField, defineType} from 'sanity'

import {localizedPreviewValue} from './localizedPreview'

export const faqItemType = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'internationalizedArrayRichText',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'question'},
    prepare({title}) {
      return {title: localizedPreviewValue(title, 'Question')}
    },
  },
})

import {defineField, defineType} from 'sanity'

import {localizedPreviewValue} from './localizedPreview'

export const givePageType = defineType({
  name: 'givePage',
  title: 'Give Page',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Summary',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'onlineMethods',
      title: 'Online Giving',
      description: 'Shown under the "Online" option, e.g. PayPal and Zelle.',
      type: 'array',
      of: [{type: 'givingMethod'}],
    }),
    defineField({
      name: 'inPersonMethods',
      title: 'In-Person Giving',
      description: 'Shown under the "In person" option, e.g. cash, cheque, and mail.',
      type: 'array',
      of: [{type: 'givingMethod'}],
    }),
    defineField({
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      of: [{type: 'faqItem'}],
    }),
  ],
  // Without this, Studio stringifies the internationalizedArray `title` field
  // into the document header.
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: localizedPreviewValue(title, 'Give Page')}
    },
  },
})

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
      name: 'paymentTitle',
      title: 'Payment Section Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'paymentInstructions',
      title: 'Payment Instructions',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'paymentQrCode',
      title: 'Payment QR Code',
      type: 'image',
      options: {hotspot: true},
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

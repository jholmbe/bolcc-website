import {defineField, defineType} from 'sanity'

import {localizedPreviewValue} from './localizedPreview'

export const givingMethodType = defineType({
  name: 'givingMethod',
  title: 'Giving Method',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      description: 'Optional button link, e.g. the PayPal giving page.',
      type: 'url',
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link Label',
      description: 'Button text. Only shown when a Link URL is set.',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Optional image, e.g. a Zelle QR code.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image Alt Text',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare({title, media}) {
      return {title: localizedPreviewValue(title, 'Giving Method'), media}
    },
  },
})

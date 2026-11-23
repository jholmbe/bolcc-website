import {defineField, defineType} from 'sanity'

import {localizedPreviewValue} from './localizedPreview'

/** One card in the About page "Our Ministries" section. */
export const ministryItemType = defineType({
  name: 'ministryItem',
  title: 'Ministry',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      description: 'e.g. 祷告 / Prayer',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A sentence or two: who it is for and when it meets.',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Illustration',
      description:
        'Shown at the top of the card. Use a PNG with a transparent background; it is shown whole, never cropped.',
      type: 'image',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
    prepare({title, media}) {
      return {title: localizedPreviewValue(title, 'Ministry'), media}
    },
  },
})

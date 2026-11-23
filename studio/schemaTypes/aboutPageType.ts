import {defineField, defineType} from 'sanity'

import {localizedPreviewValue} from './localizedPreview'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  // One fieldset per page section, in the order they appear on the site.
  fieldsets: [
    {name: 'whoWeAre', title: 'Who We Are'},
    {name: 'values', title: 'Our Values'},
    {name: 'ministries', title: 'Our Ministries'},
    {name: 'history', title: 'Our History'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Heading',
      description: 'The main heading at the top of the page.',
      type: 'internationalizedArrayString',
      fieldset: 'whoWeAre',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      description:
        'A short paragraph for first-time visitors: who we are and what to expect when you come.',
      type: 'internationalizedArrayText',
      fieldset: 'whoWeAre',
    }),
    defineField({
      name: 'introImage',
      title: 'Introduction Photo',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'whoWeAre',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      description: 'Each value is one row in the list. Drag to reorder; numbering follows.',
      type: 'array',
      of: [{type: 'valueItem'}],
      fieldset: 'values',
    }),
    defineField({
      name: 'ministries',
      title: 'Ministries',
      description: 'Each ministry is one card. Drag to reorder.',
      type: 'array',
      of: [{type: 'ministryItem'}],
      fieldset: 'ministries',
    }),
    defineField({
      // Named `body` for historical reasons; it is the history text.
      name: 'body',
      title: 'History',
      description: 'Keep it short: a few sentences on how the church began.',
      type: 'internationalizedArrayText',
      fieldset: 'history',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'motherChurchTitle',
      title: 'Mother Church Name',
      type: 'internationalizedArrayString',
      fieldset: 'history',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'motherChurchDescription',
      title: 'Mother Church Description',
      type: 'internationalizedArrayText',
      fieldset: 'history',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'motherChurchUrl',
      title: 'Mother Church URL',
      type: 'url',
      fieldset: 'history',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'motherChurchImage',
      title: 'Mother Church Image',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'history',
    }),
  ],
  // Without this, Studio stringifies the internationalizedArray `title` field
  // into the document header.
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: localizedPreviewValue(title, 'About Page')}
    },
  },
})

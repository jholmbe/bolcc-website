import {defineArrayMember, defineField, defineType} from 'sanity'

import {localizedPreviewValue} from './localizedPreview'

/** One card in a home page service-times column. */
const serviceTime = defineArrayMember({
  name: 'serviceTime',
  title: 'Service Time',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'e.g. 成人查经班 / Adult Bible Study',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      description: 'e.g. 周四 晚上8:00 – 9:30 / Thursdays, 8:00PM – 9:30PM',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Where',
      description: 'Optional, e.g. 在 Zoom 线上聚会 / Meet on Zoom',
      type: 'internationalizedArrayText',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'time'},
    prepare({title, subtitle}) {
      return {
        title: localizedPreviewValue(title, 'Untitled'),
        subtitle: localizedPreviewValue(subtitle),
      }
    },
  },
})

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroWelcomeMessage',
      title: 'Hero Welcome Message',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sundayTimes',
      title: 'Service Times: Sunday Gathering',
      description: 'Cards in the "Sunday Gathering" column, in this order.',
      type: 'array',
      of: [serviceTime],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'weeklyTimes',
      title: 'Service Times: During the Week',
      description: 'Cards in the "During the Week" column, in this order.',
      type: 'array',
      of: [serviceTime],
    }),
    defineField({
      name: 'footerTitle',
      title: 'Footer Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerPhone',
      title: 'Footer Phone',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerEmail',
      title: 'Footer Email',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
  ],
  // Prefer the hero title over Sanity's default field dump for the document header.
  preview: {
    select: {title: 'heroTitle'},
    prepare({title}) {
      return {title: localizedPreviewValue(title, 'Home Page')}
    },
  },
})

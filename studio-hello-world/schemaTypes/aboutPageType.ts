import {defineField, defineType} from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map Embed URL',
      description:
        'Paste the src URL from Google Maps → Share → Embed a map (https://www.google.com/maps/embed?pb=...)',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'motherChurchTitle',
      title: 'Mother Church Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'motherChurchDescription',
      title: 'Mother Church Description',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'motherChurchUrl',
      title: 'Mother Church URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'motherChurchImage',
      title: 'Mother Church Image',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})

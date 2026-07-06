import {defineField, defineType} from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroWelcomeMessage',
      title: 'Hero Welcome Message',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'missionTitle',
      title: 'Mission Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'missionDescription',
      title: 'Mission Description',
      type: 'text',
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'serviceTimes',
      title: 'Service Times',
      type: 'array',
      of: [
        defineField({
          name: 'serviceTime',
          title: 'Service Time',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'time',
              title: 'Time',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'time',
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'footerTitle',
      title: 'Footer Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerAddress',
      title: 'Footer Address',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerPhone',
      title: 'Footer Phone',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerEmail',
      title: 'Footer Email',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})

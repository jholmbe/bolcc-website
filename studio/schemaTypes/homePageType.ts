import {defineField, defineType} from 'sanity'

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
      name: 'missionTitle',
      title: 'Mission Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'missionDescription',
      title: 'Mission Description',
      type: 'internationalizedArrayText',
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
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'time',
              title: 'Time',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'internationalizedArrayText',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'time',
            },
            prepare({title, subtitle}) {
              const titleValue =
                Array.isArray(title) && title.length > 0
                  ? title.find((item: {language?: string}) => item.language === 'en')?.value ??
                    title[0]?.value
                  : 'Untitled'
              const timeValue =
                Array.isArray(subtitle) && subtitle.length > 0
                  ? subtitle.find((item: {language?: string}) => item.language === 'en')?.value ??
                    subtitle[0]?.value
                  : ''

              return {
                title: titleValue,
                subtitle: timeValue,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'footerTitle',
      title: 'Footer Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'footerAddress',
      title: 'Footer Address',
      type: 'internationalizedArrayText',
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
})

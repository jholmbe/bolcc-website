import {defineField, defineType} from 'sanity'

// LINE is the editor. These documents are created/updated by the website webhook.
// Fields are read-only in Studio so a stray edit cannot desync the LINE message id.
export const announcementType = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'lineMessageId',
      title: 'LINE Message ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'textLineMessageId',
      title: 'LINE Text Message ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      readOnly: true,
      of: [
        defineField({
          name: 'announcementImage',
          title: 'Image',
          type: 'object',
          fields: [
            defineField({
              name: 'lineMessageId',
              title: 'LINE Message ID',
              type: 'string',
              readOnly: true,
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              readOnly: true,
            }),
          ],
          preview: {
            select: {title: 'lineMessageId', media: 'image'},
            prepare({title, media}) {
              return {title: title ?? 'Image', media}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'groupId',
      title: 'LINE Group ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'userId',
      title: 'LINE User ID',
      type: 'string',
      readOnly: true,
    }),
  ],
  preview: {
    select: {title: 'text', subtitle: 'publishedAt', media: 'images.0.image'},
    prepare({title, subtitle, media}) {
      return {
        title: title?.slice(0, 80) || '(image)',
        subtitle,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published, newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})

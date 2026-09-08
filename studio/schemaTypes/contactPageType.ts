import {defineField, defineType} from 'sanity'

import {localizedPreviewValue} from './localizedPreview'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'responseDescription',
      title: 'Response Description',
      description: 'Who will respond and when visitors should expect a reply.',
      type: 'internationalizedArrayText',
    }),
  ],
  // Without this, Studio stringifies the internationalizedArray `title`/`email`
  // fields into the document header (e.g. "title: [{language:…, value:…}], …").
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: localizedPreviewValue(title, 'Contact Page')}
    },
  },
})

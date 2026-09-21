import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'productSlug', 'rating', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'productSlug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
    },
    {
      name: 'petNameOrBreed',
      type: 'text',
      defaultValue: 'Beloved Pet',
    },
    {
      name: 'helpfulCount',
      type: 'number',
      defaultValue: 4,
    },
  ],
}

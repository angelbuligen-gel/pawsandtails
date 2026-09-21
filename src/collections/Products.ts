import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'petType', 'price', 'stock', 'rating'],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Pet Food & Treats 🥩', value: 'Pet Food & Treats' },
        { label: 'Accessories & Collars 🎀', value: 'Accessories & Collars' },
        { label: 'Vitamins & Healthcare 💊', value: 'Vitamins & Healthcare' },
        { label: 'Toys & Play 🎾', value: 'Toys & Play' },
        { label: 'Grooming & Hygiene 🛁', value: 'Grooming & Hygiene' },
      ],
      required: true,
    },
    {
      name: 'petType',
      type: 'select',
      options: [
        { label: 'Dogs 🐶', value: 'Dog' },
        { label: 'Cats 🐱', value: 'Cat' },
        { label: 'Birds 🦜', value: 'Bird' },
        { label: 'Fish 🐠', value: 'Fish' },
        { label: 'Small Pets 🐹', value: 'Small Pet' },
        { label: 'All Pets 🐾', value: 'All Pets' },
      ],
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'originalPrice',
      type: 'number',
      min: 0,
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 25,
      min: 0,
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 5.0,
      min: 1,
      max: 5,
    },
    {
      name: 'reviewsCount',
      type: 'number',
      defaultValue: 12,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
    },
    {
      name: 'imageUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'keyBenefits',
      type: 'json',
    },
    {
      name: 'ingredients',
      type: 'textarea',
    },
    {
      name: 'usageGuide',
      type: 'textarea',
    },
    {
      name: 'weightSize',
      type: 'text',
    },
    {
      name: 'brand',
      type: 'text',
      defaultValue: 'Paws & Tails Choice',
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

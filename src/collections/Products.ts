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
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { getAivenPool } = await import('@/lib/aiven')
          const pool = getAivenPool()
          await pool.query(
            `INSERT INTO products (
              title, slug, category_name, pet_type, price, original_price, stock, 
              rating, reviews_count, sku, image_url, excerpt, description, 
              key_benefits, ingredients, usage_guide, weight_size, brand, is_featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              title=VALUES(title),
              category_name=VALUES(category_name),
              pet_type=VALUES(pet_type),
              price=VALUES(price),
              original_price=VALUES(original_price),
              stock=VALUES(stock),
              rating=VALUES(rating),
              reviews_count=VALUES(reviews_count),
              sku=VALUES(sku),
              image_url=VALUES(image_url),
              excerpt=VALUES(excerpt),
              description=VALUES(description),
              key_benefits=VALUES(key_benefits),
              ingredients=VALUES(ingredients),
              usage_guide=VALUES(usage_guide),
              weight_size=VALUES(weight_size),
              brand=VALUES(brand),
              is_featured=VALUES(is_featured)`,
            [
              doc.title,
              doc.slug,
              doc.category,
              doc.petType,
              doc.price,
              doc.originalPrice || null,
              doc.stock ?? 25,
              doc.rating ?? 5.0,
              doc.reviewsCount ?? 12,
              doc.sku,
              doc.imageUrl,
              doc.excerpt || null,
              doc.description || null,
              typeof doc.keyBenefits === 'string' ? doc.keyBenefits : JSON.stringify(doc.keyBenefits || []),
              doc.ingredients || null,
              doc.usageGuide || null,
              doc.weightSize || null,
              doc.brand || 'Paws & Tails Choice',
              doc.isFeatured ? 1 : 0,
            ]
          )
          console.log(`[Payload Sync] Synced product "${doc.title}" to Aiven MySQL`)
        } catch (err) {
          console.error('[Payload Sync] Error syncing product to Aiven MySQL:', err)
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          const { getAivenPool } = await import('@/lib/aiven')
          const pool = getAivenPool()
          await pool.query('DELETE FROM products WHERE slug = ?', [doc.slug])
          console.log(`[Payload Sync] Deleted product "${doc.slug}" from Aiven MySQL`)
        } catch (err) {
          console.error('[Payload Sync] Error deleting product from Aiven MySQL:', err)
        }
      },
    ],
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

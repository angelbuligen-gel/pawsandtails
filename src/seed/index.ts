import { initAivenTables, getAivenPool } from '../lib/aiven'
import { ALL_25_PRODUCTS } from './allProductsData'

export async function seedDatabase() {
  console.log('🐾 Initializing Paws & Tails Pet Shop Database (Aiven MySQL cmspawsandtails)...')

  // 1. Ensure tables exist in Aiven MySQL
  try {
    await initAivenTables()
    console.log('✅ Aiven MySQL tables verified in cmspawsandtails')
  } catch (err) {
    console.error('⚠️ Note on Aiven table init:', err)
  }

  // 2. Sync all 25 products and categories to Aiven MySQL
  try {
    const pool = getAivenPool()

    // Unique categories
    const categories = [
      { name: 'Pet Food & Treats', slug: 'pet-food-treats', description: 'Nutritious dry kibble, gourmet wet food, and training treats', icon: '🥩' },
      { name: 'Accessories & Collars', slug: 'accessories-collars', description: 'No-pull harnesses, safe breakaway collars, perches, and wheels', icon: '🎀' },
      { name: 'Vitamins & Healthcare', slug: 'vitamins-healthcare', description: 'Salmon oils, calcium chews, hairball paste, and water conditioners', icon: '💊' },
      { name: 'Toys & Play', slug: 'toys-play', description: 'Interactive smart toys, chew bones, shredder bells, and tunnels', icon: '🎾' },
      { name: 'Grooming & Hygiene', slug: 'grooming-hygiene', description: 'Oatmeal shampoos, waterless baths, slicker brushes, and clumping litter', icon: '🛁' },
    ]

    for (const cat of categories) {
      await pool.query(
        `INSERT INTO categories (name, slug, description, icon)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), icon=VALUES(icon)`,
        [cat.name, cat.slug, cat.description, cat.icon]
      )
    }
    console.log('✅ Categories synced to Aiven MySQL')

    for (const p of ALL_25_PRODUCTS) {
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
          p.title,
          p.slug,
          p.category,
          p.petType,
          p.price,
          p.originalPrice,
          p.stock,
          p.rating,
          p.reviewsCount,
          p.sku,
          p.imageUrl,
          p.excerpt,
          p.description,
          JSON.stringify(p.keyBenefits),
          p.ingredients,
          p.usageGuide,
          p.weightSize,
          p.brand,
          p.isFeatured ? 1 : 0,
        ]
      )

      // Insert starter community review if none exists
      const [existingReviews]: any = await pool.query(
        'SELECT id FROM reviews WHERE product_slug = ? LIMIT 1',
        [p.slug]
      )
      if (!existingReviews || existingReviews.length === 0) {
        await pool.query(
          `INSERT INTO reviews (product_slug, author_name, rating, comment, pet_name_or_breed, helpful_count)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            p.slug,
            'Maria Santos',
            5,
            `My ${p.petType.toLowerCase()} absolutely loves this! Super high quality and arrived fast with J&T Express.`,
            `${p.petType} Parent`,
            5,
          ]
        )
      }
    }

    console.log('🎉 Successfully synced all 25 products & starter reviews into Aiven MySQL "cmspawsandtails"!')
  } catch (err) {
    console.error('Error syncing to Aiven MySQL:', err)
  }
}

// Auto-run when executed directly via tsx/node
if (process.argv[1]?.endsWith('seed/index.ts') || process.argv[1]?.endsWith('seed/index.js')) {
  seedDatabase().then(() => process.exit(0)).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

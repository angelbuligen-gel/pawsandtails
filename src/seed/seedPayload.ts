import { getPayload } from 'payload'
import config from '../payload.config'
import { ALL_25_PRODUCTS } from './allProductsData'

export async function seedPayload() {
  console.log('🐾 Seeding Payload CMS Collections (SQLite)...')
  const payload = await getPayload({ config })

  // 1. Seed Categories in Payload
  const categories = [
    { name: 'Pet Food & Treats', slug: 'pet-food-treats', description: 'Nutritious dry kibble, gourmet wet food, and training treats', icon: '🥩' },
    { name: 'Accessories & Collars', slug: 'accessories-collars', description: 'No-pull harnesses, safe breakaway collars, perches, and wheels', icon: '🎀' },
    { name: 'Vitamins & Healthcare', slug: 'vitamins-healthcare', description: 'Salmon oils, calcium chews, hairball paste, and water conditioners', icon: '💊' },
    { name: 'Toys & Play', slug: 'toys-play', description: 'Interactive smart toys, chew bones, shredder bells, and tunnels', icon: '🎾' },
    { name: 'Grooming & Hygiene', slug: 'grooming-hygiene', description: 'Oatmeal shampoos, waterless baths, slicker brushes, and clumping litter', icon: '🛁' },
  ]

  for (const cat of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'categories',
        data: cat,
      })
      console.log(`  ✓ Created Category in Payload: ${cat.name}`)
    }
  }

  // 2. Seed All 25 Products in Payload
  let createdCount = 0
  let updatedCount = 0

  for (const p of ALL_25_PRODUCTS) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })

    const productData = {
      title: p.title,
      slug: p.slug,
      category: p.category,
      petType: p.petType,
      price: p.price,
      originalPrice: p.originalPrice,
      stock: p.stock,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      sku: p.sku,
      imageUrl: p.imageUrl,
      excerpt: p.excerpt,
      description: p.description,
      keyBenefits: p.keyBenefits,
      ingredients: p.ingredients,
      usageGuide: p.usageGuide,
      weightSize: p.weightSize,
      brand: p.brand,
      isFeatured: Boolean(p.isFeatured),
    }

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'products',
        data: productData,
      })
      createdCount++
    } else {
      await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        data: productData,
      })
      updatedCount++
    }
  }

  console.log(`🎉 Payload CMS Products: ${createdCount} created, ${updatedCount} updated. Total: 25 products in Payload!`)
}

if (process.argv[1]?.endsWith('seedPayload.ts')) {
  seedPayload().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
}

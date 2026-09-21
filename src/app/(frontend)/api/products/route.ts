import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getProductsFromAiven } from '@/lib/aiven'
import { ALL_25_PRODUCTS } from '@/seed/allProductsData'
import { ensureDatabaseSeeded } from '@/lib/ensureSeed'

export async function GET() {
  // Trigger background check to auto-seed if clean instance
  ensureDatabaseSeeded().catch(() => {})

  // 1. Primary Source: Payload CMS (Admin panel data)
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'products',
      limit: 100,
      sort: '-isFeatured',
    })

    if (result.docs && result.docs.length > 0) {
      return NextResponse.json({
        source: 'payload_admin',
        products: result.docs,
      })
    }
  } catch (payloadErr) {
    console.warn('[API /products] Payload query notice, trying Aiven fallback:', payloadErr)
  }

  // 2. Secondary Source: Aiven Cloud MySQL
  try {
    const rows = await getProductsFromAiven()
    if (rows && rows.length > 0) {
      return NextResponse.json({
        source: 'aiven_mysql',
        products: rows,
      })
    }
  } catch (aivenErr) {
    console.warn('[API /products] Aiven query notice, using static fallback:', aivenErr)
  }

  // 3. Fallback: Bundled product inventory
  return NextResponse.json({
    source: 'static_fallback',
    products: ALL_25_PRODUCTS,
  })
}

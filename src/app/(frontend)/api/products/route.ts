import { NextResponse } from 'next/server'
import { getProductsFromAiven } from '@/lib/aiven'
import { ALL_25_PRODUCTS } from '@/seed/allProductsData'

export async function GET() {
  try {
    const rows = await getProductsFromAiven()
    if (rows && rows.length > 0) {
      return NextResponse.json({ products: rows })
    }
  } catch {
    // fallback
  }
  return NextResponse.json({ products: ALL_25_PRODUCTS })
}

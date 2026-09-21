import { NextRequest, NextResponse } from 'next/server'
import { insertReviewToAiven, getAivenPool, initAivenTables } from '@/lib/aiven'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productSlug = searchParams.get('productSlug') || searchParams.get('slug')

  try {
    const p = getAivenPool()

    if (productSlug) {
      const [rows] = await p.query(
        `SELECT * FROM reviews WHERE product_slug = ? ORDER BY created_at DESC LIMIT 20`,
        [productSlug]
      )
      return NextResponse.json({ reviews: rows })
    }

    const [rows] = await p.query(
      `SELECT * FROM reviews ORDER BY created_at DESC LIMIT 50`
    )
    return NextResponse.json({ reviews: rows })
  } catch (err: any) {
    console.error('GET /api/reviews error:', err)
    return NextResponse.json({ reviews: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productSlug, authorName, rating, comment, petNameOrBreed, anonymous } = body

    if (!productSlug || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 })
    }

    // If anonymous, use 'Anonymous' as name; otherwise use provided name (or fallback)
    const displayName = anonymous ? 'Anonymous' : (authorName?.trim() || 'Anonymous')

    try { await initAivenTables() } catch { /* noop */ }

    await insertReviewToAiven({
      productSlug,
      authorName: displayName,
      rating: Number(rating),
      comment: comment.trim(),
      petNameOrBreed: petNameOrBreed?.trim() || 'Beloved Pet',
    })

    return NextResponse.json({
      success: true,
      message: 'Review posted successfully!',
      anonymous: displayName === 'Anonymous',
    })
  } catch (err: any) {
    console.error('POST /api/reviews error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to post review.' }, { status: 500 })
  }
}

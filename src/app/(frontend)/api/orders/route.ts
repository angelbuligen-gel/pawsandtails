import { NextRequest, NextResponse } from 'next/server'
import { insertOrderToAiven, initAivenTables } from '@/lib/aiven'

function generateOrderNumber(): string {
  const prefix = 'PT'
  const date = new Date()
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const random = Math.floor(Math.random() * 90000) + 10000
  return `${prefix}-${ymd}-${random}`
}

function generateTrackingNumber(): string {
  const prefix = 'JT'
  const random = Math.floor(Math.random() * 9000000000) + 1000000000
  return `${prefix}${random}PH`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      phone,
      email,
      address,
      city,
      notes,
      paymentMethod,
      paymentReference,
      items,
      subtotal,
      shippingFee,
    } = body

    if (!name || !phone || !address || !city || !paymentMethod || !items) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const orderNumber = generateOrderNumber()
    const trackingNumber = generateTrackingNumber()
    const totalAmount = Number(subtotal) + Number(shippingFee)

    // Ensure tables exist
    try { await initAivenTables() } catch { /* noop */ }

    await insertOrderToAiven({
      orderNumber,
      customerName: name,
      customerPhone: phone,
      customerEmail: email || undefined,
      shippingAddress: address,
      cityProvince: city,
      courier: 'J&T Express Philippines',
      paymentMethod,
      paymentReference: paymentReference || undefined,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      totalAmount,
      status: paymentMethod === 'cod' ? 'confirmed' : 'payment_verifying',
      trackingNumber,
      items,
      notes: notes || undefined,
    })

    return NextResponse.json({
      success: true,
      orderNumber,
      trackingNumber,
      totalAmount,
      courier: 'J&T Express Philippines',
      estimatedDelivery: city.toLowerCase().includes('manila') || city.toLowerCase().includes('metro')
        ? '1-2 business days'
        : '3-5 business days',
      message: `Order ${orderNumber} placed successfully! Track via J&T: ${trackingNumber}`,
    })
  } catch (err: any) {
    console.error('POST /api/orders error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to create order.' }, { status: 500 })
  }
}

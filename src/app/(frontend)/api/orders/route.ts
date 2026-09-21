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

    // 1. Dual-write to Payload CMS Orders collection
    try {
      const { getPayload } = await import('payload')
      const config = (await import('@payload-config')).default
      const payload = await getPayload({ config })
      await payload.create({
        collection: 'orders',
        data: {
          orderNumber,
          customerName: name,
          customerPhone: phone,
          customerEmail: email || undefined,
          shippingAddress: address,
          cityProvince: city,
          courier: 'J&T Express Philippines',
          paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'maya' ? 'Maya' : paymentMethod === 'card' ? 'Credit / Debit Card' : 'GCash',
          paymentReference: paymentReference || undefined,
          subtotal: Number(subtotal),
          shippingFee: Number(shippingFee),
          totalAmount,
          status: paymentMethod === 'cod' ? 'kit_preparing' : 'payment_verifying',
          trackingNumber,
          items,
          notes: notes || undefined,
        },
      })
      console.log(`[Order Created] Stored order #${orderNumber} into Payload CMS`)
    } catch (payloadOrderErr) {
      console.warn('[Order Created] Notice on Payload order creation:', payloadOrderErr)
    }

    // 2. Dual-write to Aiven Cloud MySQL
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

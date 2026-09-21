import { NextRequest, NextResponse } from 'next/server'
import { getOrderFromAiven } from '@/lib/aiven'

// Status steps for tracking timeline
const STATUS_STEPS = [
  { key: 'payment_verifying', label: 'Payment Verifying', icon: '💳', desc: 'Your payment is being verified.' },
  { key: 'confirmed', label: 'Order Confirmed', icon: '✅', desc: 'Order confirmed and being prepared.' },
  { key: 'processing', label: 'Processing', icon: '📦', desc: 'Items are being packed at our warehouse.' },
  { key: 'shipped', label: 'Shipped', icon: '🚚', desc: 'Your parcel has been picked up by J&T Express.' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🏍️', desc: 'Your parcel is out for delivery today!' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Successfully delivered. Enjoy!' },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || searchParams.get('orderNumber') || searchParams.get('tracking')

  if (!query || query.length < 3) {
    return NextResponse.json({ error: 'Please provide at least 3 characters to search.' }, { status: 400 })
  }

  try {
    const orders = await getOrderFromAiven(query)

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        found: false,
        message: 'No orders found for this query. Please check your order number, tracking number, phone or name.',
      })
    }

    const mapped = orders.map((order: any) => {
      const currentStatusIdx = STATUS_STEPS.findIndex((s) => s.key === order.status)
      const steps = STATUS_STEPS.map((step, idx) => ({
        ...step,
        completed: idx <= currentStatusIdx,
        active: idx === currentStatusIdx,
      }))

      return {
        id: order.id,
        orderNumber: order.order_number,
        trackingNumber: order.tracking_number,
        courier: order.courier || 'J&T Express Philippines',
        status: order.status,
        statusLabel: STATUS_STEPS.find((s) => s.key === order.status)?.label || order.status,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        shippingAddress: order.shipping_address,
        cityProvince: order.city_province,
        paymentMethod: order.payment_method,
        paymentReference: order.payment_reference,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shipping_fee),
        totalAmount: Number(order.total_amount),
        items: (() => {
          try { return JSON.parse(order.items_json || '[]') } catch { return [] }
        })(),
        notes: order.notes,
        createdAt: order.created_at,
        steps,
      }
    })

    return NextResponse.json({ found: true, orders: mapped })
  } catch (err: any) {
    console.error('GET /api/orders/track error:', err)
    return NextResponse.json({ error: 'Failed to look up order.' }, { status: 500 })
  }
}

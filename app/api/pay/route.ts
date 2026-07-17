import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cashfreeEnabled, cashfreeMode, createCashfreeOrder } from '@/lib/cashfree'

export const dynamic = 'force-dynamic'

/* Checkout asks this to decide between the Cashfree flow and the manual QR fallback */
export async function GET() {
  return NextResponse.json({ enabled: cashfreeEnabled(), mode: cashfreeMode() })
}

/* Create a Cashfree payment session for an existing unpaid order */
export async function POST(req: NextRequest) {
  if (!cashfreeEnabled()) {
    return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 })
  }
  try {
    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.payment === 'paid') return NextResponse.json({ error: 'Order already paid' }, { status: 400 })

    const origin = req.headers.get('origin') || `https://${req.headers.get('host') ?? 'www.iluminatees.com'}`
    const cf = await createCashfreeOrder({
      orderId: order.id,
      amount: order.total,
      customerName: order.customer,
      customerPhone: order.phone,
      returnUrl: `${origin}/checkout/return?order_id={order_id}`,
      notifyUrl: `${origin}/api/webhooks/cashfree`,
      note: `ILUMINATEES order ${order.id}`,
    })

    return NextResponse.json({ paymentSessionId: cf.payment_session_id, mode: cashfreeMode() })
  } catch (e) {
    console.error('POST /api/pay error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Payment session failed' }, { status: 500 })
  }
}

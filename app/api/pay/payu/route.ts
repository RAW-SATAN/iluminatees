import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { payuEnabled, payuMode, buildPayuFormParams, PAYU_BASE } from '@/lib/payu'

export const dynamic = 'force-dynamic'

/*
 * POST /api/pay/payu
 * Accepts { orderId } — fetches the order, builds PayU form params + hash,
 * returns them to the client. The client renders a hidden <form> and auto-submits
 * it to PayU's payment URL.
 */
export async function POST(req: NextRequest) {
  if (!payuEnabled()) {
    return NextResponse.json({ error: 'PayU not configured' }, { status: 503 })
  }

  try {
    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.payment === 'paid') return NextResponse.json({ error: 'Order already paid' }, { status: 400 })

    const origin =
      req.headers.get('origin') ||
      `https://${req.headers.get('host') ?? 'www.iluminatees.com'}`

    const formParams = buildPayuFormParams({
      orderId: order.id,
      amount: order.total,
      customerName: order.customer,
      customerPhone: order.phone,
      customerEmail: `${order.phone}@iluminatees.com`, // PayU requires email; use phone-based fallback
      returnUrl: `${origin}/checkout/return?order_id=${encodeURIComponent(order.id)}`,
      failUrl: `${origin}/checkout/return?order_id=${encodeURIComponent(order.id)}&failed=1`,
      notifyUrl: `${origin}/api/webhooks/payu`,
    })

    return NextResponse.json({
      payuUrl: PAYU_BASE,
      formParams,
      mode: payuMode(),
    })
  } catch (e) {
    console.error('POST /api/pay/payu error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'PayU session failed' },
      { status: 500 },
    )
  }
}

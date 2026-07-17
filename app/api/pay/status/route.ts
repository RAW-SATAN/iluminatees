import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cashfreeEnabled, getCashfreeOrderStatus, toDbOrderId } from '@/lib/cashfree'

export const dynamic = 'force-dynamic'

/*
 * Called by the checkout return page. Confirms payment with Cashfree
 * directly (belt-and-braces alongside the webhook) and marks the DB
 * order paid. Public, but only reveals status for a specific order id.
 */
export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get('orderId')?.trim()
    if (!raw) return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    const id = toDbOrderId(raw)

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    let paid = order.payment === 'paid'

    if (!paid && cashfreeEnabled()) {
      try {
        const cf = await getCashfreeOrderStatus(id)
        if (cf.order_status === 'PAID') {
          await prisma.order.update({ where: { id }, data: { payment: 'paid' } })
          paid = true
        }
      } catch (e) {
        console.error('Cashfree status check failed:', e)
      }
    }

    return NextResponse.json({
      id: order.id,
      paid,
      total: order.total,
      items: order.items,
      customer: order.customer,
    })
  } catch (e) {
    console.error('GET /api/pay/status error:', e)
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 })
  }
}

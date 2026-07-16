import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/*
 * Public order tracking: requires BOTH the order id and the phone number
 * used on the order, so customers can only look up their own orders.
 */
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')?.trim()
    const phone = req.nextUrl.searchParams.get('phone')?.trim()
    if (!id || !phone) return NextResponse.json({ error: 'id and phone required' }, { status: 400 })

    const normalized = id.startsWith('#') ? id : `#${id}`
    const order = await prisma.order.findUnique({ where: { id: normalized } })
    if (!order || order.phone !== phone) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      payment: order.payment,
      total: order.total,
      items: order.items,
      city: order.city,
      date: order.createdAt,
    })
  } catch (e) {
    console.error('GET /api/orders/track error:', e)
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 })
  }
}

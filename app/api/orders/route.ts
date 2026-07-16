import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(orders)
  } catch (e) {
    console.error('GET /api/orders error:', e)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, customer, phone, address, city, items, total, payment } = body

    if (!customer || !phone || !address || !city || !items || total == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        id: id || `#${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
        customer,
        phone,
        address,
        city,
        items,
        total,
        payment: payment || 'unpaid',
        status: 'pending',
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (e) {
    console.error('POST /api/orders error:', e)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(order)
  } catch (e) {
    console.error('PATCH /api/orders error:', e)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

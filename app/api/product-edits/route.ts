import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/adminAuth'

/*
 * Product edits (price/name/stock/etc. overrides made in the admin panel)
 * stored in the DB so every visitor sees them — not just the owner's browser.
 * Shape: { [productId]: ProductEdit }
 */
const KEY = 'product_edits'

export async function GET() {
  try {
    const row = await prisma.storeSetting.findUnique({ where: { key: KEY } })
    if (!row) return NextResponse.json({})
    try { return NextResponse.json(JSON.parse(row.value)) } catch { return NextResponse.json({}) }
  } catch (e) {
    console.error('GET /api/product-edits error:', e)
    return NextResponse.json({}, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected an object map of edits' }, { status: 400 })
    }
    const value = JSON.stringify(body)
    await prisma.storeSetting.upsert({
      where: { key: KEY },
      update: { value },
      create: { key: KEY, value },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('PUT /api/product-edits error:', e)
    return NextResponse.json({ error: 'Failed to save edits' }, { status: 500 })
  }
}

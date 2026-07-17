import { NextRequest, NextResponse } from 'next/server'
import { prisma, ensureStoreSetting } from '@/lib/db'
import { isAdmin } from '@/lib/adminAuth'

/* Settings safe to expose to the storefront; everything else is admin-only */
const PUBLIC_KEYS = new Set(['cod_enabled'])

/* Never cache — checkout must always see the latest COD toggle */
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await ensureStoreSetting()
    const all = await prisma.storeSetting.findMany()
    const admin = isAdmin(req)
    const map: Record<string, string> = {}
    for (const s of all) {
      if (admin || PUBLIC_KEYS.has(s.key)) map[s.key] = s.value
    }
    return NextResponse.json(map)
  } catch (e) {
    console.error('GET /api/settings error:', e)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { key, value } = body
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

    await ensureStoreSetting()
    await prisma.storeSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('PUT /api/settings error:', e)
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
  }
}

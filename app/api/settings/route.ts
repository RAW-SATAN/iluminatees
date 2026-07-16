import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const all = await prisma.storeSetting.findMany()
    const map: Record<string, string> = {}
    for (const s of all) map[s.key] = s.value
    return NextResponse.json(map)
  } catch (e) {
    console.error('GET /api/settings error:', e)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { key, value } = body
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

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

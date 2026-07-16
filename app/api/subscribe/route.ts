import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/adminAuth'

const KEY = 'newsletter_subscribers'

interface Subscriber { email: string; date: string }

async function readList(): Promise<Subscriber[]> {
  const row = await prisma.storeSetting.findUnique({ where: { key: KEY } })
  if (!row) return []
  try { return JSON.parse(row.value) } catch { return [] }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json(await readList())
  } catch (e) {
    console.error('GET /api/subscribe error:', e)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const clean = String(email ?? '').trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const list = await readList()
    if (!list.some(s => s.email === clean)) {
      list.push({ email: clean, date: new Date().toISOString() })
      await prisma.storeSetting.upsert({
        where: { key: KEY },
        update: { value: JSON.stringify(list) },
        create: { key: KEY, value: JSON.stringify(list) },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('POST /api/subscribe error:', e)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

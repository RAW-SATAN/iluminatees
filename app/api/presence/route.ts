import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/*
 * Real live-visitor tracking. Storefront pages send an anonymous
 * heartbeat (random session id, no personal data); the admin dashboard
 * counts ids seen in the last ACTIVE_WINDOW.
 */
const ACTIVE_WINDOW_MS = 3 * 60_000
const STALE_MS = 30 * 60_000

let presenceReady = false
async function ensurePresence() {
  if (presenceReady) return
  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS "Presence" ("id" TEXT NOT NULL PRIMARY KEY, "lastSeen" BIGINT NOT NULL)'
  )
  presenceReady = true
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()
    const clean = String(id ?? '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64)
    if (!clean) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await ensurePresence()
    const now = Date.now()
    await prisma.$executeRawUnsafe(
      'INSERT INTO "Presence" ("id", "lastSeen") VALUES ($1, $2) ON CONFLICT ("id") DO UPDATE SET "lastSeen" = $2',
      clean, now
    )
    /* occasional cleanup of long-gone sessions */
    if (now % 10 < 2) {
      await prisma.$executeRawUnsafe('DELETE FROM "Presence" WHERE "lastSeen" < $1', now - STALE_MS)
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('POST /api/presence error:', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await ensurePresence()
    const rows = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      'SELECT COUNT(*)::bigint AS count FROM "Presence" WHERE "lastSeen" > $1',
      Date.now() - ACTIVE_WINDOW_MS
    )
    return NextResponse.json({ live: Number(rows[0]?.count ?? 0) })
  } catch (e) {
    console.error('GET /api/presence error:', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

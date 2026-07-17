import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyCashfreeWebhook, toDbOrderId } from '@/lib/cashfree'

export const dynamic = 'force-dynamic'

/* Cashfree pings GET to verify endpoint reachability */
export async function GET() {
  return Response.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-webhook-signature') || ''
  const timestamp = req.headers.get('x-webhook-timestamp') || ''

  /* Cashfree test pings arrive without a signature */
  if (signature && !verifyCashfreeWebhook(rawBody, signature, timestamp)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }
  if (!rawBody || !rawBody.trim()) return Response.json({ ok: true })

  let event: Record<string, unknown>
  try { event = JSON.parse(rawBody) } catch { return Response.json({ ok: true }) }

  if (event.type === 'PAYMENT_SUCCESS_WEBHOOK') {
    const data = event.data as Record<string, unknown> | undefined
    const order = data?.order as Record<string, unknown> | undefined
    const cfOrderId = order?.order_id as string | undefined
    if (cfOrderId) {
      const id = toDbOrderId(cfOrderId)
      try {
        const existing = await prisma.order.findUnique({ where: { id } })
        if (existing && existing.payment !== 'paid') {
          await prisma.order.update({ where: { id }, data: { payment: 'paid' } })
        }
      } catch (e) {
        console.error('Cashfree webhook order update failed:', e)
      }
    }
  }

  return Response.json({ ok: true })
}

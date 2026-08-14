import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPayuHash, toDbOrderId } from '@/lib/payu'

export const dynamic = 'force-dynamic'

/* PayU pings GET to verify endpoint is reachable */
export async function GET() {
  return Response.json({ ok: true })
}

/*
 * POST /api/webhooks/payu
 * PayU sends form-encoded data (application/x-www-form-urlencoded) to this URL
 * after every payment attempt (success or failure).
 *
 * We verify the reverse hash, then mark the order as paid if status is "success".
 */
export async function POST(req: NextRequest) {
  let body: URLSearchParams
  try {
    const text = await req.text()
    body = new URLSearchParams(text)
  } catch {
    return Response.json({ ok: true })
  }

  const status = body.get('status') ?? ''
  const txnid = body.get('txnid') ?? ''
  const amount = body.get('amount') ?? ''
  const productinfo = body.get('productinfo') ?? ''
  const firstname = body.get('firstname') ?? ''
  const email = body.get('email') ?? ''
  const hash = body.get('hash') ?? ''
  const udf1 = body.get('udf1') ?? ''
  const udf2 = body.get('udf2') ?? ''
  const udf3 = body.get('udf3') ?? ''
  const udf4 = body.get('udf4') ?? ''
  const udf5 = body.get('udf5') ?? ''

  /* Verify hash — reject tampered responses */
  const valid = verifyPayuHash({ txnid, amount, productinfo, firstname, email, status, hash, udf1, udf2, udf3, udf4, udf5 })
  if (!valid) {
    console.warn('PayU webhook: invalid hash for txnid', txnid)
    return Response.json({ error: 'Invalid hash' }, { status: 401 })
  }

  if (status === 'success' && txnid) {
    const id = toDbOrderId(txnid)
    try {
      const existing = await prisma.order.findUnique({ where: { id } })
      if (existing && existing.payment !== 'paid') {
        await prisma.order.update({ where: { id }, data: { payment: 'paid' } })
      }
    } catch (e) {
      console.error('PayU webhook order update failed:', e)
    }
  }

  return Response.json({ ok: true })
}

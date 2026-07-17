import crypto from 'crypto'

/*
 * Cashfree Payment Gateway (same merchant account as drpshippr.io).
 * Needs these env vars on Vercel:
 *   CASHFREE_APP_ID      — from Cashfree dashboard
 *   CASHFREE_SECRET_KEY  — from Cashfree dashboard
 *   CASHFREE_ENV         — PRODUCTION (or SANDBOX for testing)
 * If they're missing, checkout falls back to the manual UPI QR flow.
 */

const BASE = process.env.CASHFREE_ENV === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg'

function headers() {
  return {
    'x-api-version': '2023-08-01',
    'x-client-id': process.env.CASHFREE_APP_ID!,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
    'Content-Type': 'application/json',
  }
}

export function cashfreeEnabled(): boolean {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY)
}

export function cashfreeMode(): 'production' | 'sandbox' {
  return process.env.CASHFREE_ENV === 'PRODUCTION' ? 'production' : 'sandbox'
}

/* Our DB order ids look like "#MBX4K201" — Cashfree ids can't contain '#' */
export function toCfOrderId(dbId: string) { return dbId.replace(/^#/, '') }
export function toDbOrderId(cfId: string) { return cfId.startsWith('#') ? cfId : `#${cfId}` }

export async function createCashfreeOrder(params: {
  orderId: string
  amount: number
  customerName: string
  customerPhone: string
  returnUrl: string
  notifyUrl: string
  note: string
}) {
  const body = {
    order_id: toCfOrderId(params.orderId),
    order_amount: params.amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: `cust_${params.customerPhone}`,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
    },
    order_meta: {
      return_url: params.returnUrl,
      notify_url: params.notifyUrl,
    },
    order_note: params.note,
  }

  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Cashfree order creation failed')
  }

  return res.json() as Promise<{
    cf_order_id: string
    order_id: string
    payment_session_id: string
    order_status: string
  }>
}

export async function getCashfreeOrderStatus(dbOrderId: string) {
  const res = await fetch(`${BASE}/orders/${toCfOrderId(dbOrderId)}`, { headers: headers(), cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Cashfree status check failed')
  }
  return res.json() as Promise<{ order_id: string; order_status: string; order_amount: number }>
}

export function verifyCashfreeWebhook(rawBody: string, signature: string, timestamp: string): boolean {
  const data = timestamp + rawBody
  const expected = crypto
    .createHmac('sha256', process.env.CASHFREE_SECRET_KEY!)
    .update(data)
    .digest('base64')
  return expected === signature
}

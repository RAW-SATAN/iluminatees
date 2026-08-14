import { createHash } from 'crypto'

/*
 * PayU Payment Gateway
 * Needs these env vars on Vercel:
 *   PAYU_MERCHANT_KEY   — from PayU dashboard (e.g. "gtKFFx")
 *   PAYU_MERCHANT_SALT  — from PayU dashboard
 *   PAYU_ENV            — PRODUCTION (or SANDBOX for testing)
 *
 * If they're missing, checkout falls back to the manual UPI QR flow.
 *
 * PayU Standard Redirect flow:
 *   1. Server generates a SHA-512 hash using key|txnid|amount|productinfo|firstname|email|||||||||||salt
 *   2. Client submits a hidden HTML form to PayU's payment URL
 *   3. PayU redirects back to surl (success) / furl (failure)
 *   4. PayU also hits the webhook (notify_url) with the payment result
 */

export const PAYU_BASE =
  process.env.PAYU_ENV === 'PRODUCTION'
    ? 'https://secure.payu.in/_payment'
    : 'https://test.payu.in/_payment'

export function payuEnabled(): boolean {
  return Boolean(process.env.PAYU_MERCHANT_KEY && process.env.PAYU_MERCHANT_SALT)
}

export function payuMode(): 'production' | 'sandbox' {
  return process.env.PAYU_ENV === 'PRODUCTION' ? 'production' : 'sandbox'
}

/* Strip '#' from our DB order IDs — PayU txnid must be alphanumeric */
export function toPayuTxnId(dbId: string): string {
  return dbId.replace(/^#/, '')
}
export function toDbOrderId(txnId: string): string {
  return txnId.startsWith('#') ? txnId : `#${txnId}`
}

/*
 * Generate PayU payment hash (SHA-512).
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 * PayU is strict about field order — do NOT change.
 */
export function generatePayuHash(params: {
  txnid: string
  amount: string        // must be string, e.g. "499.00"
  productinfo: string
  firstname: string
  email: string
  udf1?: string
  udf2?: string
  udf3?: string
  udf4?: string
  udf5?: string
}): string {
  const key = process.env.PAYU_MERCHANT_KEY!
  const salt = process.env.PAYU_MERCHANT_SALT!
  const { txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '' } = params

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`

  return createHash('sha512').update(hashString).digest('hex')
}

/*
 * Verify PayU webhook / response hash (reverse hash).
 * Formula: sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayuHash(params: {
  txnid: string
  amount: string
  productinfo: string
  firstname: string
  email: string
  status: string
  hash: string
  udf1?: string
  udf2?: string
  udf3?: string
  udf4?: string
  udf5?: string
}): boolean {
  const key = process.env.PAYU_MERCHANT_KEY!
  const salt = process.env.PAYU_MERCHANT_SALT!
  const {
    txnid, amount, productinfo, firstname, email, status, hash,
    udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '',
  } = params

  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`
  const expected = createHash('sha512').update(hashString).digest('hex')

  return expected === hash
}

/*
 * Build all the form fields needed to POST to PayU.
 * The caller (API route) returns these; the client renders a hidden form and auto-submits.
 */
export function buildPayuFormParams(params: {
  orderId: string         // DB order id (with #)
  amount: number
  customerName: string
  customerPhone: string
  customerEmail: string
  returnUrl: string       // surl — success
  failUrl: string         // furl — failure
  notifyUrl: string       // webhook
}) {
  const key = process.env.PAYU_MERCHANT_KEY!
  const txnid = toPayuTxnId(params.orderId)
  const amount = params.amount.toFixed(2)
  const productinfo = 'ILUMINATEES Order'
  // PayU requires firstname — use first word of name
  const firstname = params.customerName.split(' ')[0] || params.customerName
  const email = params.customerEmail || 'customer@iluminatees.com'
  const phone = params.customerPhone

  const hash = generatePayuHash({ txnid, amount, productinfo, firstname, email })

  return {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    surl: params.returnUrl,
    furl: params.failUrl,
    hash,
    service_provider: 'payu_paisa',
  }
}

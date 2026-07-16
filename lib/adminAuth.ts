import { NextRequest } from 'next/server'

/*
 * Admin API auth: requests must send the admin password in the
 * `x-admin-key` header. Set ADMIN_PASSWORD in the environment
 * (Vercel → Settings → Environment Variables) to change it.
 */
export function isAdmin(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? 'ILUM2026'
  return req.headers.get('x-admin-key') === expected
}

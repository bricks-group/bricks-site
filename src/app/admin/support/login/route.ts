import { NextRequest, NextResponse } from 'next/server'
import { adminSecret, verifyAdminToken } from '@/lib/support/alert'

export const dynamic = 'force-dynamic'

/** Signed link from an alert email -> httpOnly session cookie for /admin/support. */
export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get('t')
  const url = req.nextUrl.clone()
  url.pathname = '/admin/support'
  url.search = ''
  if (!verifyAdminToken(adminSecret(), t)) {
    url.searchParams.set('e', 'link')
    return NextResponse.redirect(url)
  }
  const res = NextResponse.redirect(url)
  res.cookies.set('bricks_support_admin', t!, { httpOnly: true, secure: true, sameSite: 'lax', path: '/admin', maxAge: 7 * 86400 })
  return res
}

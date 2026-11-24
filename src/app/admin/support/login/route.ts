import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Old alert-email links land here. Never trades a URL token for a session: sign-in is on /admin/support. */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = '/admin/support'
  url.search = ''
  return NextResponse.redirect(url)
}

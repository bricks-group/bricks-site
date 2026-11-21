import { NextRequest, NextResponse } from 'next/server'
import { newsletterSecret } from '@/lib/newsletter/config'
import { alert, unsubscribeContact } from '@/lib/newsletter/resend'
import { verifyToken } from '@/lib/newsletter/token'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

/** Old links and the List-Unsubscribe URL opened in a browser land on the page (one button, so link scanners can't unsubscribe anyone). */
export async function GET(req: NextRequest) {
  const t = req.nextUrl.searchParams.get('t') || ''
  const u = req.nextUrl.clone()
  u.pathname = '/newsletter/unsubscribe'
  u.search = t ? `?t=${encodeURIComponent(t)}` : ''
  return NextResponse.redirect(u, { status: 303, headers: noStore })
}

/**
 * RFC 8058 one-click (mail apps POST "List-Unsubscribe=One-Click" to the header URL)
 * and the unsubscribe page (JSON { t }).
 */
export async function POST(req: NextRequest) {
  let t = req.nextUrl.searchParams.get('t') || ''
  const type = req.headers.get('content-type') || ''
  if (!t && type.includes('application/json')) {
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
    t = typeof b.t === 'string' ? b.t : ''
  }
  const v = verifyToken(newsletterSecret(), t, 'u')
  if (!v.ok) return NextResponse.json({ ok: false, state: 'invalid' }, { status: 400, headers: noStore })
  const r = await unsubscribeContact(v.email)
  if (!r.ok) {
    await alert('Newsletter unsubscribe failed', `An unsubscribe could not be saved (status ${r.status ?? 'none'}). CASL needs it honoured within 10 business days: check the Resend contacts key on the site.`)
    return NextResponse.json({ ok: false, state: 'error' }, { status: 502, headers: noStore })
  }
  return NextResponse.json({ ok: true, state: 'unsubscribed' }, { headers: noStore })
}

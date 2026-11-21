import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

/**
 * Coarse visitor region ({ c: country, r: region code }) for the ChatGPT ads
 * pixel consent check. Called only when the pixel would otherwise load
 * (ad-click arrival or ad-cookie confirmation), never for ordinary visits.
 * Nothing is stored or logged. Empty values mean "unknown".
 */
export function GET(req: NextRequest) {
  let c = ''
  let r = ''
  try {
    const cf = getCloudflareContext().cf as { country?: string; regionCode?: string } | undefined
    c = cf?.country || ''
    r = cf?.regionCode || ''
  } catch {
    // not on Workers (local dev / build): fall back to headers
  }
  c = c || req.headers.get('cf-ipcountry') || req.headers.get('x-vercel-ip-country') || ''
  r = r || req.headers.get('cf-region-code') || req.headers.get('x-vercel-ip-country-region') || ''
  // Test hook for previews only.
  if (process.env.BRICKS_SITE_PREVIEW) {
    const t = req.nextUrl.searchParams.get('geo')
    if (t) { const [tc, tr] = t.split('-'); c = tc || ''; r = tr || '' }
  }
  return NextResponse.json({ c: c.toUpperCase(), r: r.toUpperCase() }, { headers: { 'Cache-Control': 'private, no-store' } })
}

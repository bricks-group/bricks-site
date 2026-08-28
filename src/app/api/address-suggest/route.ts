import { NextRequest, NextResponse } from 'next/server'

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'BricksPrelaunch/1.0 (booking@brxs.ca)'

type Suggestion = {
  label: string
  city: string
  province: string
  postal_code: string
}

type NominatimHit = {
  display_name?: string
  address?: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    hamlet?: string
    county?: string
    state?: string
    province?: string
    postcode?: string
  }
}

function mapHit(hit: NominatimHit): Suggestion | null {
  const label = (hit.display_name || '').trim()
  if (!label) return null
  const a = hit.address || {}
  return {
    label,
    city: a.city || a.town || a.village || a.municipality || a.hamlet || '',
    province: a.state || a.province || '',
    postal_code: a.postcode || '',
  }
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim()
  if (q.length < 3) {
    return NextResponse.json([])
  }

  try {
    const url =
      `${NOMINATIM}?q=${encodeURIComponent(q)}` +
      '&format=json&limit=6&addressdetails=1&countrycodes=ca&dedupe=1'

    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) return NextResponse.json([])

    const data = (await res.json()) as unknown
    if (!Array.isArray(data)) return NextResponse.json([])

    const out = (data as NominatimHit[]).map(mapHit).filter((x): x is Suggestion => x !== null)
    return NextResponse.json(out)
  } catch {
    return NextResponse.json([])
  }
}

import { NextRequest, NextResponse } from 'next/server'

const MAPBOX_GEOCODE = 'https://api.mapbox.com/geocoding/v5/mapbox.places'

type Suggestion = {
  label: string
  city: string
  province: string
  postal_code: string
  lng: number
  lat: number
}

type MapboxContext = {
  id?: string
  text?: string
}

type MapboxFeature = {
  place_name?: string
  center?: [number, number]
  context?: MapboxContext[]
}

function ctxText(context: MapboxContext[] | undefined, prefix: string): string {
  if (!context) return ''
  const hit = context.find((c) => (c.id || '').startsWith(prefix + '.'))
  return (hit?.text || '').trim()
}

function mapFeature(f: MapboxFeature): Suggestion | null {
  const label = (f.place_name || '').trim()
  const center = f.center
  if (!label || !Array.isArray(center) || center.length < 2) return null
  const lng = Number(center[0])
  const lat = Number(center[1])
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null
  return {
    label,
    city: ctxText(f.context, 'place') || ctxText(f.context, 'locality'),
    province: ctxText(f.context, 'region'),
    postal_code: ctxText(f.context, 'postcode'),
    lng,
    lat,
  }
}

function mapboxToken(): string {
  return (
    process.env.MAPBOX_ACCESS_TOKEN ||
    process.env.MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    ''
  ).trim()
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim()
  if (q.length < 3) {
    return NextResponse.json({ error: 'query_too_short' }, { status: 400 })
  }

  const token = mapboxToken()
  if (!token) {
    return NextResponse.json({ error: 'mapbox_unconfigured' }, { status: 503 })
  }

  try {
    const url =
      `${MAPBOX_GEOCODE}/${encodeURIComponent(q)}.json` +
      `?access_token=${encodeURIComponent(token)}` +
      '&country=ca&types=address&autocomplete=true&limit=6'

    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json([])

    const data = (await res.json()) as { features?: MapboxFeature[] }
    const features = Array.isArray(data.features) ? data.features : []
    const out = features.map(mapFeature).filter((x): x is Suggestion => x !== null)
    return NextResponse.json(out)
  } catch {
    return NextResponse.json([])
  }
}

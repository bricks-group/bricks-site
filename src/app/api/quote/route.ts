import { NextResponse } from 'next/server'
import { buildQuote } from '@/lib/quote-engine'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const OS_QUOTE = 'https://api.brxs.ca/api/book/www-quote'

async function quoteViaOs(body: Record<string, unknown>) {
  const key = (
    process.env.INTERNAL_API_KEY ||
    process.env.BRICKS_INTERNAL_API_KEY ||
    ''
  ).trim()
  if (!key) return null
  const res = await fetch(OS_QUOTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Api-Key': key,
    },
    body: JSON.stringify({
      ...body,
      property_address: body.property_address || body.address,
    }),
  })
  const j = await res.json().catch(() => ({}))
  return { ok: res.ok && j?.ok, status: res.status, j }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'Expected JSON object' }, { status: 400 })
  }

  // Prefer OS assign-first quote (near-instant allocate + final travel / GTA $0).
  try {
    const proxied = await quoteViaOs(body)
    if (proxied?.ok && proxied.j?.quote) {
      return NextResponse.json({ ok: true, quote: proxied.j.quote, via: 'os-assign' })
    }
    if (proxied && !proxied.ok && proxied.status === 409) {
      return NextResponse.json(
        {
          ok: false,
          error:
            proxied.j?.error ||
            proxied.j?.detail ||
            'No photographer available for this address yet — checkout is blocked until one is assigned.',
        },
        { status: 409 },
      )
    }
  } catch {
    // fall through to local quote-engine
  }

  const result = await buildQuote(body)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
  }
  // Local engine: GTA major is final $0; outside GTA is still pending — do not
  // pretend a final fee. Surface a clear block so the wizard cannot pay yet.
  const q = result.quote
  if (q.travel_pending) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Confirming a photographer for this address — travel outside GTA major markets is finalized from their base before checkout. Try again in a moment, or email help@brxs.ca.',
      },
      { status: 409 },
    )
  }
  return NextResponse.json({ ok: true, quote: q })
}

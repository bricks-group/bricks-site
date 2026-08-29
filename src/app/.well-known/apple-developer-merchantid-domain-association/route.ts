import { NextResponse } from 'next/server'

// Apple Pay domain verification for brxs.ca / www.brxs.ca.
// Stripe is the Apple Pay merchant; we proxy their association file so Apple
// can verify this domain. Hosted Checkout wallets still appear on
// checkout.stripe.com; this file is what Stripe/Apple check when registering
// payment_method_domains for brxs.ca.
const STRIPE_ASSOC =
  'https://stripe.com/files/apple-pay/apple-developer-merchantid-domain-association'

export async function GET() {
  const upstream = await fetch(STRIPE_ASSOC, { next: { revalidate: 86400 } })
  if (!upstream.ok) {
    return new NextResponse('Apple Pay domain association unavailable', { status: 502 })
  }
  const body = await upstream.arrayBuffer()
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

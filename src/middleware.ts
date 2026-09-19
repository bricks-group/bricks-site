import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'bricks_www_gate'
const PASSWORD_ENV = 'WWW_SITE_GATE_PASSWORD'

function gateEnabled(): boolean {
  const v = process.env[PASSWORD_ENV]
  return typeof v === 'string' && v.trim().length > 0
}

export function isPublicPath(pathname: string): boolean {
  if (pathname === '/gate' || pathname === '/api/gate') return true
  if (pathname.startsWith('/_next')) return true
  if (pathname === '/favicon.svg' || pathname === '/favicon.ico') return true
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return true
  // Static assets needed for public pages (OG, author card, gallery thumbs on shared chrome).
  if (pathname.startsWith('/media/') || pathname.startsWith('/assets/')) return true
  if (pathname.startsWith('/screens/')) return true
  if (pathname.startsWith('/supersplat-viewer/')) return true
  // First-booking loop must work while marketing stays gated.
  // Stripe returns to /book?paid=…; wizard needs suggest + slots APIs.
  if (pathname === '/book' || pathname.startsWith('/book/')) return true
  if (pathname === '/api/book' || pathname.startsWith('/api/book/')) return true
  if (pathname === '/api/address-suggest') return true
  // Same-origin quote/checkout (bypass Canada Edge Fair-Use 402).
  if (pathname === '/api/quote' || pathname === '/api/create-checkout') return true
  // Canada-wide contractor apply must work while marketing stays gated.
  // Form loads /legal/ic-agreement.txt; apply POST goes to dispatch-api (other host).
  if (pathname === '/photographers' || pathname.startsWith('/photographers/')) return true
  // /book pay step links Terms + Privacy; keep legal surface public while marketing stays gated.
  if (pathname === '/terms' || pathname.startsWith('/terms/')) return true
  if (pathname === '/privacy' || pathname.startsWith('/privacy/')) return true
  if (pathname === '/legal' || pathname.startsWith('/legal/')) return true
  if (pathname === '/dpa' || pathname.startsWith('/dpa/')) return true
  // SEO beachhead: blog + commercial landings crawlable without opening OS/homepage story.
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return true
  if (pathname === '/real-estate-photography' || pathname.startsWith('/real-estate-photography/')) return true
  if (pathname === '/listing-photos' || pathname.startsWith('/listing-photos/')) return true
  // Prospect demo: contact-first /demo + signed unlock. Mint UI /demo/invite stays gated.
  if (pathname === '/demo' || pathname === '/demo/') return true
  if (pathname === '/demo/unlock' || pathname.startsWith('/demo/unlock/')) return true
  if (pathname === '/api/demo/invite' || pathname.startsWith('/api/demo/')) return true
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-bricks-pathname', pathname)

  if (!gateEnabled()) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const cookie = request.cookies.get(COOKIE)?.value
  if (cookie === '1') {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const url = request.nextUrl.clone()
  url.pathname = '/gate'
  url.search = ''
  const next = pathname + (request.nextUrl.search || '')
  if (next && next !== '/') {
    url.searchParams.set('next', next)
  }
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}

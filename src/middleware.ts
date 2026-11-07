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
  if (['/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt'].includes(pathname)) return true
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
  if (pathname === '/api/quote' || pathname === '/api/create-checkout' || pathname === '/api/confirm-paid') return true
  // Canada-wide contractor apply must work while marketing stays gated.
  // Form loads /legal/ic-agreement.txt; apply POST goes to dispatch-api (other host).
  if (pathname === '/photographers' || pathname.startsWith('/photographers/')) return true
  // Vendor apply hub for every trade (same reasoning as /photographers).
  if (pathname === '/work-with-bricks' || pathname.startsWith('/work-with-bricks/')) return true
  // Home services quote requests work like /book: a client can ask for a quote while marketing stays gated.
  if (['/services'].some((x) => pathname === x || pathname.startsWith(`${x}/`))) return true
  // /book pay step links Terms + Privacy; keep legal surface public while marketing stays gated.
  if (pathname === '/terms' || pathname.startsWith('/terms/')) return true
  if (pathname === '/privacy' || pathname.startsWith('/privacy/')) return true
  if (pathname === '/legal' || pathname.startsWith('/legal/')) return true
  if (pathname === '/dpa' || pathname.startsWith('/dpa/')) return true
  // App Store / Google Play require a public account-deletion page.
  if (pathname === '/account-deletion' || pathname.startsWith('/account-deletion/')) return true
  // SEO beachhead: blog + commercial landings crawlable without opening OS/homepage story.
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return true
  if (pathname === '/real-estate-photography' || pathname.startsWith('/real-estate-photography/')) return true
  if (pathname === '/listing-photos' || pathname.startsWith('/listing-photos/')) return true
  if (['/drone-photography', '/virtual-tours', '/real-estate-video', '/drone-mapping', '/home-staging', '/home-inspection-ontario', '/move-out-cleaning'].includes(pathname)) return true
  // IndexNow key file at the site root (public by design: search engines fetch it to verify submissions).
  if (/^\/[a-f0-9]{32}\.txt$/.test(pathname)) return true
  // Prospect demo: contact-first /demo + signed unlock. Mint UI /demo/invite stays gated.
  if (pathname === '/demo' || pathname === '/demo/') return true
  if (pathname === '/demo/unlock' || pathname.startsWith('/demo/unlock/')) return true
  if (pathname === '/api/demo/invite' || pathname.startsWith('/api/demo/')) return true
  // Developer/REIT project microsites (/projects/[slug]) are the paid
  // product itself -- a buyer needs the link to work without opening the
  // gate, same reasoning as /book and /photographers above.
  if (pathname === '/projects' || pathname.startsWith('/projects/')) return true
  // Help centre: support answers must be reachable while marketing stays gated.
  if (pathname === '/help' || pathname.startsWith('/help/')) return true
  if (pathname === '/api/help-feedback') return true
  // Help assistant + signed help@ inbound webhook (own kill switches and auth).
  if (pathname === '/api/help-chat' || pathname.startsWith('/api/help-chat/')) return true
  if (pathname === '/api/support/inbound') return true
  // Support review: own signed-link auth (SUPPORT_ADMIN_SECRET), noindex.
  if (pathname === '/admin/support' || pathname.startsWith('/admin/support/')) return true
  // Plan visit one-tap link from client emails (token-signed; no account).
  if (pathname === '/visit' || pathname.startsWith('/visit/')) return true
  if (pathname.startsWith('/api/visit/')) return true
  return false
}

const HELP_HOST = 'help.brxs.ca'
const WWW_HOSTS = new Set(['www.brxs.ca', 'brxs.ca'])
const HELP_PASSTHROUGH = /^\/(_next|api|admin|assets|media|fonts|screens)(\/|$)|^\/(favicon\.svg|favicon\.ico|robots\.txt|sitemap\.xml)$/

/** help.brxs.ca serves the /help hub at its root; www /help/* redirects there (one canonical home). */
function helpHostRoute(request: NextRequest): NextResponse | null {
  const host = (request.headers.get('host') || '').toLowerCase().split(':')[0]
  const { pathname, search } = request.nextUrl
  if (host === HELP_HOST) {
    if (pathname === '/admin' || pathname === '/admin/') {
      const u = request.nextUrl.clone(); u.pathname = '/admin/support'; return NextResponse.redirect(u)
    }
    if (pathname === '/help' || pathname.startsWith('/help/')) {
      const u = request.nextUrl.clone(); u.pathname = pathname.slice(5) || '/'; return NextResponse.redirect(u, 308)
    }
    if (HELP_PASSTHROUGH.test(pathname)) return null
    const u = request.nextUrl.clone(); u.pathname = pathname === '/' ? '/help' : `/help${pathname}`
    return NextResponse.rewrite(u)
  }
  if (WWW_HOSTS.has(host) && (pathname === '/help' || pathname.startsWith('/help/'))) {
    return NextResponse.redirect(`https://${HELP_HOST}${pathname.slice(5) || '/'}${search}`, 308)
  }
  return null
}

export function middleware(request: NextRequest) {
  const routed = helpHostRoute(request)
  if (routed) return routed
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

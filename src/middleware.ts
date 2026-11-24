import { NextRequest, NextResponse } from 'next/server'
import { marketRedirect } from './lib/seasonal-market'
import { GATE_COOKIE, gatePassword, verifyGateCookie } from './lib/gate-cookie'

/** Set only in wrangler.preview.jsonc. Never set on the production Worker. */
export const PREVIEW_ENV = 'BRICKS_SITE_PREVIEW'
export const PREVIEW_ROBOTS_TAG = 'noindex, nofollow'

export function isSitePreview(): boolean {
  const v = process.env[PREVIEW_ENV]
  if (typeof v !== 'string') return false
  const n = v.trim().toLowerCase()
  return n !== '' && n !== '0' && n !== 'false' && n !== 'off'
}

function withPreviewHeaders(response: NextResponse): NextResponse {
  if (isSitePreview()) {
    response.headers.set('X-Robots-Tag', PREVIEW_ROBOTS_TAG)
  }
  return response
}

function gateEnabled(): boolean {
  return gatePassword().length > 0
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
  if (pathname === '/api/geo') return true
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
  if (routed) return withPreviewHeaders(routed)
  const { pathname } = request.nextUrl
  // Seasonal market pages: out-of-season URLs (and /market) go to the current season.
  // 307 (temporary) so the target flips on the season date with no redeploy.
  const season = marketRedirect(pathname)
  if (season) {
    const u = request.nextUrl.clone(); u.pathname = season
    return withPreviewHeaders(NextResponse.redirect(u, 307))
  }
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-bricks-pathname', pathname)

  if (!gateEnabled()) {
    return withPreviewHeaders(NextResponse.next({ request: { headers: requestHeaders } }))
  }

  if (isPublicPath(pathname)) {
    return withPreviewHeaders(NextResponse.next({ request: { headers: requestHeaders } }))
  }

  if (verifyGateCookie(request.cookies.get(GATE_COOKIE)?.value, gatePassword())) {
    return withPreviewHeaders(NextResponse.next({ request: { headers: requestHeaders } }))
  }

  const url = request.nextUrl.clone()
  url.pathname = '/gate'
  url.search = ''
  const next = pathname + (request.nextUrl.search || '')
  if (next && next !== '/') {
    url.searchParams.set('next', next)
  }
  return withPreviewHeaders(NextResponse.redirect(url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|fonts/|assets/|media/|screens/|supersplat-viewer/|favicon\\.svg$|favicon\\.ico$|\\.well-known/|bimi/).*)'],
}

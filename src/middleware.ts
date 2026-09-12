import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'bricks_www_gate'
const PASSWORD_ENV = 'WWW_SITE_GATE_PASSWORD'

function gateEnabled(): boolean {
  const v = process.env[PASSWORD_ENV]
  return typeof v === 'string' && v.trim().length > 0
}

function isPublicPath(pathname: string): boolean {
  if (pathname === '/gate' || pathname === '/api/gate') return true
  if (pathname.startsWith('/_next')) return true
  if (pathname === '/favicon.svg' || pathname === '/favicon.ico') return true
  if (pathname === '/robots.txt') return true
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

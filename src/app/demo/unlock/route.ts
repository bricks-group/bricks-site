import { NextRequest, NextResponse } from 'next/server'
import {
  DEMO_ACCESS_COOKIE,
  remainingMaxAge,
  verifyDemoInvite,
} from '@/lib/demo-invite'

export async function GET(req: NextRequest) {
  const token = (req.nextUrl.searchParams.get('t') || '').trim()
  const demoUrl = new URL('/demo', req.url)
  const expiredUrl = new URL('/demo', req.url)
  expiredUrl.searchParams.set('invite', 'expired')

  if (!token) {
    return NextResponse.redirect(expiredUrl)
  }

  const verified = verifyDemoInvite(token)
  if (!verified.ok) {
    return NextResponse.redirect(expiredUrl)
  }

  const maxAge = remainingMaxAge(verified.payload.exp)
  const res = NextResponse.redirect(demoUrl)
  res.cookies.set(DEMO_ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
    sameSite: 'lax',
    path: '/',
    maxAge,
  })
  return res
}

import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { GATE_COOKIE, GATE_COOKIE_MAX_AGE, gatePassword, mintGateCookie } from '@/lib/gate-cookie'

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  if (ab.length !== bb.length) {
    // Still do a compare against self to keep timing roughly steady for wrong length
    timingSafeEqual(ab, ab)
    return false
  }
  return timingSafeEqual(ab, bb)
}

export async function POST(req: NextRequest) {
  const expected = gatePassword()
  if (!expected) {
    return NextResponse.json({ ok: true, gated: false })
  }

  let password = ''
  const contentType = req.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) {
      const body = await req.json()
      password = typeof body?.password === 'string' ? body.password.trim() : ''
    } else {
      const form = await req.formData()
      const v = form.get('password')
      password = typeof v === 'string' ? v.trim() : ''
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  if (!safeEqual(password, expected)) {
    return NextResponse.json({ ok: false, error: 'invalid_password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(GATE_COOKIE, mintGateCookie(expected), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: GATE_COOKIE_MAX_AGE,
  })
  return res
}

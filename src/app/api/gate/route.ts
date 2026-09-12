import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'bricks_www_gate'
const PASSWORD_ENV = 'WWW_SITE_GATE_PASSWORD'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function expectedPassword(): string {
  return (process.env[PASSWORD_ENV] || '').trim()
}

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
  const expected = expectedPassword()
  if (!expected) {
    return NextResponse.json({ ok: true, gated: false })
  }

  let password = ''
  const contentType = req.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) {
      const body = await req.json()
      password = typeof body?.password === 'string' ? body.password : ''
    } else {
      const form = await req.formData()
      const v = form.get('password')
      password = typeof v === 'string' ? v : ''
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  if (!safeEqual(password, expected)) {
    return NextResponse.json({ ok: false, error: 'invalid_password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
  return res
}

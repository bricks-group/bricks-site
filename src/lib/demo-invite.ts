import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

export const DEMO_ACCESS_COOKIE = 'bricks_demo_access'

export type DemoInvitePayload = {
  email?: string
  exp: number
  nbf?: number
  jti: string
}

export type MintDemoInviteInput = {
  email?: string
  days?: number
  /** Override now (unix sec) for tests. */
  now?: number
}

function inviteSecret(): string {
  const a = (process.env.DEMO_INVITE_SECRET || '').trim()
  if (a) return a
  return (process.env.WWW_SITE_GATE_PASSWORD || '').trim()
}

function b64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf, 'utf8') : buf
  return b
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad
  return Buffer.from(b64, 'base64')
}

function signPayload(payloadB64: string, secret: string): string {
  return b64url(createHmac('sha256', secret).update(payloadB64).digest())
}

function safeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, ab)
    return false
  }
  return timingSafeEqual(ab, bb)
}

/** Clamp invite lifetime to 1–30 days. */
export function clampInviteDays(days: number | undefined): number {
  const n = typeof days === 'number' && Number.isFinite(days) ? Math.floor(days) : 7
  return Math.min(30, Math.max(1, n))
}

export function mintDemoInvite(input: MintDemoInviteInput = {}): {
  token: string
  payload: DemoInvitePayload
  exp: number
} {
  const secret = inviteSecret()
  if (!secret) {
    throw new Error('DEMO_INVITE_SECRET (or WWW_SITE_GATE_PASSWORD) is not set')
  }
  const days = clampInviteDays(input.days)
  const now = input.now ?? Math.floor(Date.now() / 1000)
  const payload: DemoInvitePayload = {
    exp: now + days * 24 * 60 * 60,
    jti: randomBytes(16).toString('hex'),
  }
  const email = (input.email || '').trim().toLowerCase()
  if (email) payload.email = email

  const payloadB64 = b64url(JSON.stringify(payload))
  const sig = signPayload(payloadB64, secret)
  return { token: `${payloadB64}.${sig}`, payload, exp: payload.exp }
}

export function verifyDemoInvite(
  token: string,
  opts?: { now?: number },
): { ok: true; payload: DemoInvitePayload } | { ok: false; reason: string } {
  const secret = inviteSecret()
  if (!secret) return { ok: false, reason: 'no_secret' }
  if (!token || typeof token !== 'string') return { ok: false, reason: 'missing' }

  const parts = token.split('.')
  if (parts.length !== 2) return { ok: false, reason: 'format' }
  const [payloadB64, sig] = parts
  if (!payloadB64 || !sig) return { ok: false, reason: 'format' }

  const expected = signPayload(payloadB64, secret)
  if (!safeEqualStr(sig, expected)) return { ok: false, reason: 'bad_sig' }

  let payload: DemoInvitePayload
  try {
    payload = JSON.parse(fromB64url(payloadB64).toString('utf8')) as DemoInvitePayload
  } catch {
    return { ok: false, reason: 'bad_payload' }
  }
  if (!payload || typeof payload.exp !== 'number' || typeof payload.jti !== 'string') {
    return { ok: false, reason: 'bad_payload' }
  }

  const now = opts?.now ?? Math.floor(Date.now() / 1000)
  if (typeof payload.nbf === 'number' && now < payload.nbf) {
    return { ok: false, reason: 'nbf' }
  }
  if (now >= payload.exp) return { ok: false, reason: 'expired' }

  return { ok: true, payload }
}

/** Remaining seconds until exp (min 0). */
export function remainingMaxAge(exp: number, now = Math.floor(Date.now() / 1000)): number {
  return Math.max(0, exp - now)
}

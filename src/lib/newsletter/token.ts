/**
 * Signed newsletter links (HMAC-SHA256, no database).
 *  - confirm ('c'): double opt-in link, expires after CONFIRM_TTL_SEC
 *  - unsubscribe ('u'): never expires, so an old email's link always works
 * Only someone holding the link for an address can act on that address.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

export type Purpose = 'c' | 'u'
export type TokenPayload = { p: Purpose; e: string; t: number; s?: string }
export const CONFIRM_TTL_SEC = 7 * 86400

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normEmail(raw: unknown): string {
  const e = String(raw ?? '').trim().toLowerCase()
  return e.length <= 254 && EMAIL_RE.test(e) ? e : ''
}

function mac(secret: string, body: string): string {
  return createHmac('sha256', secret).update(`bricks-newsletter:${body}`).digest('base64url')
}

export function signToken(secret: string, payload: TokenPayload): string {
  if (!secret) throw new Error('newsletter secret missing')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${mac(secret, body)}`
}

export type Verified = { ok: true; email: string; source?: string; issuedAt: number } | { ok: false; reason: 'invalid' | 'expired' }

export function verifyToken(secret: string, token: unknown, purpose: Purpose, nowSec = Math.floor(Date.now() / 1000)): Verified {
  if (!secret || typeof token !== 'string' || token.length > 2048) return { ok: false, reason: 'invalid' }
  const [body, sig, extra] = token.split('.')
  if (!body || !sig || extra !== undefined) return { ok: false, reason: 'invalid' }
  const a = Buffer.from(sig), b = Buffer.from(mac(secret, body))
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: 'invalid' }
  let p: TokenPayload
  try { p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) } catch { return { ok: false, reason: 'invalid' } }
  const email = normEmail(p?.e)
  if (p?.p !== purpose || !email || !Number.isFinite(p.t)) return { ok: false, reason: 'invalid' }
  if (purpose === 'c' && nowSec - p.t > CONFIRM_TTL_SEC) return { ok: false, reason: 'expired' }
  return { ok: true, email, source: typeof p.s === 'string' ? p.s.slice(0, 80) : undefined, issuedAt: p.t }
}

export const confirmToken = (secret: string, email: string, source: string, nowSec = Math.floor(Date.now() / 1000)) =>
  signToken(secret, { p: 'c', e: email, t: nowSec, s: source })
export const unsubscribeToken = (secret: string, email: string) => signToken(secret, { p: 'u', e: email, t: 0 })

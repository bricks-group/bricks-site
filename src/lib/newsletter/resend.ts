/** Subscribers live in one place: Resend contacts, in the "Newsletter" segment. */
import { ALERT_FROM, alertTo, contactsKey, segmentId, sendKey } from './config'
import type { BuiltEmail } from './email'

type Env = Record<string, string | undefined>
type FetchFn = typeof fetch
const API = 'https://api.resend.com'

async function call(key: string, path: string, init: RequestInit, f: FetchFn): Promise<{ ok: boolean; status: number; json: Record<string, unknown> }> {
  const r = await f(`${API}${path}`, { ...init, headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) } })
  const json = (await r.json().catch(() => ({}))) as Record<string, unknown>
  return { ok: r.ok, status: r.status, json }
}

export async function sendEmail(email: BuiltEmail, env: Env = process.env, f: FetchFn = fetch): Promise<{ ok: boolean; status: number }> {
  const key = sendKey(env)
  if (!key) return { ok: false, status: 0 }
  const r = await call(key, '/emails', { method: 'POST', body: JSON.stringify(email) }, f)
  return { ok: r.ok, status: r.status }
}

/** Create or update the contact, then make sure it sits in the Newsletter segment. */
export async function subscribeContact(email: string, props: { signup_source: string; consent_at: string }, env: Env = process.env, f: FetchFn = fetch): Promise<{ ok: boolean; step?: string; status?: number }> {
  const key = contactsKey(env), seg = segmentId(env)
  if (!key || !seg) return { ok: false, step: 'config' }
  const enc = encodeURIComponent(email)
  const created = await call(key, '/contacts', { method: 'POST', body: JSON.stringify({ email, unsubscribed: false, properties: props, segments: [{ id: seg }] }) }, f)
  if (created.ok) return { ok: true }
  // Already a contact (e.g. resubscribing): flip back on and add to the segment.
  const upd = await call(key, `/contacts/${enc}`, { method: 'PATCH', body: JSON.stringify({ unsubscribed: false, properties: props }) }, f)
  if (!upd.ok) return { ok: false, step: 'update', status: upd.status }
  const add = await call(key, `/contacts/${enc}/segments/${seg}`, { method: 'POST', body: '{}' }, f)
  if (!add.ok && add.status !== 409 && add.status !== 422) return { ok: false, step: 'segment', status: add.status }
  return { ok: true }
}

/** Unsubscribe is global (Resend broadcasts honour the same flag). Unknown addresses are stored as unsubscribed so they stay suppressed. */
export async function unsubscribeContact(email: string, env: Env = process.env, f: FetchFn = fetch): Promise<{ ok: boolean; status?: number }> {
  const key = contactsKey(env)
  if (!key) return { ok: false }
  const upd = await call(key, `/contacts/${encodeURIComponent(email)}`, { method: 'PATCH', body: JSON.stringify({ unsubscribed: true }) }, f)
  if (upd.ok) return { ok: true }
  if (upd.status === 404) {
    const c = await call(key, '/contacts', { method: 'POST', body: JSON.stringify({ email, unsubscribed: true }) }, f)
    return { ok: c.ok, status: c.status }
  }
  return { ok: false, status: upd.status }
}

export async function alert(subject: string, text: string, env: Env = process.env, f: FetchFn = fetch): Promise<void> {
  const key = sendKey(env)
  if (!key) return
  await call(key, '/emails', {
    method: 'POST',
    body: JSON.stringify({ from: ALERT_FROM, to: [alertTo(env)], subject, text, headers: { 'X-Bricks-Alert': 'newsletter', 'Auto-Submitted': 'auto-generated' } }),
  }, f).catch(() => undefined)
}

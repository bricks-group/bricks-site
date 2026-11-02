import { createHash } from 'node:crypto'

/**
 * Fixed-window rate limiting for public form endpoints.
 *
 * Durable store: Supabase RPC public.www_rate_limit_hit (migration
 * supabase/migrations/20261102120000_www_rate_limits.sql, not yet applied).
 * Until that exists the limiter falls back to per-instance memory, which still
 * stops rapid bursts hitting the same warm instance.
 */

export type Rule = { name: string; key: string; limit: number; windowSec: number }
export type Decision = { ok: true } | { ok: false; rule: string; retryAfterSec: number }
export interface Store { hit(key: string, windowSec: number, nowMs: number): Promise<number> }

export function memoryStore(): Store & { size(): number } {
  const m = new Map<string, { start: number; count: number }>()
  return {
    async hit(key, windowSec, now) {
      if (m.size > 5000) for (const [k, v] of m) if (now - v.start >= windowSec * 1000) m.delete(k)
      const e = m.get(key)
      if (!e || now - e.start >= windowSec * 1000) { m.set(key, { start: now, count: 1 }); return 1 }
      e.count += 1
      return e.count
    },
    size: () => m.size,
  }
}

type Fetch = typeof fetch

export function supabaseStore(url: string, key: string, fetchImpl: Fetch = fetch): Store {
  return {
    async hit(k, windowSec) {
      const r = await fetchImpl(`${url.replace(/\/$/, '')}/rest/v1/rpc/www_rate_limit_hit`, {
        method: 'POST',
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_key: k, p_window_seconds: windowSec }),
      })
      if (!r.ok) throw new Error(`rate_store_${r.status}`)
      const n = Number(await r.json())
      if (!Number.isFinite(n)) throw new Error('rate_store_bad')
      return n
    },
  }
}

/** Durable store first; on any error, memory (and skip the durable store for a few minutes). */
export function fallbackStore(primary: Store | null, memory: Store, cooldownMs = 5 * 60_000): Store {
  let downUntil = 0
  return {
    async hit(key, windowSec, now) {
      if (primary && now >= downUntil) {
        try { return await primary.hit(key, windowSec, now) } catch { downUntil = now + cooldownMs }
      }
      return memory.hit(key, windowSec, now)
    },
  }
}

export async function checkRules(rules: Rule[], store: Store, now = Date.now()): Promise<Decision> {
  let worst: Decision = { ok: true }
  for (const r of rules) {
    const n = await store.hit(`${r.name}:${r.key}`, r.windowSec, now)
    if (n > r.limit && worst.ok) worst = { ok: false, rule: r.name, retryAfterSec: r.windowSec }
  }
  return worst
}

export function hashKey(v: string): string {
  return createHash('sha256').update(v.trim().toLowerCase()).digest('hex').slice(0, 32)
}

export function clientIp(h: Headers): string {
  const xff = h.get('x-forwarded-for')
  if (xff) { const first = xff.split(',')[0]?.trim(); if (first) return first }
  return h.get('x-real-ip')?.trim() || 'unknown'
}

export const TOO_MANY = 'Too many requests. Please try again in an hour, or email help@brxs.ca.'

export const SERVICE_REQUEST_LIMITS = { perIp: 5, perEmail: 3, windowSec: 3600 }

export function serviceRequestRules(ip: string, email: string): Rule[] {
  const { perIp, perEmail, windowSec } = SERVICE_REQUEST_LIMITS
  return [
    { name: 'sr-ip', key: hashKey(ip), limit: perIp, windowSec },
    { name: 'sr-email', key: hashKey(email), limit: perEmail, windowSec },
  ]
}

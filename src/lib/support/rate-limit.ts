/**
 * Fixed-window rate limit. Uses the existing public.www_rate_limit_hit() counter
 * in Supabase (shared across serverless instances) and falls back to a
 * per-instance memory window if the database is unreachable. Keys are hashed so
 * no raw IP address is stored.
 */
import { createHash } from 'node:crypto'
import type { Db } from './db'

const mem = new Map<string, { start: number; count: number }>()

export function memoryHit(key: string, windowSec: number, now = Date.now()): number {
  const e = mem.get(key)
  if (!e || now - e.start >= windowSec * 1000) {
    mem.set(key, { start: now, count: 1 })
    if (mem.size > 5000) for (const [k, v] of mem) if (now - v.start >= windowSec * 1000) mem.delete(k)
    return 1
  }
  e.count++
  return e.count
}

export function _resetMemory() { mem.clear() }

export function clientKey(scope: string, ip: string): string {
  return `${scope}:${createHash('sha256').update(`bricks-help|${ip}`).digest('hex').slice(0, 24)}`
}

export type Limit = { windowSec: number; max: number }

export async function limited(db: Db | null, key: string, limit: Limit): Promise<boolean> {
  let count: number | null = null
  if (db) {
    try {
      const r = await db.rpc('www_rate_limit_hit', { p_key: key, p_window_seconds: limit.windowSec })
      if (r.ok && typeof r.data === 'number') count = r.data
    } catch { /* fall back to memory */ }
  }
  if (count === null) count = memoryHit(key, limit.windowSec)
  return count > limit.max
}

export function requestIp(headers: Headers): string {
  return (headers.get('x-real-ip') || headers.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim()
}

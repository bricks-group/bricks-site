/**
 * Server-only Supabase access for support tables (service role, PostgREST).
 * The support tables have RLS on and no anon/authenticated policies, so the
 * browser can never read them; only these server routes write to them.
 */
type Env = Record<string, string | undefined>

export type Db = {
  insert: (table: string, row: Record<string, unknown>, opts?: { onConflict?: string; ignoreDuplicates?: boolean }) => Promise<{ ok: boolean; status: number; rows: Record<string, unknown>[] }>
  update: (table: string, match: Record<string, string>, patch: Record<string, unknown>) => Promise<{ ok: boolean; status: number }>
  select: (table: string, query: string) => Promise<{ ok: boolean; rows: Record<string, unknown>[] }>
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ ok: boolean; data: unknown }>
}

export function supportDb(env: Env = process.env, f: typeof fetch = fetch): Db | null {
  const url = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
  const key = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !key) return null
  const h = (extra: Record<string, string> = {}) => ({ apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra })
  return {
    async insert(table, row, opts = {}) {
      const q = opts.onConflict ? `?on_conflict=${encodeURIComponent(opts.onConflict)}` : ''
      const prefer = ['return=representation', opts.onConflict ? (opts.ignoreDuplicates ? 'resolution=ignore-duplicates' : 'resolution=merge-duplicates') : ''].filter(Boolean).join(',')
      const r = await f(`${url}/rest/v1/${table}${q}`, { method: 'POST', headers: h({ Prefer: prefer }), body: JSON.stringify(row) })
      const rows = r.ok ? ((await r.json().catch(() => [])) as Record<string, unknown>[]) : []
      if (!r.ok) console.error('support db insert', table, r.status, (await r.text().catch(() => '')).slice(0, 200))
      return { ok: r.ok, status: r.status, rows }
    },
    async update(table, match, patch) {
      const q = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&')
      const r = await f(`${url}/rest/v1/${table}?${q}`, { method: 'PATCH', headers: h({ Prefer: 'return=minimal' }), body: JSON.stringify(patch) })
      return { ok: r.ok, status: r.status }
    },
    async select(table, query) {
      const r = await f(`${url}/rest/v1/${table}?${query}`, { headers: h() })
      return { ok: r.ok, rows: r.ok ? ((await r.json().catch(() => [])) as Record<string, unknown>[]) : [] }
    },
    async rpc(fn, args) {
      const r = await f(`${url}/rest/v1/rpc/${fn}`, { method: 'POST', headers: h(), body: JSON.stringify(args) })
      return { ok: r.ok, data: r.ok ? await r.json().catch(() => null) : null }
    },
  }
}

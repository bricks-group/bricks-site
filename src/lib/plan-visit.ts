// Plan visit one-tap link: shared types + API base (server only reads the env).
export type VisitState =
  | { state: 'inactive' }
  | { state: 'expired' }
  | { state: 'missing' }
  | { state: 'error' }
  | { state: 'lapsed'; visit_date?: string | null; day?: string | null }
  | { state: 'declined'; visit_date?: string | null; day?: string | null }
  | { state: 'confirmed'; visit_date?: string | null; day?: string | null }
  | {
      state: 'proposed'
      visit_date: string
      day: string
      site?: string
      min_date: string
      max_date: string
    }

export function planVisitsApi(): string {
  return (process.env.PLAN_VISITS_API_URL || 'https://api.brxs.ca').replace(/\/+$/, '')
}

export function validToken(t: unknown): t is string {
  return typeof t === 'string' && t.length > 8 && t.length < 600 && /^[A-Za-z0-9_\-=.]+$/.test(t)
}

export async function fetchVisitState(token: string): Promise<VisitState> {
  if (!validToken(token)) return { state: 'missing' }
  try {
    const r = await fetch(`${planVisitsApi()}/api/public/plan-visits/${encodeURIComponent(token)}/state`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (r.status === 404) return { state: 'expired' }
    const j = (await r.json().catch(() => null)) as VisitState | null
    if (!r.ok || !j || typeof j.state !== 'string') return { state: 'error' }
    return j
  } catch {
    return { state: 'error' }
  }
}

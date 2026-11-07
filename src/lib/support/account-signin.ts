/**
 * "Sign in with your Bricks account" for the help review page.
 *
 * The Bricks app session lives in app.brxs.ca's own storage, so this origin
 * signs in against the same Supabase project directly (server-side only):
 *   1. password, or a one-time email code, is exchanged with Supabase Auth
 *   2. the returned access token is re-checked with Supabase (/auth/v1/user)
 *   3. admin = public.users.is_platform_owner for that user id, read with the
 *      service role (the same flag OS admin and is_admin() use)
 * Anything missing or unexpected returns false (fail closed). Nothing is
 * stored except the existing signed review cookie; no password is kept.
 */
type Env = Record<string, string | undefined>
type F = typeof fetch

export type SigninResult = { ok: true; userId: string } | { ok: false; reason: 'config' | 'credentials' | 'not_admin' }

function cfg(env: Env) {
  const url = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
  const anon = (env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim()
  const service = (env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  return url && anon && service ? { url, anon, service } : null
}

const normEmail = (e: string) => String(e || '').trim().toLowerCase()
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254

/** Verifies a Supabase access token and checks the platform-owner flag. Fail closed. */
export async function adminFromAccessToken(token: string, env: Env = process.env, f: F = fetch): Promise<SigninResult> {
  const c = cfg(env)
  if (!c) return { ok: false, reason: 'config' }
  if (!token) return { ok: false, reason: 'credentials' }
  try {
    const u = await f(`${c.url}/auth/v1/user`, { headers: { apikey: c.anon, Authorization: `Bearer ${token}` }, cache: 'no-store' })
    if (!u.ok) return { ok: false, reason: 'credentials' }
    const user = (await u.json().catch(() => null)) as { id?: string } | null
    const id = String(user?.id || '')
    if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, reason: 'credentials' }
    const r = await f(`${c.url}/rest/v1/users?id=eq.${id}&select=id,is_platform_owner`, {
      headers: { apikey: c.service, Authorization: `Bearer ${c.service}` }, cache: 'no-store',
    })
    if (!r.ok) return { ok: false, reason: 'not_admin' }
    const rows = (await r.json().catch(() => [])) as { id?: string; is_platform_owner?: unknown }[]
    const row = Array.isArray(rows) && rows.length === 1 ? rows[0] : null
    if (!row || row.id !== id || row.is_platform_owner !== true) return { ok: false, reason: 'not_admin' }
    return { ok: true, userId: id }
  } catch {
    return { ok: false, reason: 'not_admin' }
  }
}

async function tokenFrom(res: Response): Promise<string> {
  if (!res.ok) return ''
  const j = (await res.json().catch(() => null)) as { access_token?: string } | null
  return String(j?.access_token || '')
}

export async function signInWithPassword(email: string, password: string, env: Env = process.env, f: F = fetch): Promise<SigninResult> {
  const c = cfg(env)
  if (!c) return { ok: false, reason: 'config' }
  const e = normEmail(email)
  if (!validEmail(e) || !password || password.length > 512) return { ok: false, reason: 'credentials' }
  try {
    const res = await f(`${c.url}/auth/v1/token?grant_type=password`, {
      method: 'POST', headers: { apikey: c.anon, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, password }), cache: 'no-store',
    })
    const token = await tokenFrom(res)
    if (!token) return { ok: false, reason: 'credentials' }
    return adminFromAccessToken(token, env, f)
  } catch {
    return { ok: false, reason: 'credentials' }
  }
}

/** Emails a one-time sign-in code to an existing account only (never creates one). */
export async function sendEmailCode(email: string, env: Env = process.env, f: F = fetch): Promise<boolean> {
  const c = cfg(env)
  const e = normEmail(email)
  if (!c || !validEmail(e)) return false
  try {
    const res = await f(`${c.url}/auth/v1/otp`, {
      method: 'POST', headers: { apikey: c.anon, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, create_user: false }), cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

export async function signInWithEmailCode(email: string, code: string, env: Env = process.env, f: F = fetch): Promise<SigninResult> {
  const c = cfg(env)
  if (!c) return { ok: false, reason: 'config' }
  const e = normEmail(email)
  const t = String(code || '').replace(/\s+/g, '')
  if (!validEmail(e) || !/^\d{6,10}$/.test(t)) return { ok: false, reason: 'credentials' }
  try {
    const res = await f(`${c.url}/auth/v1/verify`, {
      method: 'POST', headers: { apikey: c.anon, 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'email', email: e, token: t }), cache: 'no-store',
    })
    const token = await tokenFrom(res)
    if (!token) return { ok: false, reason: 'credentials' }
    return adminFromAccessToken(token, env, f)
  } catch {
    return { ok: false, reason: 'credentials' }
  }
}

/** Plain-language messages for the signed-out page (no codes). */
export const SIGNIN_MESSAGES: Record<string, string> = {
  credentials: 'That email and password or code did not work. Please try again.',
  not_admin: 'That account does not have access to support review.',
  config: 'Sign-in is not available right now. Use the link in your latest help@ alert email.',
  sent: 'If that account exists, a sign-in code is on its way. Enter it below.',
  busy: 'Too many tries. Please wait a few minutes and try again.',
  link: 'That link has expired or is not valid. Sign in with your Bricks account instead.',
}

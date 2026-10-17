/**
 * Signed-in state for the www header.
 *
 * The Bricks session (Supabase) lives in app.brxs.ca's own storage, which this
 * origin can never read. app.brxs.ca mirrors a boolean hint cookie
 * `bricks_signed_in=1` onto .brxs.ca (no token, no user data) on sign-in and
 * clears it on sign-out. www only reads that boolean; logging out sends the
 * browser to app.brxs.ca/logout, which signs out of Supabase where the session
 * actually is and returns here.
 */
import { OS_URL } from './brand'

export const HINT_COOKIE = 'bricks_signed_in'

export function hasSignedInHint(cookie: string): boolean {
  return new RegExp(`(?:^|;\\s*)${HINT_COOKIE}=1(?:;|$)`).test(cookie || '')
}

/** app.brxs.ca/logout signs out there, then returns to `returnTo` (allow-listed by the app). */
export function osLogoutUrl(returnTo: string): string {
  return `${OS_URL}/logout?next=${encodeURIComponent(returnTo)}`
}

/** Cookie strings that expire the hint from this origin (parent-domain copy + any host-only copy). */
export function clearHintCookies(hostname: string, secure = true): string[] {
  const h = (hostname || '').toLowerCase()
  const tail = `Path=/; Max-Age=0; SameSite=Lax${secure ? '; Secure' : ''}`
  const out = [`${HINT_COOKIE}=; ${tail}`]
  if (h === 'brxs.ca' || h.endsWith('.brxs.ca')) out.unshift(`${HINT_COOKIE}=; Domain=.brxs.ca; ${tail}`)
  return out
}

/**
 * Inline <head> script: sets <html data-bx-auth="in|out"> before first paint so
 * the header never flashes the wrong state. Re-checks on bfcache restore and
 * when the tab regains focus (signed out in another tab).
 */
export const AUTH_HEAD_SCRIPT = `(function(){function f(){try{document.documentElement.setAttribute('data-bx-auth',/(?:^|;\\s*)${HINT_COOKIE}=1(?:;|$)/.test(document.cookie)?'in':'out')}catch(e){}}f();addEventListener('pageshow',f);document.addEventListener('visibilitychange',function(){if(!document.hidden)f()})})();`

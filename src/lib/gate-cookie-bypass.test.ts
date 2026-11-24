import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { middleware } from '../middleware.ts'
import { POST as gatePost } from '../app/api/gate/route.ts'
import { POST as invitePost } from '../app/api/demo/invite/route.ts'
import { GET as unlockGet } from '../app/demo/unlock/route.ts'
import { verifyDemoInvite } from './demo-invite.ts'

/**
 * Spec for the site-gate cookie. These tests fail while `bricks_www_gate=1`
 * is treated as proof of the site password and as a substitute for the
 * demo-invite bearer secret.
 *
 * A fix must:
 * - refuse every gated path when the Cookie header carries the literal "1"
 *   (or any other value the client can choose without the server secret)
 * - accept only a cookie the gate issued for the password that is configured now
 * - stop honoring that cookie if the configured password changes
 * - refuse a mutated copy of an issued cookie
 * - refuse POST /api/demo/invite when the only credential is that client-chosen cookie
 */

const GATE_COOKIE = 'bricks_www_gate'
const DEMO_ACCESS_COOKIE = 'bricks_demo_access'
const PASSWORD_ENV = 'WWW_SITE_GATE_PASSWORD'
const INVITE_ENV = 'DEMO_INVITE_SECRET'

const PASSWORD_A = 'test-gate-password'
const PASSWORD_B = 'test-gate-password-other'
const INVITE_SECRET = 'test-invite-secret'

const GATED_PATHS = [
  '/',
  '/pricing',
  '/about',
  '/gallery',
  '/platform',
  '/service-areas',
  '/demo/invite',
  '/api/contact',
  '/api/newsletter',
]

let prevGate: string | undefined
let prevInvite: string | undefined

beforeEach(() => {
  prevGate = process.env[PASSWORD_ENV]
  prevInvite = process.env[INVITE_ENV]
})

afterEach(() => {
  restore(PASSWORD_ENV, prevGate)
  restore(INVITE_ENV, prevInvite)
})

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}

function gateCookie(value: string): string {
  return `${GATE_COOKIE}=${encodeURIComponent(value)}`
}

function request(pathname: string, cookie?: string): NextRequest {
  const headers = new Headers({ host: 'www.brxs.ca' })
  if (cookie !== undefined) headers.set('cookie', cookie)
  return new NextRequest(`https://www.brxs.ca${pathname}`, { headers })
}

function served(res: Response): boolean {
  return res.headers.get('x-middleware-next') === '1'
}

function assertGated(res: Response, pathname: string) {
  assert.equal(
    served(res),
    false,
    `${pathname} was served to a request that did not present a gate cookie bound to the configured password`,
  )
  assert.equal(res.status, 307, `${pathname} should redirect to the gate`)
  const location = res.headers.get('location') || ''
  assert.match(location, /\/gate(?:\?|$)/, `${pathname} redirected to ${location}`)
}

async function issueGateCookie(password: string): Promise<string> {
  const req = new NextRequest('https://www.brxs.ca/api/gate', {
    method: 'POST',
    headers: {
      host: 'www.brxs.ca',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })
  const res = await gatePost(req)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.ok, true)
  const value = res.cookies.get(GATE_COOKIE)?.value
  assert.equal(typeof value, 'string')
  assert.ok(value && value.length > 0)
  return value as string
}

describe('site gate cookie is not a client-chosen constant', () => {
  it('redirects gated pages when the cookie is the literal 1 and the gate password is set', () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    delete process.env[INVITE_ENV]
    for (const pathname of GATED_PATHS) {
      const res = middleware(request(pathname, gateCookie('1')))
      assertGated(res, pathname)
    }
  })

  it('redirects gated pages for other client-chosen cookie values', () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    const chosen = ['true', 'yes', '0', 'ok', PASSWORD_A, 'a'.repeat(64), '1.1', '1 ']
    for (const pathname of ['/pricing', '/gallery', '/api/contact']) {
      for (const value of chosen) {
        const res = middleware(request(pathname, gateCookie(value)))
        assertGated(res, pathname)
      }
      assertGated(middleware(request(pathname)), pathname)
    }
  })

  it('still serves public paths and still gates when the cookie is absent', () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    for (const pathname of ['/book', '/demo', '/demo/unlock', '/api/demo/invite', '/gate']) {
      assert.equal(served(middleware(request(pathname))), true, pathname)
      assert.equal(served(middleware(request(pathname, gateCookie('1')))), true, pathname)
    }
    assertGated(middleware(request('/pricing')), '/pricing')
  })

  it('serves gated pages only for the cookie the gate issued under the current password', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    delete process.env[INVITE_ENV]
    const issued = await issueGateCookie(PASSWORD_A)
    assert.notEqual(issued, '1')
    for (const pathname of GATED_PATHS) {
      assert.equal(
        served(middleware(request(pathname, gateCookie(issued)))),
        true,
        pathname,
      )
    }
    const flipped = issued.slice(0, -1) + (issued.endsWith('a') ? 'b' : 'a')
    assert.notEqual(flipped, issued)
    assertGated(middleware(request('/pricing', gateCookie(flipped))), '/pricing')
  })

  it('stops honoring a gate cookie after the configured password changes', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    const forA = await issueGateCookie(PASSWORD_A)
    process.env[PASSWORD_ENV] = PASSWORD_B
    const forB = await issueGateCookie(PASSWORD_B)
    assert.notEqual(forA, forB)
    assert.equal(served(middleware(request('/pricing', gateCookie(forB)))), true)
    assertGated(middleware(request('/pricing', gateCookie(forA))), '/pricing')
    assertGated(middleware(request('/about', gateCookie('1'))), '/about')
    process.env[PASSWORD_ENV] = PASSWORD_A
    assert.equal(served(middleware(request('/pricing', gateCookie(forA)))), true)
    assertGated(middleware(request('/pricing', gateCookie(forB))), '/pricing')
  })

  it('does not set a passing cookie when the password is wrong', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    const req = new NextRequest('https://www.brxs.ca/api/gate', {
      method: 'POST',
      headers: { host: 'www.brxs.ca', 'content-type': 'application/json' },
      body: JSON.stringify({ password: 'test-wrong-password' }),
    })
    const res = await gatePost(req)
    assert.equal(res.status, 401)
    assert.equal(res.cookies.get(GATE_COOKIE), undefined)
    const form = new NextRequest('https://www.brxs.ca/api/gate', {
      method: 'POST',
      headers: { host: 'www.brxs.ca', 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ password: 'test-wrong-password' }),
    })
    const formRes = await gatePost(form)
    assert.equal(formRes.status, 401)
    assert.equal(formRes.cookies.get(GATE_COOKIE), undefined)
  })

  it('issues the same kind of cookie from a form post as from JSON', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    const form = new NextRequest('https://www.brxs.ca/api/gate', {
      method: 'POST',
      headers: { host: 'www.brxs.ca', 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ password: PASSWORD_A }),
    })
    const res = await gatePost(form)
    assert.equal(res.status, 200)
    const issued = res.cookies.get(GATE_COOKIE)?.value
    assert.equal(typeof issued, 'string')
    assert.notEqual(issued, '1')
    assert.equal(served(middleware(request('/pricing', gateCookie(issued!)))), true)
    assertGated(middleware(request('/pricing', gateCookie('1'))), '/pricing')
  })
})

describe('demo invite does not accept the unsigned gate cookie', () => {
  async function postInvite(opts: {
    cookie?: string
    authorization?: string
    email?: string
    days?: number
  }) {
    const headers = new Headers({
      host: 'www.brxs.ca',
      'content-type': 'application/json',
    })
    if (opts.cookie !== undefined) headers.set('cookie', opts.cookie)
    if (opts.authorization) headers.set('authorization', opts.authorization)
    const req = new NextRequest('https://www.brxs.ca/api/demo/invite', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: opts.email ?? 'prospect@example.com',
        days: opts.days ?? 30,
      }),
    })
    const res = await invitePost(req)
    const body = (await res.json()) as { ok?: boolean; url?: string; error?: string; days?: number }
    return { res, body }
  }

  function tokenFrom(body: { url?: string }): string {
    assert.equal(typeof body.url, 'string')
    const url = new URL(body.url as string)
    const token = url.searchParams.get('t') || ''
    assert.ok(token.length > 0)
    return token
  }

  it('does not mint a 30-day invite, and does not unlock the demo, for cookie=1', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    process.env[INVITE_ENV] = INVITE_SECRET
    const { res, body } = await postInvite({ cookie: gateCookie('1'), days: 30 })
    if (res.status !== 401 || body.ok === true || body.url) {
      const token = body.url ? new URL(body.url).searchParams.get('t') || '' : ''
      const verified = token ? verifyDemoInvite(token) : { ok: false as const, reason: 'absent' }
      let access = 'absent'
      if (token && verified.ok) {
        const unlock = await unlockGet(
          new NextRequest(`https://www.brxs.ca/demo/unlock?t=${encodeURIComponent(token)}`),
        )
        if (unlock.cookies.get(DEMO_ACCESS_COOKIE)?.value) access = 'set'
      }
      assert.fail(
        `forged gate cookie minted an invite (status ${res.status}, verify ${verified.ok}, demo access cookie ${access})`,
      )
    }
    assert.equal(res.status, 401)
    assert.equal(body.ok, false)
    assert.equal(body.url, undefined)
  })

  it('does not mint when the gate password is unset and only the invite secret is configured', async () => {
    delete process.env[PASSWORD_ENV]
    process.env[INVITE_ENV] = INVITE_SECRET
    const { res, body } = await postInvite({ cookie: gateCookie('1'), days: 30 })
    assert.equal(res.status, 401)
    assert.equal(body.ok, false)
    assert.equal(body.url, undefined)
  })

  it('does not mint for a client-chosen cookie when the invite secret falls back to the gate password', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    delete process.env[INVITE_ENV]
    for (const value of ['1', 'true', PASSWORD_A]) {
      const { res, body } = await postInvite({ cookie: gateCookie(value) })
      assert.equal(res.status, 401, value)
      assert.equal(body.url, undefined, value)
    }
  })

  it('still mints for the invite bearer secret, and that link sets the demo access cookie', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    process.env[INVITE_ENV] = INVITE_SECRET
    const { res, body } = await postInvite({
      authorization: `Bearer ${INVITE_SECRET}`,
      email: 'prospect@example.com',
      days: 30,
    })
    assert.equal(res.status, 200)
    assert.equal(body.ok, true)
    assert.equal(body.days, 30)
    const token = tokenFrom(body)
    const verified = verifyDemoInvite(token)
    assert.equal(verified.ok, true)
    if (verified.ok) assert.equal(verified.payload.email, 'prospect@example.com')
    const unlock = await unlockGet(
      new NextRequest(`https://www.brxs.ca/demo/unlock?t=${encodeURIComponent(token)}`),
    )
    assert.equal(unlock.status, 307)
    assert.match(unlock.headers.get('location') || '', /\/demo$/)
    assert.equal(unlock.cookies.get(DEMO_ACCESS_COOKIE)?.value, token)
  })

  it('rejects a bearer secret that is not the configured one', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    process.env[INVITE_ENV] = INVITE_SECRET
    const { res, body } = await postInvite({ authorization: 'Bearer test-wrong-invite-secret' })
    assert.equal(res.status, 401)
    assert.equal(body.url, undefined)
  })

  it('does not accept a mutated gate cookie in place of the bearer secret', async () => {
    process.env[PASSWORD_ENV] = PASSWORD_A
    process.env[INVITE_ENV] = INVITE_SECRET
    const issued = await issueGateCookie(PASSWORD_A)
    const flipped = issued.slice(0, -1) + (issued.endsWith('a') ? 'b' : 'a')
    const { res, body } = await postInvite({ cookie: gateCookie(flipped) })
    assert.equal(res.status, 401)
    assert.equal(body.url, undefined)
    const literal = await postInvite({ cookie: gateCookie('1') })
    assert.equal(literal.res.status, 401)
    assert.equal(literal.body.url, undefined)
  })
})

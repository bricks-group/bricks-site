import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { hasSignedInHint, osLogoutUrl, clearHintCookies, AUTH_HEAD_SCRIPT, HINT_COOKIE } from './site-session'

describe('site session hint', () => {
  it('reads only an exact bricks_signed_in=1', () => {
    assert.equal(hasSignedInHint('bricks_signed_in=1'), true)
    assert.equal(hasSignedInHint('a=b; bricks_signed_in=1; c=d'), true)
    assert.equal(hasSignedInHint(''), false)
    assert.equal(hasSignedInHint('bricks_signed_in='), false)
    assert.equal(hasSignedInHint('bricks_signed_in=10'), false)
    assert.equal(hasSignedInHint('xbricks_signed_in=1'), false)
  })

  it('logs out through app.brxs.ca and comes back', () => {
    assert.equal(osLogoutUrl('https://www.brxs.ca/'), 'https://app.brxs.ca/logout?next=https%3A%2F%2Fwww.brxs.ca%2F')
  })

  it('clears the parent-domain hint on brxs.ca, host-only elsewhere', () => {
    const www = clearHintCookies('www.brxs.ca')
    assert.equal(www.length, 2)
    assert.ok(www[0].includes('Domain=.brxs.ca') && www[0].includes('Max-Age=0'))
    const preview = clearHintCookies('bricks-site-git-x-akasm.vercel.app')
    assert.equal(preview.length, 1)
    assert.ok(!preview[0].includes('Domain='))
  })

  it('head script matches the same cookie and runs standalone', () => {
    assert.ok(AUTH_HEAD_SCRIPT.includes(HINT_COOKIE))
    const attrs: Record<string, string> = {}
    const g = globalThis as Record<string, unknown>
    const prev = { document: g.document, addEventListener: g.addEventListener }
    g.addEventListener = () => {}
    for (const [cookie, want] of [['bricks_signed_in=1', 'in'], ['x=1', 'out']] as const) {
      g.document = { cookie, hidden: false, addEventListener() {}, documentElement: { setAttribute: (k: string, v: string) => { attrs[k] = v } } }
      new Function(AUTH_HEAD_SCRIPT)()
      assert.equal(attrs['data-bx-auth'], want)
    }
    g.document = prev.document
    g.addEventListener = prev.addEventListener
  })
})

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { CONFIRM_TTL_SEC, confirmToken, normEmail, signToken, unsubscribeToken, verifyToken } from './token'
import { confirmEmail, listUnsubscribeHeaders, maskEmail, newsletterEmail } from './email'
import { siteBase } from './config'
import { subscribeContact, unsubscribeContact } from './resend'

const S = 'test-secret-not-real'

describe('newsletter tokens', () => {
  it('round-trips confirm and unsubscribe tokens', () => {
    const c = verifyToken(S, confirmToken(S, 'a@b.ca', 'newsletter:page'), 'c')
    assert.deepEqual(c.ok && [c.email, c.source], ['a@b.ca', 'newsletter:page'])
    const u = verifyToken(S, unsubscribeToken(S, 'a@b.ca'), 'u')
    assert.equal(u.ok && u.email, 'a@b.ca')
  })
  it('rejects tampered, wrong-secret, wrong-purpose and junk tokens', () => {
    const t = unsubscribeToken(S, 'a@b.ca')
    const forged = Buffer.from(JSON.stringify({ p: 'u', e: 'victim@b.ca', t: 0 })).toString('base64url') + '.' + t.split('.')[1]
    assert.equal(verifyToken(S, forged, 'u').ok, false)
    assert.equal(verifyToken('other', t, 'u').ok, false)
    assert.equal(verifyToken(S, t, 'c').ok, false)
    assert.equal(verifyToken(S, '', 'u').ok, false)
    assert.equal(verifyToken(S, 'a.b.c', 'u').ok, false)
    assert.equal(verifyToken('', t, 'u').ok, false)
  })
  it('expires confirm links after 7 days but never unsubscribe links', () => {
    const now = 2_000_000_000
    const c = confirmToken(S, 'a@b.ca', 'x', now)
    assert.equal(verifyToken(S, c, 'c', now + CONFIRM_TTL_SEC - 1).ok, true)
    const late = verifyToken(S, c, 'c', now + CONFIRM_TTL_SEC + 1)
    assert.equal(!late.ok && late.reason, 'expired')
    assert.equal(verifyToken(S, unsubscribeToken(S, 'a@b.ca'), 'u', now * 2).ok, true)
  })
  it('normalises emails and refuses bad ones', () => {
    assert.equal(normEmail('  A@B.CA '), 'a@b.ca')
    assert.equal(normEmail('nope'), '')
    assert.throws(() => signToken('', { p: 'u', e: 'a@b.ca', t: 0 }))
  })
})

describe('newsletter emails (CASL + RFC 8058)', () => {
  const base = 'https://www.brxs.ca'
  it('confirm email has sender, address, unsubscribe link and one-click headers', () => {
    const m = confirmEmail({ to: 'a@b.ca', base, confirmToken: 'CT', unsubToken: 'UT', postal: 'Bricks Group · 6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada' })
    assert.equal(m.from, 'Raphael at Bricks <hello@brxs.ca>')
    for (const body of [m.html, m.text]) {
      assert.match(body, /Bricks Group · 6330 Montevideo Road/)
      assert.equal((body.match(/Bricks Group/g) || []).length, 1)
      assert.match(body, /6330 Montevideo Road, Mississauga, ON L5N 3V2/)
      assert.match(body, /\/newsletter\/unsubscribe\?t=UT/)
      assert.match(body, /\/newsletter\/confirm\?t=CT/)
      assert.match(body, /Raphael/)
    }
    assert.equal(m.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click')
    assert.match(m.headers['List-Unsubscribe'], /^<https:\/\/www\.brxs\.ca\/api\/newsletter\/unsubscribe\?t=UT>, <mailto:hello@brxs\.ca\?subject=unsubscribe>$/)
  })
  it('wraps future newsletters with the same footer and headers', () => {
    const m = newsletterEmail({ to: 'a@b.ca', subject: 'S', bodyHtml: '<p>Hi</p>', bodyText: 'Hi', base, unsubToken: 'UT', postal: 'P' })
    assert.deepEqual(m.headers, listUnsubscribeHeaders(base, 'UT'))
    assert.match(m.html, /Unsubscribe/)
  })
  it('masks emails on pages', () => assert.equal(maskEmail('raph@brxs.ca'), 'r•••@brxs.ca'))
})

describe('siteBase', () => {
  it('pins production to www.brxs.ca and only trusts our hosts in preview', () => {
    assert.equal(siteBase('https://bricks-site-preview-nl.x.workers.dev', {}), 'https://www.brxs.ca')
    assert.equal(siteBase('https://bricks-site-preview-nl.x.workers.dev', { BRICKS_SITE_PREVIEW: '1' }), 'https://bricks-site-preview-nl.x.workers.dev')
    assert.equal(siteBase('https://evil.example', { BRICKS_SITE_PREVIEW: '1' }), 'https://www.brxs.ca')
    assert.equal(siteBase('https://evil.example', { NEWSLETTER_BASE_URL: 'https://www.brxs.ca/' }), 'https://www.brxs.ca')
    assert.equal(siteBase('https://www.brxs.ca', { NEWSLETTER_BASE_URL: 'https://www.brxs.ca' }), 'https://www.brxs.ca')
  })
})

function fakeFetch(routes: Array<[string, number]>) {
  const calls: string[] = []
  const f = (async (url: string, init: RequestInit) => {
    const key = `${init.method} ${String(url).replace('https://api.resend.com', '')}`
    calls.push(key)
    const hit = routes.find(([k]) => key.startsWith(k))
    return new Response('{}', { status: hit ? hit[1] : 500 })
  }) as unknown as typeof fetch
  return { f, calls }
}
const env = { NEWSLETTER_RESEND_KEY: 'k', NEWSLETTER_SEGMENT_ID: 'seg', RESEND_API_KEY: 's' }

describe('Resend contact sync', () => {
  it('creates a new contact in the segment', async () => {
    const { f, calls } = fakeFetch([['POST /contacts', 200]])
    assert.deepEqual(await subscribeContact('a@b.ca', { signup_source: 'x', consent_at: 'y' }, env, f), { ok: true })
    assert.deepEqual(calls, ['POST /contacts'])
  })
  it('resubscribes an existing contact and adds it to the segment', async () => {
    const { f, calls } = fakeFetch([['POST /contacts/a%40b.ca/segments/seg', 200], ['POST /contacts', 409], ['PATCH /contacts/a%40b.ca', 200]])
    assert.equal((await subscribeContact('a@b.ca', { signup_source: 'x', consent_at: 'y' }, env, f)).ok, true)
    assert.deepEqual(calls, ['POST /contacts', 'PATCH /contacts/a%40b.ca', 'POST /contacts/a%40b.ca/segments/seg'])
  })
  it('stores unknown addresses as unsubscribed', async () => {
    const { f, calls } = fakeFetch([['PATCH /contacts/a%40b.ca', 404], ['POST /contacts', 200]])
    assert.equal((await unsubscribeContact('a@b.ca', env, f)).ok, true)
    assert.deepEqual(calls, ['PATCH /contacts/a%40b.ca', 'POST /contacts'])
  })
  it('fails closed without config', async () => {
    assert.equal((await subscribeContact('a@b.ca', { signup_source: 'x', consent_at: 'y' }, {}, fetch)).ok, false) // no contacts key
  })
})

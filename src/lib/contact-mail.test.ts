import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { CONTACT_INBOX, SMOKE_TAG, recipientFor, resendPayload, sendContactMessage } from './contact-mail'

const real = { name: 'Pat', email: 'pat@example.com', message: 'Hi' }
const smoke = { name: 'QA', email: 'admin@brxs.ca', message: `Notes: ${SMOKE_TAG}` }

function fakeFetch(status = 200, body: unknown = { id: 'e1' }) {
  const calls: { url: string; init: RequestInit }[] = []
  const f = (async (url: string, init: RequestInit) => {
    calls.push({ url, init })
    return new Response(JSON.stringify(body), { status })
  }) as unknown as typeof fetch
  return { f, calls }
}

test('real messages go to the contact inbox, smoke tests only to admin@brxs.ca', () => {
  assert.equal(recipientFor(real), CONTACT_INBOX)
  assert.equal(recipientFor(smoke), 'admin@brxs.ca')
  assert.equal(recipientFor({ ...real, message: SMOKE_TAG }), CONTACT_INBOX) // tag alone is not enough
  assert.equal(recipientFor({ ...smoke, message: 'no tag' }), CONTACT_INBOX)
  assert.match(resendPayload(smoke, 'x').subject, /^\[SMOKE TEST\]/)
})

test('sends through Resend when RESEND_API_KEY is set (no edge function call)', async () => {
  const { f, calls } = fakeFetch()
  const r = await sendContactMessage(real, { sourceLabel: 't', supabaseUrl: 'https://sb', supabaseKey: 'k', env: { RESEND_API_KEY: 're_test' }, fetchImpl: f })
  assert.deepEqual(r, { ok: true, via: 'resend' })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, 'https://api.resend.com/emails')
  const sent = JSON.parse(String(calls[0].init.body))
  assert.deepEqual(sent.to, [CONTACT_INBOX])
  assert.deepEqual(sent.reply_to, ['pat@example.com'])
})

test('Resend failure is a 502, not a fake success', async () => {
  const { f } = fakeFetch(403, { message: 'nope' })
  const r = await sendContactMessage(real, { sourceLabel: 't', supabaseUrl: '', supabaseKey: '', env: { RESEND_API_KEY: 're_test' }, fetchImpl: f })
  assert.equal(r.ok, false)
  assert.equal(!r.ok && r.status, 502)
})

test('falls back to the contact-message edge function without RESEND_API_KEY', async () => {
  const { f, calls } = fakeFetch(200, { ok: true })
  const r = await sendContactMessage(real, { sourceLabel: 't', supabaseUrl: 'https://sb', supabaseKey: 'k', env: {}, fetchImpl: f })
  assert.deepEqual(r, { ok: true, via: 'edge' })
  assert.equal(calls[0].url, 'https://sb/functions/v1/contact-message')
  const { f: f2 } = fakeFetch(500, { ok: false, error: 'Email service not configured.' })
  const r2 = await sendContactMessage(real, { sourceLabel: 't', supabaseUrl: 'https://sb', supabaseKey: 'k', env: {}, fetchImpl: f2 })
  assert.equal(!r2.ok && r2.status, 502)
})

test('both form routes use the shared sender', () => {
  for (const p of ['src/app/api/contact/route.ts', 'src/app/api/book/property-request/route.ts']) {
    const s = readFileSync(p, 'utf8')
    assert.match(s, /sendContactMessage\(/)
    assert.doesNotMatch(s, /functions\/v1\/contact-message/)
  }
})

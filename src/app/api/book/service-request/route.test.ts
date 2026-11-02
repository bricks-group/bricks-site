import { test } from 'node:test'
import assert from 'node:assert/strict'

process.env.RESEND_API_KEY = 'test-resend'
delete process.env.SUPABASE_SERVICE_ROLE_KEY

const sent: string[] = []
globalThis.fetch = (async (url: string, init: RequestInit) => {
  if (String(url).startsWith('https://api.resend.com')) { sent.push(JSON.parse(String(init.body)).to?.[0] ?? '?'); return new Response('{"id":"x"}', { status: 200 }) }
  return new Response('{}', { status: 404 })
}) as typeof fetch

const body = (email: string) => JSON.stringify({ trade: 'cleaning', clientType: 'agent', name: 'Test', email, address: '1 Main St, Toronto' })

test('service-request: legit requests send, 4th from same email is 429 with no email', async () => {
  const { POST } = await import('./route')
  const { NextRequest } = await import('next/server')
  const { TRADES } = await import('@/lib/services')
  const slug = TRADES[0].slug
  const req = (email: string, ip: string) => new NextRequest('https://www.brxs.ca/api/book/service-request', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: body(email).replace('cleaning', slug),
  })
  const statuses: number[] = []
  for (let i = 0; i < 3; i++) statuses.push((await POST(req('legit@example.com', `20.0.0.${i}`))).status)
  assert.deepEqual(statuses, [200, 200, 200])
  const before = sent.length
  assert.ok(before >= 3, 'emails went out for legit requests')
  const r4 = await POST(req('legit@example.com', '20.0.0.9'))
  assert.equal(r4.status, 429)
  assert.equal(r4.headers.get('retry-after'), '3600')
  assert.equal(sent.length, before, 'no email on rejected request')
  // a different person is still served
  assert.equal((await POST(req('other@example.com', '20.0.1.1'))).status, 200)
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkRules, clientIp, fallbackStore, memoryStore, serviceRequestRules, supabaseStore, type Store } from './rate-limit'

test('memory store: fixed window resets after windowSec', async () => {
  const s = memoryStore()
  assert.equal(await s.hit('k', 60, 0), 1)
  assert.equal(await s.hit('k', 60, 1000), 2)
  assert.equal(await s.hit('k', 60, 61_000), 1)
})

test('service request: 3 per email per hour, 4th rejected', async () => {
  const s = memoryStore()
  const ok = []
  for (let i = 0; i < 4; i++) ok.push((await checkRules(serviceRequestRules(`10.0.0.${i}`, 'A@x.com'), s, 1000 + i)).ok)
  assert.deepEqual(ok, [true, true, true, false])
  // email is case-insensitive
  assert.equal((await checkRules(serviceRequestRules('10.9.9.9', ' a@X.com '), s, 2000)).ok, false)
  // another email from a fresh IP is unaffected
  assert.equal((await checkRules(serviceRequestRules('10.9.9.8', 'b@x.com'), s, 2000)).ok, true)
})

test('service request: 5 per IP per hour, 6th rejected even with new emails', async () => {
  const s = memoryStore()
  const ok = []
  for (let i = 0; i < 6; i++) ok.push((await checkRules(serviceRequestRules('1.2.3.4', `u${i}@x.com`), s, 1000)).ok)
  assert.deepEqual(ok, [true, true, true, true, true, false])
  const later = await checkRules(serviceRequestRules('1.2.3.4', 'u9@x.com'), s, 1000 + 3600_000)
  assert.equal(later.ok, true)
})

test('rejection reports rule and retry-after', async () => {
  const s = memoryStore()
  for (let i = 0; i < 3; i++) await checkRules(serviceRequestRules(`ip${i}`, 'c@x.com'), s, 0)
  const d = await checkRules(serviceRequestRules('ip9', 'c@x.com'), s, 0)
  assert.deepEqual(d, { ok: false, rule: 'sr-email', retryAfterSec: 3600 })
})

test('clientIp: first x-forwarded-for hop, then x-real-ip, then unknown', () => {
  assert.equal(clientIp(new Headers({ 'x-forwarded-for': '9.9.9.9, 10.0.0.1' })), '9.9.9.9')
  assert.equal(clientIp(new Headers({ 'x-real-ip': '8.8.8.8' })), '8.8.8.8')
  assert.equal(clientIp(new Headers()), 'unknown')
})

test('supabase store posts key to RPC and reads count', async () => {
  let body: any
  const f = (async (_u: string, init: RequestInit) => { body = JSON.parse(String(init.body)); return new Response('2', { status: 200 }) }) as typeof fetch
  const n = await supabaseStore('https://x.supabase.co', 'k', f).hit('sr-email:abc', 3600, 0)
  assert.equal(n, 2)
  assert.deepEqual(body, { p_key: 'sr-email:abc', p_window_seconds: 3600 })
})

test('fallback store uses memory when durable store errors (table not migrated)', async () => {
  let calls = 0
  const broken: Store = { async hit() { calls++; throw new Error('rate_store_404') } }
  const s = fallbackStore(broken, memoryStore())
  assert.equal(await s.hit('k', 60, 0), 1)
  assert.equal(await s.hit('k', 60, 1), 2)
  assert.equal(calls, 1) // cooled down, not retried every request
})

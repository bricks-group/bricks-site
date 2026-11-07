import test from 'node:test'
import assert from 'node:assert/strict'
import { adminFromAccessToken, signInWithPassword, signInWithEmailCode, sendEmailCode } from './account-signin'

const env = { SUPABASE_URL: 'https://x.supabase.co', SUPABASE_ANON_KEY: 'anon', SUPABASE_SERVICE_ROLE_KEY: 'svc' }
const ID = '0c3fa7c2-d23b-4e44-90ad-ab2d19af2580'
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status })
function fake(owner: unknown, opts: { tokenOk?: boolean; userOk?: boolean; rows?: unknown } = {}) {
  const calls: string[] = []
  const f = (async (u: string | URL) => {
    const s = String(u); calls.push(s)
    if (s.includes('/auth/v1/token') || s.includes('/auth/v1/verify')) return opts.tokenOk === false ? json({}, 400) : json({ access_token: 'tok' })
    if (s.includes('/auth/v1/otp')) return json({})
    if (s.includes('/auth/v1/user')) return opts.userOk === false ? json({}, 401) : json({ id: ID })
    if (s.includes('/rest/v1/users')) return json(opts.rows ?? [{ id: ID, is_platform_owner: owner }])
    return json({}, 404)
  }) as typeof fetch
  return { f, calls }
}

test('platform owner signs in with password', async () => {
  const { f } = fake(true)
  assert.deepEqual(await signInWithPassword('Akash@Example.com ', 'pw', env, f), { ok: true, userId: ID })
})
test('non-owner is refused', async () => {
  assert.equal((await signInWithPassword('a@b.co', 'pw', env, fake(false).f)).ok, false)
  assert.equal((await signInWithPassword('a@b.co', 'pw', env, fake('true').f)).ok, false)
  assert.equal((await signInWithPassword('a@b.co', 'pw', env, fake(true, { rows: [] }).f)).ok, false)
})
test('bad password or token fails closed', async () => {
  assert.deepEqual(await signInWithPassword('a@b.co', 'pw', env, fake(true, { tokenOk: false }).f), { ok: false, reason: 'credentials' })
  assert.equal((await adminFromAccessToken('tok', env, fake(true, { userOk: false }).f)).ok, false)
  assert.equal((await adminFromAccessToken('', env, fake(true).f)).ok, false)
})
test('missing config fails closed', async () => {
  assert.deepEqual(await signInWithPassword('a@b.co', 'pw', {}, fake(true).f), { ok: false, reason: 'config' })
})
test('email code flow never creates accounts', async () => {
  const { f, calls } = fake(true)
  assert.equal(await sendEmailCode('a@b.co', env, f), true)
  assert.ok(calls[0].endsWith('/auth/v1/otp'))
  assert.equal((await signInWithEmailCode('a@b.co', '123456', env, f)).ok, true)
  assert.equal((await signInWithEmailCode('a@b.co', 'abc', env, f)).ok, false)
})
test('network error fails closed', async () => {
  const boom = (async () => { throw new Error('x') }) as typeof fetch
  assert.equal((await signInWithPassword('a@b.co', 'pw', env, boom)).ok, false)
})

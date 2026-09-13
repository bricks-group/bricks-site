import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import {
  clampInviteDays,
  mintDemoInvite,
  remainingMaxAge,
  verifyDemoInvite,
} from './demo-invite.ts'

describe('demo-invite', () => {
  const prevInvite = process.env.DEMO_INVITE_SECRET
  const prevGate = process.env.WWW_SITE_GATE_PASSWORD

  before(() => {
    process.env.DEMO_INVITE_SECRET = 'test-invite-secret-xyz'
    delete process.env.WWW_SITE_GATE_PASSWORD
  })

  after(() => {
    if (prevInvite === undefined) delete process.env.DEMO_INVITE_SECRET
    else process.env.DEMO_INVITE_SECRET = prevInvite
    if (prevGate === undefined) delete process.env.WWW_SITE_GATE_PASSWORD
    else process.env.WWW_SITE_GATE_PASSWORD = prevGate
  })

  it('clamps days to 1–30', () => {
    assert.equal(clampInviteDays(undefined), 7)
    assert.equal(clampInviteDays(0), 1)
    assert.equal(clampInviteDays(99), 30)
    assert.equal(clampInviteDays(14), 14)
  })

  it('mints and verifies a token', () => {
    const now = 1_700_000_000
    const { token, exp } = mintDemoInvite({ email: 'a@b.co', days: 7, now })
    assert.match(token, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    const v = verifyDemoInvite(token, { now })
    assert.equal(v.ok, true)
    if (v.ok) {
      assert.equal(v.payload.email, 'a@b.co')
      assert.equal(v.payload.exp, exp)
      assert.ok(v.payload.jti.length >= 16)
    }
  })

  it('rejects tampered and expired tokens', () => {
    const now = 1_700_000_000
    const { token } = mintDemoInvite({ days: 1, now })
    const bad = token.slice(0, -2) + 'xx'
    assert.equal(verifyDemoInvite(bad, { now }).ok, false)
    assert.equal(verifyDemoInvite(token, { now: now + 2 * 24 * 3600 }).ok, false)
  })

  it('remainingMaxAge matches exp', () => {
    assert.equal(remainingMaxAge(100, 40), 60)
    assert.equal(remainingMaxAge(40, 100), 0)
  })
})

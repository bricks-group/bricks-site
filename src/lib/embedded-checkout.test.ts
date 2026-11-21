import { test } from 'node:test'
import assert from 'node:assert/strict'
import { embeddedPublishableKey, wantsEmbedded } from './embedded-checkout'

test('embedded only when asked', () => {
  assert.equal(wantsEmbedded({ ui_mode: 'embedded' }), true)
  assert.equal(wantsEmbedded({ ui_mode: 'EMBEDDED_PAGE' }), true)
  assert.equal(wantsEmbedded({}), false)
  assert.equal(wantsEmbedded({ ui_mode: 'hosted' }), false)
})

test('publishable key must exist and match the secret key mode', () => {
  assert.equal(embeddedPublishableKey('sk_test_x', {}), null)
  assert.equal(embeddedPublishableKey('sk_test_x', { STRIPE_PUBLISHABLE_KEY: 'nope' }), null)
  assert.equal(embeddedPublishableKey('sk_test_x', { STRIPE_PUBLISHABLE_KEY: 'pk_test_a' }), 'pk_test_a')
  assert.equal(embeddedPublishableKey('sk_live_x', { STRIPE_PUBLISHABLE_KEY: 'pk_test_a' }), null)
  assert.equal(embeddedPublishableKey('sk_test_x', { STRIPE_PUBLISHABLE_KEY: 'pk_live_a' }), null)
  assert.equal(embeddedPublishableKey('rk_live_x', { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ' pk_live_b ' }), 'pk_live_b')
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { allRead, isScrolledToEnd, lockedReason } from './legal-docs'

test('scrolled to end within 24px slack', () => {
  assert.equal(isScrolledToEnd({ scrollTop: 0, scrollHeight: 2000, clientHeight: 600 }), false)
  assert.equal(isScrolledToEnd({ scrollTop: 1375, scrollHeight: 2000, clientHeight: 600 }), false)
  assert.equal(isScrolledToEnd({ scrollTop: 1376, scrollHeight: 2000, clientHeight: 600 }), true)
  assert.equal(isScrolledToEnd({ scrollTop: 1400, scrollHeight: 2000, clientHeight: 600 }), true)
})

test('short document that does not overflow counts as read', () => {
  assert.equal(isScrolledToEnd({ scrollTop: 0, scrollHeight: 400, clientHeight: 600 }), true)
})

test('agree unlocks only once every document is read', () => {
  assert.equal(allRead(['terms', 'privacy'], {}), false)
  assert.equal(allRead(['terms', 'privacy'], { terms: true }), false)
  assert.equal(allRead(['terms', 'privacy'], { terms: true, privacy: true }), true)
  assert.equal(allRead([], {}), false)
})

test('locked reason names what is left', () => {
  assert.match(lockedReason(['terms', 'privacy'], {}), /terms of service and the privacy policy/)
  assert.match(lockedReason(['terms', 'privacy'], { terms: true }), /^Open the privacy policy/)
  assert.equal(lockedReason(['terms', 'privacy'], { terms: true, privacy: true }), '')
})

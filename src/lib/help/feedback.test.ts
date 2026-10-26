import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { feedbackMessage, parseFeedback } from './feedback.ts'
import { resendPayload } from '../contact-mail.ts'

describe('help feedback', () => {
  it('accepts a vote on a help page', () => {
    const r = parseFeedback({ path: '/help/booking/book-a-shoot', helpful: true })
    assert.equal(r.ok, true)
  })
  it('rejects other pages, missing votes, bad emails and long notes', () => {
    assert.equal(parseFeedback({ path: '/pricing', helpful: true }).ok, false)
    assert.equal(parseFeedback({ path: 'https://evil.example/help', helpful: true }).ok, false)
    assert.equal(parseFeedback({ path: '/help/a', helpful: 'yes' }).ok, false)
    assert.equal(parseFeedback({ path: '/help/a', helpful: false, email: 'nope' }).ok, false)
    assert.equal(parseFeedback({ path: '/help/a', helpful: false, note: 'x'.repeat(2001) }).ok, false)
  })
  it('emails the Bricks inbox with the page, vote and note', () => {
    const r = parseFeedback({ path: '/help/booking/book-a-shoot', helpful: false, note: 'Missing parking info', email: 'a@b.ca' })
    assert.ok(r.ok)
    const m = feedbackMessage(r.value)
    assert.equal(m.email, 'a@b.ca')
    assert.match(m.message, /Page: https:\/\/www\.brxs\.ca\/help\/booking\/book-a-shoot/)
    assert.match(m.message, /Helpful: no/)
    assert.match(m.message, /Missing parking info/)
    const payload = resendPayload(m, 'the Bricks help centre')
    assert.deepEqual(payload.to, ['hello@brxs.ca'])
  })
  it('falls back to the shared inbox as reply-to when no email is given', () => {
    const r = parseFeedback({ path: '/help', helpful: true })
    assert.ok(r.ok)
    assert.equal(feedbackMessage(r.value).email, 'hello@brxs.ca')
  })
})

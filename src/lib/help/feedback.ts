/**
 * "Was this helpful?" on help articles. Votes and notes are emailed to the
 * Bricks inbox through the same path as the contact form (lib/contact-mail.ts).
 */
import type { ContactMessage } from '../contact-mail'

export type FeedbackInput = { path?: unknown; helpful?: unknown; note?: unknown; email?: unknown }
export type Feedback = { path: string; helpful: boolean; note: string; email: string }

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function parseFeedback(body: FeedbackInput): { ok: true; value: Feedback } | { ok: false; error: string } {
  const path = typeof body.path === 'string' ? body.path.trim() : ''
  if (!/^\/help(\/[a-z0-9-]+){0,2}$/.test(path)) return { ok: false, error: 'Unknown page.' }
  if (typeof body.helpful !== 'boolean') return { ok: false, error: 'Say whether the page helped.' }
  const note = typeof body.note === 'string' ? body.note.trim() : ''
  if (note.length > 2000) return { ok: false, error: 'Keep the note under 2,000 characters.' }
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (email && !EMAIL.test(email)) return { ok: false, error: 'Check the email address.' }
  return { ok: true, value: { path, helpful: body.helpful, note, email } }
}

export function feedbackMessage(f: Feedback): ContactMessage {
  return {
    name: `Help centre feedback (${f.helpful ? 'helpful' : 'not helpful'})`,
    // Reply-to falls back to the shared inbox when the reader leaves no address.
    email: f.email || 'hello@brxs.ca',
    message: [
      `Page: https://www.brxs.ca${f.path}`,
      `Helpful: ${f.helpful ? 'yes' : 'no'}`,
      f.note ? `Note: ${f.note}` : 'Note: (none)',
      f.email ? `Reply to: ${f.email}` : 'Reply to: (not given)',
    ].join('\n'),
  }
}

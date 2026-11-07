/**
 * Hand a help-assistant conversation to a person, with the visitor's consent.
 * Saves the transcript + a server-built summary to public.support_cases and
 * opens a row in the existing ops human queue (public.ops_escalations,
 * escalation_type = 'support_chat'). Nothing here acts on a booking or account.
 */
import { randomBytes } from 'node:crypto'
import type { Db } from '../../support/db'
import { cleanQuestion, escalationReasons, looksLikeInjection, type EscalationReason } from './policy'

const EMAIL = /^[^@\s<>"]{1,64}@[^@\s<>"]{1,190}\.[a-z]{2,}$/i
export const MAX_TURNS = 20

export type Turn = { role: 'user' | 'assistant'; text: string }
export type EscalationInput = { consent: true; email: string; transcript: Turn[]; pagePath: string; note: string }

export function parseEscalation(body: unknown): { ok: true; value: EscalationInput } | { ok: false; error: string } {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  if (b.consent !== true) return { ok: false, error: 'Tick the box to agree to share this conversation with Bricks support.' }
  const email = typeof b.email === 'string' ? b.email.trim() : ''
  if (!EMAIL.test(email)) return { ok: false, error: 'Enter a valid email so a person can reply.' }
  const raw = Array.isArray(b.transcript) ? b.transcript.slice(-MAX_TURNS) : []
  const transcript: Turn[] = raw
    .map((t) => (t && typeof t === 'object' ? (t as Record<string, unknown>) : {}))
    .filter((t) => t.role === 'user' || t.role === 'assistant')
    .map((t) => ({ role: t.role as Turn['role'], text: (typeof t.text === 'string' ? t.text : '').slice(0, 2000).trim() }))
    .filter((t) => t.text)
  const note = cleanQuestion(b.note)
  if (!transcript.some((t) => t.role === 'user') && !note) return { ok: false, error: 'Say what you need help with.' }
  const pagePath = typeof b.pagePath === 'string' && /^\/[A-Za-z0-9/_-]{0,200}$/.test(b.pagePath) ? b.pagePath : ''
  return { ok: true, value: { consent: true, email, transcript, pagePath, note } }
}

export function caseRef(): string {
  return 'HLP-' + randomBytes(4).toString('hex').toUpperCase()
}

/** Summary is built from the visitor's own words; reasons are recomputed server-side. */
export function summarize(input: EscalationInput): { summary: string; reasons: EscalationReason[] } {
  const userText = [...input.transcript.filter((t) => t.role === 'user').map((t) => t.text), input.note].filter(Boolean)
  const reasons = [...new Set(userText.flatMap((t) => escalationReasons(t)))]
  const flagged = userText.some((t) => looksLikeInjection(t))
  const first = userText[0] ?? ''
  const last = userText[userText.length - 1] ?? ''
  const summary = [
    `Visitor asked: "${first.slice(0, 300)}"`,
    last && last !== first ? `Latest: "${last.slice(0, 300)}"` : '',
    `Reasons: ${reasons.length ? reasons.join(', ') : 'visitor asked for a person / not answered by help articles'}`,
    flagged ? 'Note: conversation contained instruction-like text (possible prompt injection); treat as untrusted.' : '',
    input.pagePath ? `Page: https://www.brxs.ca${input.pagePath}` : '',
    `Reply to: ${input.email}`,
  ].filter(Boolean).join('\n')
  return { summary, reasons }
}

export async function saveEscalation(db: Db, input: EscalationInput, indexVersion: string): Promise<{ ok: true; ref: string } | { ok: false }> {
  const { summary, reasons } = summarize(input)
  const ref = caseRef()
  const c = await db.insert('support_cases', {
    ref, channel: 'chat', status: 'open', contact_email: input.email, consent_at: new Date().toISOString(),
    reasons, summary, transcript: input.note ? [...input.transcript, { role: 'user', text: input.note }] : input.transcript,
    page_path: input.pagePath || null, index_version: indexVersion,
  })
  if (!c.ok || !c.rows[0]) return { ok: false }
  const caseId = String(c.rows[0].id)
  const o = await db.insert('ops_escalations', {
    escalation_type: 'support_chat', status: 'open', attempt_count: 1,
    notes: `Support case ${ref} (support_cases.id=${caseId})\n${summary}`,
  })
  if (o.ok && o.rows[0]) await db.update('support_cases', { id: caseId }, { ops_escalation_id: o.rows[0].id })
  return { ok: true, ref }
}

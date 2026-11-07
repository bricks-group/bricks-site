/**
 * help@brxs.ca inbound pipeline (Resend Receiving -> signed webhook -> Supabase).
 *
 * SHADOW MODE: every routine email gets a drafted reply in support_email_outbound
 * with status 'shadow'. Nothing is sent unless SUPPORT_AUTOSEND_ENABLED=true AND
 * SUPPORT_SHADOW_MODE=false AND the category is allowlisted AND sender auth passed.
 * Non-routine mail goes to ops_escalations with a suggested reply for Kam.
 *
 * Only mail addressed to help@ (or the dedicated receiving address) is processed.
 * hello@ and privacy@ are never stored or answered here.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Db } from './db'
import { respond } from '../help/assistant/answer'
import { buildIndex, SITE, type RetrievalIndex } from '../help/assistant/corpus'
import { retrieve, terms, coverage, type Retrieved } from '../help/assistant/retrieve'
import { escalationReasons, looksLikeInjection, type EscalationReason } from '../help/assistant/policy'

type Env = Record<string, string | undefined>

export const HELP_ADDRESS = 'help@brxs.ca'
export const NEVER_PROCESS = ['hello@brxs.ca', 'privacy@brxs.ca']
export const MAX_ATTEMPTS = 5

/* ---------- signature (Svix scheme used by Resend webhooks) ---------- */

export function verifySignature(secret: string, h: { id: string | null; timestamp: string | null; signature: string | null }, body: string, nowSec = Math.floor(Date.now() / 1000)): boolean {
  if (!secret || !h.id || !h.timestamp || !h.signature) return false
  const ts = Number(h.timestamp)
  if (!Number.isFinite(ts) || Math.abs(nowSec - ts) > 300) return false
  const key = Buffer.from(secret.startsWith('whsec_') ? secret.slice(6) : secret, 'base64')
  const expected = createHmac('sha256', key).update(`${h.id}.${h.timestamp}.${body}`).digest()
  for (const part of h.signature.split(' ')) {
    const [ver, sig] = part.split(',')
    if (ver !== 'v1' || !sig) continue
    const got = Buffer.from(sig, 'base64')
    if (got.length === expected.length && timingSafeEqual(got, expected)) return true
  }
  return false
}

export function signForTest(secret: string, id: string, timestamp: string, body: string): string {
  const key = Buffer.from(secret.startsWith('whsec_') ? secret.slice(6) : secret, 'base64')
  return 'v1,' + createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest('base64')
}

/* ---------- addressing, loops, bounces ---------- */

export const bare = (a: string) => (a.match(/<([^>]+)>/)?.[1] ?? a).trim().toLowerCase()

export function addressedToHelp(to: string[], receivedFor: string[], env: Env = process.env): boolean {
  const extra = (env.SUPPORT_INBOUND_ADDRESS || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean)
  const all = [...to, ...receivedFor].map(bare)
  return all.some((a) => a === HELP_ADDRESS || extra.includes(a))
}

export function onlyOtherInboxes(to: string[], receivedFor: string[]): boolean {
  const all = [...to, ...receivedFor].map(bare)
  return all.length > 0 && all.every((a) => NEVER_PROCESS.includes(a))
}

type Headers = Record<string, string>
const hdr = (h: Headers, k: string) => {
  const f = Object.keys(h).find((x) => x.toLowerCase() === k)
  return f ? String(h[f]) : ''
}

/** Returns why a message must not get an automated reply, or null. RFC 3834 + common bulk/bounce signals. */
export function suppressionReason(from: string, headers: Headers, subject: string): string | null {
  const f = bare(from)
  if (/^(mailer-daemon|postmaster|no-?reply|do-?not-?reply|bounce[s]?|notifications?)@/.test(f)) return 'system_sender'
  if (f.endsWith('@brxs.ca')) return 'own_domain'
  const auto = hdr(headers, 'auto-submitted').toLowerCase()
  if (auto && auto !== 'no') return 'auto_submitted'
  if (/^(bulk|junk|list|auto_reply)$/i.test(hdr(headers, 'precedence'))) return 'bulk_precedence'
  if (hdr(headers, 'x-autoreply') || hdr(headers, 'x-autorespond') || hdr(headers, 'x-auto-response-suppress').match(/all|oof|autoreply/i)) return 'auto_reply'
  if (hdr(headers, 'list-id') || hdr(headers, 'list-unsubscribe')) return 'mailing_list'
  if (/^(auto(matic)? reply|out of (the )?office|undeliver|delivery status notification|mail delivery (failed|subsystem)|returned mail)/i.test(subject.trim())) return 'auto_reply_subject'
  if (hdr(headers, 'x-bricks-support') ) return 'own_reply_loop'
  return null
}

/** Internal end-to-end test: own-domain sender + exact subject. Always shadow, never sent. */
export const TEST_SUBJECT = 'help@ pipeline test'
export function isInternalTest(from: string, subject: string): boolean {
  return bare(from).endsWith('@brxs.ca') && subject.trim().toLowerCase().startsWith(TEST_SUBJECT)
}

export function threadKey(msg: { references: string; inReplyTo: string; messageId: string; from: string; subject: string }): string {
  const refs = msg.references.split(/\s+/).filter(Boolean)
  const root = refs[0] || msg.inReplyTo || ''
  if (root) return `mid:${root.toLowerCase()}`
  const subj = msg.subject.replace(/^((re|fw|fwd|aw)\s*:\s*)+/i, '').trim().toLowerCase()
  return `sub:${bare(msg.from)}|${subj || msg.messageId.toLowerCase()}`
}

/* ---------- classification ---------- */

/** Routine categories: public policy questions fully answered by one help article. */
export const ROUTINE_SLUGS = new Set([
  'book-a-listing-shoot', 'packages-explained', 'how-pricing-works', 'add-ons', 'virtual-tour-or-virtual-visit', 'twilight-photos',
  'travel-fees', 'choose-a-shoot-time', 'prepare-for-a-shoot', 'drone-rules', 'what-you-get', 'using-your-media', 'booking-faq',
  'what-is-bricks', 'choose-an-account-type', 'create-an-account', 'sign-in-options', 'reset-your-password', 'book-without-an-account',
  'bricks-on-your-phone', 'plans-overview', 'monthly-or-yearly', 'site-progress-overview', 'apply-to-shoot', 'how-quote-requests-work',
])

export type Classification = {
  routine: boolean
  category: string
  reasons: (EscalationReason | 'not_in_help' | 'injection' | 'not_allowlisted' | 'sender_unverified')[]
  draft: string
  citations: { url: string; title: string }[]
  indexVersion: string
}

const slugOf = (url: string) => url.split('#')[0].split('/').pop() || ''

export async function classifyEmail(subject: string, text: string, auth: { dkim?: string; dmarc?: string } | null): Promise<Classification> {
  const body = text.split(/\n(?:On .{0,200}wrote:|-{2,}\s*Original Message|From: .*\n)/)[0].slice(0, 2000)
  // The internal test subject is a marker, not part of the question (it pulled in unrelated 'pipeline' articles).
  const subj = subject.trim().toLowerCase().startsWith(TEST_SUBJECT) ? subject.trim().slice(TEST_SUBJECT.length) : subject
  const question = `${subj}\n${body}`.slice(0, 600)
  const reasons: Classification['reasons'] = [...escalationReasons(`${subject}\n${body}`)]
  if (looksLikeInjection(`${subject}\n${body}`)) reasons.push('injection')
  const reply = await respond(question)
  const indexVersion = reply.indexVersion
  const top = reply.kind === 'answer' ? reply.citations[0] : undefined
  const category = top ? `article:${slugOf(top.url)}` : reply.kind
  if (reply.kind !== 'answer') reasons.push(reply.kind === 'escalate' ? 'not_allowlisted' : 'not_in_help')
  else if (!ROUTINE_SLUGS.has(slugOf(top!.url))) reasons.push('not_allowlisted')
  const authOk = auth ? auth.dkim === 'pass' || auth.dmarc === 'pass' : false
  if (!authOk) reasons.push('sender_unverified')
  const routine = reply.kind === 'answer' && reasons.length === 0
  const composed = reply.kind === 'answer' ? composeAnswer(question, reply.text, reply.citations) : null
  // Stored citations match the links actually shown in the draft.
  const citations = composed ? composed.links : reply.citations
  const draft = composed
    ? composed.text
    : `Hi,\n\nThanks for getting in touch. [KAM: answer here — this needs a person: ${[...new Set(reasons)].join(', ')}]\n\n${citations.length ? `Related help:\n${citations.slice(0, 3).map((c) => `- ${c.title}: ${c.url}`).join('\n')}\n\n` : ''}Bricks support`
  return { routine, category, reasons: [...new Set(reasons)], draft, citations, indexVersion }
}

/* ---------- reply composer ---------- */

/** Extra articles must be nearly as relevant as the matched one and cover most of the question. */
export const RELATED_MIN_SCORE_RATIO = 0.85
export const RELATED_MIN_COVERAGE = 0.6
export const MAX_RELATED = 2
const MAX_ANSWER_CHARS = 420

const sentencesOf = (t: string) => t.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean)
/** A sentence a person would write: starts with a capital or digit, ends with punctuation, has a few real words. */
const isComplete = (s: string) => /^[A-Z0-9"“$]/.test(s) && /[.!?]["”)]?$/.test(s) && s.split(/\s+/).length >= 4
/** Share of the smaller sentence's terms that the other repeats. High means the same point said twice. */
function overlap(a: string, b: string): number {
  const x = new Set(terms(a)), y = new Set(terms(b))
  if (!x.size || !y.size) return 0
  let n = 0
  for (const t of x) if (y.has(t)) n++
  return n / Math.min(x.size, y.size)
}

/** Pick up to 3 complete, non-repeating sentences from the matched article that best answer the question, in article order. */
export function answerSentences(question: string, text: string): string[] {
  const q = new Set(terms(question))
  const all = sentencesOf(text).map((s, i) => ({ s, i, n: new Set(terms(s).filter((t) => q.has(t))).size })).filter((x) => isComplete(x.s))
  // The article's own opening line is its cleanest summary, so it leads when it is on topic.
  const w = (x: { i: number; n: number }) => x.n + (x.i === 0 && x.n > 0 ? 1 : 0)
  const ranked = [...all].sort((a, b) => w(b) - w(a) || a.i - b.i)
  const picked: typeof all = []
  let len = 0
  for (const r of ranked) {
    if (picked.length >= 3) break
    if (picked.length && r.n === 0) break
    if (picked.some((p) => overlap(p.s, r.s) >= 0.6)) continue
    if (len + r.s.length + 1 > MAX_ANSWER_CHARS) continue
    picked.push(r)
    len += r.s.length + 1
  }
  return picked.sort((a, b) => a.i - b.i).map((p) => p.s)
}

/** Related articles worth showing: strong, on-topic, at most MAX_RELATED, and none when weak. */
export function relatedLinks(question: string, hits: Retrieved[], primaryUrl: string): { url: string; title: string }[] {
  const top = hits.find((h) => h.chunk.url === primaryUrl) ?? hits[0]
  if (!top) return []
  return hits
    .filter((h) => h.chunk.url !== primaryUrl)
    .filter((h) => h.score >= top.score * RELATED_MIN_SCORE_RATIO && coverage(question, h) >= RELATED_MIN_COVERAGE)
    .slice(0, MAX_RELATED)
    .map((h) => ({ url: h.chunk.url, title: h.chunk.title }))
}

export function composeAnswer(question: string, replyText: string, citations: { url: string; title: string }[], index: RetrievalIndex = buildIndex()): { text: string; links: { url: string; title: string }[] } {
  const primary = citations[0]
  const hits = retrieve(index, question, 4)
  const chunk = hits.find((h) => h.chunk.url === primary?.url)?.chunk
  // Extractive replies are rebuilt from the article itself; model replies are already prose.
  const fromArticle = chunk ? answerSentences(question, chunk.text) : []
  const answer = fromArticle.length
    ? fromArticle.join(' ')
    : replyText.replace(/^From the help article “[^”]+”[^:]*: /, '').trim()
  const related = primary ? relatedLinks(question, hits, primary.url) : []
  const lines = ['Hi,', '', `Thanks for your note. ${answer}`]
  if (primary) lines.push('', `There’s more in our help article “${primary.title}”: ${primary.url}`)
  if (related.length) lines.push('', 'You might also find these useful:', ...related.map((c) => `- ${c.title}: ${c.url}`))
  lines.push('', 'If that doesn’t cover it, just reply and someone on the team will help.', '', 'This answer was drafted automatically from our published help articles.', '', 'Bricks support')
  return { text: lines.join('\n'), links: primary ? [primary, ...related] : [] }
}

/* ---------- processing ---------- */

export type WebhookEvent = { type?: string; created_at?: string; data?: { email_id?: string; from?: string; to?: string[]; received_for?: string[]; subject?: string; message_id?: string } }
export type ReceivedEmail = { from: string; to: string[]; received_for?: string[]; subject: string; text?: string | null; html?: string | null; headers?: Headers; message_id?: string; created_at?: string; authentication?: { dkim?: string; dmarc?: string } | null }
export type FetchEmail = (id: string) => Promise<ReceivedEmail | null>

export type Flags = { enabled: boolean; shadow: boolean; autosend: boolean }
export function flags(env: Env = process.env): Flags {
  return {
    enabled: (env.SUPPORT_INBOUND_ENABLED || '').trim() === 'true',
    // Shadow is ON unless explicitly turned off.
    shadow: (env.SUPPORT_SHADOW_MODE || 'true').trim() !== 'false',
    autosend: (env.SUPPORT_AUTOSEND_ENABLED || '').trim() === 'true',
  }
}

export function resendFetcher(env: Env = process.env, f: typeof fetch = fetch): FetchEmail | null {
  const key = (env.RESEND_INBOUND_API_KEY || '').trim()
  if (!key) return null
  return async (id) => {
    const r = await f(`https://api.resend.com/emails/receiving/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${key}` } })
    if (r.status === 404) return null
    if (!r.ok) throw new Error(`resend_fetch_${r.status}`)
    return (await r.json()) as ReceivedEmail
  }
}

/** Resend sender for verified routine auto-replies. Marks mail so our own pipeline suppresses it (loop guard). */
export function resendSender(env: Env = process.env, f: typeof fetch = fetch) {
  const key = (env.RESEND_API_KEY || '').trim()
  if (!key) return undefined
  return async (o: { to: string; subject: string; text: string; inReplyTo: string; idempotencyKey: string }) => {
    const r = await f('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': o.idempotencyKey.slice(0, 256) },
      body: JSON.stringify({
        from: 'Bricks Support <help@brxs.ca>', to: [o.to], reply_to: 'help@brxs.ca', subject: o.subject, text: o.text,
        headers: { 'Auto-Submitted': 'auto-replied', 'X-Bricks-Support': '1', ...(o.inReplyTo ? { 'In-Reply-To': o.inReplyTo, References: o.inReplyTo } : {}) },
      }),
    })
    if (!r.ok) throw new Error(`resend_send_${r.status}`)
    const j = (await r.json()) as { id?: string }
    return { id: j.id ?? '' }
  }
}

export type Outcome = { http: number; status: string; detail?: string }

const htmlToText = (h: string) => h.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, ' ').replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/[ \t]+/g, ' ').trim()

export async function processEvent(svixId: string, ev: WebhookEvent, deps: { db: Db; fetchEmail: FetchEmail | null; flags: Flags; env?: Env; send?: (o: { to: string; subject: string; text: string; inReplyTo: string; idempotencyKey: string }) => Promise<{ id: string }> }): Promise<Outcome> {
  const { db } = deps
  const env = deps.env ?? process.env
  if (ev.type !== 'email.received' || !ev.data?.email_id) return { http: 200, status: 'ignored', detail: 'event_type' }
  const meta = ev.data
  const to = meta.to ?? [], rf = meta.received_for ?? []

  // Never touch hello@/privacy@ mail; don't even store its metadata.
  if (!addressedToHelp(to, rf, env)) return { http: 200, status: 'ignored', detail: onlyOtherInboxes(to, rf) ? 'other_inbox' : 'not_help' }

  // Dedupe on the webhook delivery id. A replay of a finished event is a no-op.
  const ins = await db.insert('support_email_events', {
    provider_event_id: svixId, email_id: meta.email_id, event_type: ev.type, status: 'received',
    payload: { from: meta.from, to, received_for: rf, subject: meta.subject, message_id: meta.message_id, created_at: ev.created_at },
  }, { onConflict: 'provider_event_id', ignoreDuplicates: true })
  let attempts = 0
  if (!ins.rows.length) {
    const ex = await db.select('support_email_events', `provider_event_id=eq.${encodeURIComponent(svixId)}&select=status,attempts`)
    const row = ex.rows[0]
    if (row && ['processed', 'ignored', 'suppressed', 'dead_letter'].includes(String(row.status))) return { http: 200, status: 'duplicate' }
    attempts = Number(row?.attempts ?? 0)
  }
  attempts++
  const mark = (status: string, last_error: string | null = null) =>
    db.update('support_email_events', { provider_event_id: svixId }, { status, attempts, last_error, updated_at: new Date().toISOString() })

  if (!deps.fetchEmail) {
    await mark('pending_fetch', 'RESEND_INBOUND_API_KEY not set')
    return { http: 200, status: 'pending_fetch' }
  }
  let email: ReceivedEmail | null
  try {
    email = await deps.fetchEmail(meta.email_id!)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'fetch_failed'
    if (attempts >= MAX_ATTEMPTS) { await mark('dead_letter', msg); return { http: 200, status: 'dead_letter' } }
    await mark('failed', msg)
    return { http: 500, status: 'retry', detail: msg } // non-2xx -> Resend retries with backoff
  }
  if (!email) { await mark('dead_letter', 'email_not_found'); return { http: 200, status: 'dead_letter' } }

  const headers = email.headers ?? {}
  const from = bare(email.from || meta.from || '')
  const subject = (email.subject || meta.subject || '').slice(0, 300)
  const text = (email.text || (email.html ? htmlToText(email.html) : '')).slice(0, 20_000)
  const messageId = (email.message_id || meta.message_id || '').trim()
  const tKey = threadKey({ references: hdr(headers, 'references'), inReplyTo: hdr(headers, 'in-reply-to'), messageId, from, subject })

  const th = await db.insert('support_email_threads', { thread_key: tKey, subject, customer_email: from, last_message_at: new Date().toISOString() }, { onConflict: 'thread_key' })
  const threadId = String(th.rows[0]?.id ?? '')
  if (!threadId) { await mark('failed', 'thread_upsert'); return { http: 500, status: 'retry' } }

  const internalTest = isInternalTest(from, subject)
  const suppressed = internalTest ? null : suppressionReason(from, headers, subject)
  const cls = suppressed ? null : await classifyEmail(subject, text, email.authentication ?? null)
  const msg = await db.insert('support_email_messages', {
    thread_id: threadId, direction: 'inbound', provider_email_id: meta.email_id, rfc_message_id: messageId || null,
    in_reply_to: hdr(headers, 'in-reply-to') || null, references_header: hdr(headers, 'references') || null,
    from_email: from, to_emails: [...to, ...rf].map(bare), subject, text_body: text, received_at: email.created_at || ev.created_at || null,
    classification: cls ? { test: internalTest, routine: cls.routine, category: cls.category, reasons: cls.reasons, index_version: cls.indexVersion, auth: email.authentication ?? null } : null,
    suppressed_reason: suppressed,
  }, { onConflict: 'provider_email_id', ignoreDuplicates: true })
  const messageRowId = msg.rows[0]?.id ?? null

  if (suppressed || !cls) { await mark('suppressed', suppressed); return { http: 200, status: 'suppressed', detail: suppressed ?? '' } }

  let opsId: unknown = null
  if (!cls.routine) {
    const o = await db.insert('ops_escalations', {
      escalation_type: 'support_email', status: 'open', attempt_count: 1,
      notes: `${internalTest ? '[INTERNAL TEST] ' : ''}help@ email from ${from}: "${subject}"\nReasons: ${cls.reasons.join(', ')}\nThread: support_email_threads.id=${threadId}\n--- Suggested reply ---\n${cls.draft}`.slice(0, 8000),
    })
    opsId = o.rows[0]?.id ?? null
  }
  // Ledger: one row per inbound email, ever (idempotency key = provider email id).
  // Auto-send needs: routine + both flags + not a test + no auto reply on this thread in the last 24h (loop guard).
  let canAuto = cls.routine && deps.flags.autosend && !deps.flags.shadow && !internalTest
  if (canAuto) {
    const since = new Date(Date.now() - 86_400_000).toISOString()
    const recent = await db.select('support_email_outbound', `thread_id=eq.${threadId}&mode=eq.auto&created_at=gte.${encodeURIComponent(since)}&select=id`)
    if (!recent.ok || recent.rows.length) canAuto = false
  }
  const ledger = await db.insert('support_email_outbound', {
    thread_id: threadId, inbound_message_id: messageRowId, idempotency_key: `reply:${meta.email_id}`,
    mode: canAuto ? 'auto' : 'shadow', status: canAuto ? 'queued' : 'shadow', category: cls.category,
    needs_kam: !cls.routine, escalation_reasons: cls.reasons, to_email: from,
    subject: subject.match(/^re:/i) ? subject : `Re: ${subject}`, body_text: cls.draft, citations: cls.citations,
    index_version: cls.indexVersion, ops_escalation_id: opsId,
  }, { onConflict: 'idempotency_key', ignoreDuplicates: true })
  await db.update('support_email_threads', { id: threadId }, { status: cls.routine ? 'drafted' : 'escalated', category: cls.category })

  if (canAuto && ledger.rows[0] && deps.send) {
    const row = ledger.rows[0]
    try {
      const sent = await deps.send({ to: from, subject: String(row.subject), text: cls.draft, inReplyTo: messageId, idempotencyKey: String(row.idempotency_key) })
      await db.update('support_email_outbound', { id: String(row.id) }, { status: 'sent', provider_message_id: sent.id, sent_at: new Date().toISOString(), attempts: 1 })
    } catch (e) {
      await db.update('support_email_outbound', { id: String(row.id) }, { status: 'failed', last_error: e instanceof Error ? e.message : 'send_failed', attempts: 1 })
    }
  }
  await mark('processed')
  return { http: 200, status: cls.routine ? (canAuto ? 'auto' : 'shadow_drafted') : 'escalated' }
}

export const SUPPORT_SITE = SITE
export { buildIndex }

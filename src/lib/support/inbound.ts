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

import { reviewLink, type AlertSender } from './alert'
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
  if (hdr(headers, 'x-bricks-support') || hdr(headers, 'x-bricks-alert')) return 'own_reply_loop'
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

export function resendFetcher(env: Env = process.env, f: typeof fetch = fetch, timeoutMs = 8_000): FetchEmail | null {
  const key = (env.RESEND_INBOUND_API_KEY || '').trim()
  if (!key) return null
  return async (id) => {
    const r = await f(`https://api.resend.com/emails/receiving/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(timeoutMs),
    })
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


/** Short plaintext excerpt for fail-open owner alerts. Strips tags and control chars. */
export function safeMailExcerpt(text: string, n = 280): string {
  const s = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

/** Stand-in used when Supabase is unconfigured, so fail-open alerting still runs. */
export function unavailableDb(): Db {
  return {
    insert: async () => ({ ok: false, status: 402, rows: [] }),
    update: async () => ({ ok: false, status: 402 }),
    select: async () => ({ ok: false, rows: [] }),
    rpc: async () => ({ ok: false, data: null }),
  }
}

/** Per-isolate hourly cap for the "support inbox DB is down" alert. No KV. */
export const inboxDbDownAlert = {
  lastAt: 0,
  intervalMs: 60 * 60 * 1000,
  now: () => Date.now(),
  reset() {
    this.lastAt = 0
  },
}

export async function alertWhenInboxSaveFails(
  deps: { alert?: AlertSender; env?: Env },
  info: { from: string; subject: string; excerpt: string; emailId?: string },
): Promise<void> {
  if (!deps.alert) return
  const env = deps.env ?? process.env
  try {
    await deps.alert({
      view: {
        kind: 'email_needs_kam',
        helpNo: null,
        who: info.from || 'unknown sender',
        replyTo: info.from || 'raph@brxs.ca',
        subject: info.subject || '(no subject)',
        latest: info.excerpt || '(no excerpt — the inbox could not be saved)',
        reasons: ['no_draft'],
        draft: null,
        reviewUrl: reviewLink(env),
      },
      idempotencyKey: (info.emailId ? `alert:${info.emailId}` : `alert-unsaved:${info.from}:${info.subject}`).slice(0, 256),
      meta: { Email: info.emailId ?? '', Note: 'Support inbox save failed' },
    })
  } catch (e) {
    console.error('support fail-open alert threw', e instanceof Error ? e.message : e)
  }
  const now = inboxDbDownAlert.now()
  if (now - inboxDbDownAlert.lastAt < inboxDbDownAlert.intervalMs) return
  inboxDbDownAlert.lastAt = now
  try {
    const r = await deps.alert({
      view: {
        kind: 'email_needs_kam',
        helpNo: null,
        who: 'Bricks support inbox',
        replyTo: 'raph@brxs.ca',
        subject: 'Support inbox database is down',
        latest: 'The help@ inbox could not be saved. Inbound mail is being sent to you as an alert until the database is back.',
        reasons: ['no_draft'],
        draft: null,
        reviewUrl: reviewLink(env),
      },
      idempotencyKey: `alert:db-down:${Math.floor(now / inboxDbDownAlert.intervalMs)}`,
      meta: { Note: 'Hourly support inbox DB-down alert' },
    })
    if (!r.ok) inboxDbDownAlert.lastAt = 0
  } catch (e) {
    inboxDbDownAlert.lastAt = 0
    console.error('support db-down alert threw', e instanceof Error ? e.message : e)
  }
}

export type InboundRecord = {
  svix_id: string
  email_id?: string
  event_type?: string
  created_at?: string
  from: string
  to: string[]
  received_for: string[]
  subject: string
  text: string
  message_id?: string
  in_reply_to?: string
  references?: string
  authentication?: { dkim?: string; dmarc?: string } | null
  thread_key: string
  suppressed_reason?: string | null
  internal_test?: boolean
  classification?: Classification | null
  can_auto?: boolean
  outbound_subject?: string
  status?: 'pending_fetch' | 'failed' | 'dead_letter'
  last_error?: string | null
}

export type SaveInboundResult = {
  ok: boolean
  http?: number
  duplicate?: boolean
  status?: string
  thread_id?: string
  help_no?: number | null
  outbound_id?: string | null
  inbound_message_id?: string | null
  error?: string
}

type ProcessDeps = {
  db?: Db
  saveInbound?: (record: InboundRecord) => Promise<SaveInboundResult>
  fetchEmail: FetchEmail | null
  flags: Flags
  env?: Env
  send?: (o: { to: string; subject: string; text: string; inReplyTo: string; idempotencyKey: string }) => Promise<{ id: string }>
  alert?: AlertSender
}

/** Production saver: POST the parsed message to the OS API (direct Postgres). */
export function osInboundSaver(env: Env = process.env, f: typeof fetch = fetch, timeoutMs = 10_000) {
  const base = (env.BRICKS_OS_API_URL || 'https://api.brxs.ca').replace(/\/$/, '')
  const key = (env.INTERNAL_API_KEY || env.BRICKS_INTERNAL_API_KEY || '').trim()
  return async (record: InboundRecord): Promise<SaveInboundResult> => {
    if (!key) return { ok: false, http: 503, error: 'internal_key_missing' }
    try {
      const r = await f(`${base}/api/support/inbound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Internal-Api-Key': key },
        body: JSON.stringify(record),
        signal: AbortSignal.timeout(timeoutMs),
      })
      const j = (await r.json().catch(() => ({}))) as SaveInboundResult
      if (!r.ok) return { ok: false, http: r.status, error: typeof j.error === 'string' ? j.error : 'save_failed', duplicate: Boolean(j.duplicate) }
      return { ok: true, http: r.status, ...j }
    } catch {
      // Timeout, abort, or network error: treat as a save failure so fail-open
      // alerting still runs and the webhook returns non-2xx for a Resend retry.
      return { ok: false, http: 500, error: 'save_failed' }
    }
  }
}

/** Test / legacy adapter: the same record shape, written through a Db (in-memory in tests). */
export async function legacySave(db: Db, record: InboundRecord): Promise<SaveInboundResult> {
  const svixId = record.svix_id
  const ins = await db.insert('support_email_events', {
    provider_event_id: svixId, email_id: record.email_id, event_type: record.event_type || 'email.received', status: 'received',
    payload: { from: record.from, to: record.to, received_for: record.received_for, subject: record.subject, message_id: record.message_id, created_at: record.created_at }, attempts: 1,
  }, { onConflict: 'provider_event_id', ignoreDuplicates: true })
  if (!ins.ok) return { ok: false, http: 500, error: 'db_unavailable' }
  if (!ins.rows.length) {
    const ex = await db.select('support_email_events', `provider_event_id=eq.${encodeURIComponent(svixId)}&select=id,status,attempts`)
    if (!ex.ok) return { ok: false, http: 500, error: 'db_unavailable' }
    const row = ex.rows[0]
    if (row && ['processed', 'ignored', 'suppressed', 'dead_letter'].includes(String(row.status))) {
      return { ok: true, http: 200, duplicate: true, status: String(row.status), thread_id: undefined }
    }
    await db.update('support_email_events', { provider_event_id: svixId }, { attempts: Number(row?.attempts ?? 0) + 1, updated_at: new Date().toISOString() })
  }
  const mark = (status: string, last_error: string | null = null) =>
    db.update('support_email_events', { provider_event_id: svixId }, { status, last_error, updated_at: new Date().toISOString() })

  if (record.status === 'pending_fetch' || record.status === 'failed' || record.status === 'dead_letter') {
    await mark(record.status, record.last_error ?? null)
    return { ok: true, http: 200, duplicate: false, status: record.status }
  }

  const th = await db.insert('support_email_threads', {
    thread_key: record.thread_key, subject: record.subject, customer_email: record.from, last_message_at: new Date().toISOString(),
  }, { onConflict: 'thread_key' })
  if (!th.ok) return { ok: false, http: 500, error: 'thread_upsert' }
  const threadId = String(th.rows[0]?.id ?? '')
  if (!threadId) return { ok: false, http: 500, error: 'thread_upsert' }

  const existingMsg = record.email_id
    ? await db.select('support_email_messages', `provider_email_id=eq.${encodeURIComponent(record.email_id)}&select=id`)
    : { ok: true, rows: [] as Record<string, unknown>[] }
  let messageRowId: unknown = existingMsg.rows[0]?.id ?? null
  if (!messageRowId) {
    const msg = await db.insert('support_email_messages', {
      thread_id: threadId, direction: 'inbound', provider_email_id: record.email_id, rfc_message_id: record.message_id || null,
      in_reply_to: record.in_reply_to || null, references_header: record.references || null,
      from_email: record.from, to_emails: [...record.to, ...record.received_for], subject: record.subject, text_body: record.text,
      received_at: record.created_at || null,
      classification: record.classification ? {
        test: Boolean(record.internal_test), routine: record.classification.routine, category: record.classification.category,
        reasons: record.classification.reasons, index_version: record.classification.indexVersion, auth: record.authentication ?? null,
      } : null,
      suppressed_reason: record.suppressed_reason,
    }, { onConflict: 'provider_email_id', ignoreDuplicates: true })
    if (!msg.ok) return { ok: false, http: 500, error: 'message_insert' }
    messageRowId = msg.rows[0]?.id ?? existingMsg.rows[0]?.id ?? null
  }

  if (record.suppressed_reason || !record.classification) {
    await mark('suppressed', record.suppressed_reason ?? null)
    return { ok: true, http: 200, duplicate: false, status: 'suppressed', thread_id: threadId, help_no: (th.rows[0]?.help_no as number | undefined) ?? null, inbound_message_id: messageRowId ? String(messageRowId) : null }
  }

  const cls = record.classification
  let opsId: unknown = null
  if (!cls.routine) {
    const o = await db.insert('ops_escalations', {
      escalation_type: 'support_email', status: 'open', attempt_count: 1,
      notes: `${record.internal_test ? '[INTERNAL TEST] ' : ''}help@ email from ${record.from}: "${record.subject}"\nReasons: ${cls.reasons.join(', ')}\nThread: support_email_threads.id=${threadId}\n--- Suggested reply ---\n${cls.draft}`.slice(0, 8000),
    })
    opsId = o.rows[0]?.id ?? null
  }
  const ledger = await db.insert('support_email_outbound', {
    thread_id: threadId, inbound_message_id: messageRowId, idempotency_key: `reply:${record.email_id}`,
    mode: record.can_auto ? 'auto' : 'shadow', status: record.can_auto ? 'queued' : 'shadow', category: cls.category,
    needs_kam: !cls.routine, escalation_reasons: cls.reasons, to_email: record.from,
    subject: record.outbound_subject || `${record.subject.match(/^re:/i) ? record.subject : `Re: ${record.subject}`}${th.rows[0]?.help_no ? ` · Help #${th.rows[0].help_no}` : ''}`,
    body_text: cls.draft, citations: cls.citations,
    index_version: cls.indexVersion, ops_escalation_id: opsId,
  }, { onConflict: 'idempotency_key', ignoreDuplicates: true })
  if (!ledger.ok) return { ok: false, http: 500, error: 'outbound_insert' }
  await db.update('support_email_threads', { id: threadId }, { status: cls.routine ? 'drafted' : 'escalated', category: cls.category })
  await mark('processed')
  const status = record.can_auto ? 'auto' : (cls.routine ? 'shadow_drafted' : 'escalated')
  return {
    ok: true, http: 200, duplicate: false, status,
    thread_id: threadId, help_no: (th.rows[0]?.help_no as number | undefined) ?? null,
    outbound_id: ledger.rows[0] ? String(ledger.rows[0].id) : null,
    inbound_message_id: messageRowId ? String(messageRowId) : null,
  }
}

export async function processEvent(svixId: string, ev: WebhookEvent, deps: ProcessDeps): Promise<Outcome> {
  const env = deps.env ?? process.env
  if (ev.type !== 'email.received' || !ev.data?.email_id) return { http: 200, status: 'ignored', detail: 'event_type' }
  const meta = ev.data
  const to = meta.to ?? [], rf = meta.received_for ?? []

  if (!addressedToHelp(to, rf, env)) return { http: 200, status: 'ignored', detail: onlyOtherInboxes(to, rf) ? 'other_inbox' : 'not_help' }

  const peekMail = async (): Promise<{ from: string; subject: string; excerpt: string }> => {
    const fallback = { from: bare(meta.from || ''), subject: (meta.subject || '').slice(0, 300), excerpt: '' }
    if (!deps.fetchEmail || !meta.email_id) return fallback
    try {
      const email = await deps.fetchEmail(meta.email_id)
      if (!email) return fallback
      const from = bare(email.from || fallback.from)
      const subject = (email.subject || fallback.subject).slice(0, 300)
      const body = email.text || (email.html ? htmlToText(email.html) : '')
      return { from, subject, excerpt: safeMailExcerpt(body) }
    } catch {
      return fallback
    }
  }
  const failOpen = async (detail: string, mail?: { from: string; subject: string; excerpt: string }): Promise<Outcome> => {
    const info = mail ?? await peekMail()
    await alertWhenInboxSaveFails(deps, { from: info.from, subject: info.subject, excerpt: info.excerpt, emailId: meta.email_id })
    return { http: 500, status: 'retry', detail }
  }
  const save = deps.saveInbound ?? (deps.db ? (record: InboundRecord) => legacySave(deps.db!, record) : null)
  if (!save) return failOpen('save_unavailable')

  if (!deps.fetchEmail) {
    const parked = await save({
      svix_id: svixId, email_id: meta.email_id, event_type: ev.type, from: bare(meta.from || ''),
      to, received_for: rf, subject: (meta.subject || '').slice(0, 300), text: '', thread_key: `pending:${svixId}`,
      status: 'pending_fetch', last_error: 'RESEND_INBOUND_API_KEY not set',
    })
    if (!parked.ok) return failOpen('db_unavailable')
    return { http: 200, status: 'pending_fetch' }
  }

  let email: ReceivedEmail | null
  // Webhook metadata only — do not re-fetch after a timeout, or we spend another 8s.
  const webhookMail = { from: bare(meta.from || ''), subject: (meta.subject || '').slice(0, 300), excerpt: '' }
  try {
    email = await deps.fetchEmail(meta.email_id!)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'fetch_failed'
    // Count prior failed attempts via a failed-status save; Resend retries the webhook.
    const prior = await save({
      svix_id: svixId, email_id: meta.email_id, event_type: ev.type, from: webhookMail.from,
      to, received_for: rf, subject: webhookMail.subject, text: '', thread_key: `failed:${svixId}`,
      status: 'failed', last_error: msg,
    })
    // We don't have a durable attempt counter without a successful first write; the
    // route still returns 500 so Resend retries. After MAX_ATTEMPTS of failed saves
    // that already recorded the event, mark dead_letter.
    if (prior.ok && prior.status === 'dead_letter') {
      await alertWhenInboxSaveFails(deps, { ...webhookMail, emailId: meta.email_id })
      return { http: 200, status: 'dead_letter' }
    }
    // Keep previous behaviour for memDb: increment by re-reading attempts.
    if (deps.db) {
      const ex = await deps.db.select('support_email_events', `provider_event_id=eq.${encodeURIComponent(svixId)}&select=status,attempts`)
      const attempts = Number(ex.rows[0]?.attempts ?? 0)
      if (attempts >= MAX_ATTEMPTS) {
        await deps.db.update('support_email_events', { provider_event_id: svixId }, { status: 'dead_letter', last_error: msg, updated_at: new Date().toISOString() })
        await alertWhenInboxSaveFails(deps, { ...webhookMail, emailId: meta.email_id })
        return { http: 200, status: 'dead_letter' }
      }
    }
    // Timeout or any other fetch failure: still alert from the webhook's sender/subject.
    return failOpen(msg, webhookMail)
  }
  if (!email) {
    await save({
      svix_id: svixId, email_id: meta.email_id, event_type: ev.type, from: bare(meta.from || ''),
      to, received_for: rf, subject: (meta.subject || '').slice(0, 300), text: '', thread_key: `dead:${svixId}`,
      status: 'dead_letter', last_error: 'email_not_found',
    })
    return { http: 200, status: 'dead_letter' }
  }

  const headers = email.headers ?? {}
  const from = bare(email.from || meta.from || '')
  const subject = (email.subject || meta.subject || '').slice(0, 300)
  const text = (email.text || (email.html ? htmlToText(email.html) : '')).slice(0, 20_000)
  const messageId = (email.message_id || meta.message_id || '').trim()
  const tKey = threadKey({ references: hdr(headers, 'references'), inReplyTo: hdr(headers, 'in-reply-to'), messageId, from, subject })
  const internalTest = isInternalTest(from, subject)
  const suppressed = internalTest ? null : suppressionReason(from, headers, subject)
  const cls = suppressed ? null : await classifyEmail(subject, text, email.authentication ?? null)

  let canAuto = Boolean(cls && cls.routine && deps.flags.autosend && !deps.flags.shadow && !internalTest)
  if (canAuto && deps.db) {
    const existingThread = await deps.db.select('support_email_threads', `thread_key=eq.${encodeURIComponent(tKey)}&select=id`)
    const threadId = existingThread.rows[0] ? String(existingThread.rows[0].id) : ''
    if (threadId) {
      const since = new Date(Date.now() - 86_400_000).toISOString()
      const recent = await deps.db.select('support_email_outbound', `thread_id=eq.${encodeURIComponent(threadId)}&mode=eq.auto&created_at=gte.${encodeURIComponent(since)}&select=id`)
      if (!recent.ok || recent.rows.length) canAuto = false
    }
  }

  const saved = await save({
    svix_id: svixId, email_id: meta.email_id, event_type: ev.type, created_at: email.created_at || ev.created_at,
    from, to, received_for: rf, subject, text, message_id: messageId,
    in_reply_to: hdr(headers, 'in-reply-to'), references: hdr(headers, 'references'),
    authentication: email.authentication ?? null, thread_key: tKey,
    suppressed_reason: suppressed, internal_test: internalTest, classification: cls, can_auto: canAuto,
  })
  if (!saved.ok) return failOpen('db_unavailable', { from, subject, excerpt: safeMailExcerpt(text) })
  if (saved.duplicate) return { http: 200, status: 'duplicate' }

  if (suppressed || !cls) return { http: 200, status: 'suppressed', detail: suppressed ?? '' }

  if (canAuto && saved.outbound_id && deps.send) {
    try {
      const sent = await deps.send({ to: from, subject: `${subject.match(/^re:/i) ? subject : `Re: ${subject}`}${saved.help_no ? ` · Help #${saved.help_no}` : ''}`, text: cls.draft, inReplyTo: messageId, idempotencyKey: `reply:${meta.email_id}` })
      if (deps.db) await deps.db.update('support_email_outbound', { id: saved.outbound_id }, { status: 'sent', provider_message_id: sent.id, sent_at: new Date().toISOString(), attempts: 1 })
    } catch (e) {
      if (deps.db) await deps.db.update('support_email_outbound', { id: saved.outbound_id }, { status: 'failed', last_error: e instanceof Error ? e.message : 'send_failed', attempts: 1 })
    }
  }

  const autoSent = canAuto && saved.outbound_id && deps.send
  if (deps.alert && !autoSent) {
    const noDraft = !cls.draft || !saved.outbound_id
    try {
      const r = await deps.alert({
        view: {
          kind: !cls.routine || noDraft ? 'email_needs_kam' : 'email_draft_waiting', helpNo: saved.help_no ?? null,
          who: from, replyTo: from, subject, latest: text, reasons: noDraft ? [...cls.reasons, 'no_draft'] : cls.reasons,
          draft: cls.draft || null, reviewUrl: reviewLink(env), test: internalTest,
        },
        idempotencyKey: `alert:${meta.email_id}`,
        meta: { Thread: saved.thread_id || '', Draft: saved.outbound_id || '', Email: meta.email_id! },
      })
      if (saved.outbound_id && deps.db) {
        await deps.db.update('support_email_outbound', { id: saved.outbound_id }, r.ok ? { alerted_at: new Date().toISOString(), alert_message_id: r.id ?? null } : { alert_error: r.error ?? 'alert_failed' })
      }
      if (!r.ok) console.error('support alert failed', r.error)
    } catch (e) { console.error('support alert threw', e instanceof Error ? e.message : e) }
  }
  return { http: 200, status: cls.routine ? (canAuto && deps.send ? 'auto' : 'shadow_drafted') : 'escalated' }
}

/** Verify the Svix signature against the raw body before parsing or saving. */
export async function handleInboundRequest(input: {
  secret: string
  headers: { id: string | null; timestamp: string | null; signature: string | null }
  body: string
  nowSec?: number
  deps: ProcessDeps
}): Promise<{ http: number; body: Record<string, unknown> }> {
  if (!verifySignature(input.secret, input.headers, input.body, input.nowSec)) {
    return { http: 401, body: { ok: false, error: 'bad signature' } }
  }
  let ev: WebhookEvent
  try { ev = JSON.parse(input.body) } catch { return { http: 400, body: { ok: false } } }
  const out = await processEvent(input.headers.id || '', ev, input.deps)
  return { http: out.http, body: { ok: out.http < 300, status: out.status } }
}

export const SUPPORT_SITE = SITE
export { buildIndex }

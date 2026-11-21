/**
 * Contact inbox delivery for /api/contact and /api/book/property-request.
 *
 * Sends through Resend directly when this deploy has RESEND_API_KEY (bricks-site
 * project env, sending-only key for brxs.ca). Without it, falls back to the
 * Supabase edge function `contact-message`, which needs its own RESEND_API_KEY
 * secret (it returned 500 "Email service not configured" on 2026-10-26).
 *
 * Smoke tests: a message from admin@brxs.ca whose message contains SMOKE_TAG is
 * delivered to admin@brxs.ca only, never the public inbox, so the deploy script
 * can POST the real form without emailing anyone else.
 */

export const CONTACT_INBOX = 'hello@brxs.ca'
export const SMOKE_FROM = 'admin@brxs.ca'
export const SMOKE_TAG = '[bricks-smoke-test]'

export type ContactMessage = { name: string; email: string; message: string }
export type SendResult = { ok: true; via: 'resend' | 'edge' } | { ok: false; status: number; error: string }

export function isSmokeTest(m: ContactMessage): boolean {
  return m.email.trim().toLowerCase() === SMOKE_FROM && m.message.includes(SMOKE_TAG)
}

/** Home services quote requests go to the support inbox, not the general one. */
export const QUOTE_INBOX = 'help@brxs.ca'

export function recipientFor(m: ContactMessage, inbox: string = CONTACT_INBOX): string {
  return isSmokeTest(m) ? SMOKE_FROM : inbox
}

export function resendPayload(m: ContactMessage, sourceLabel: string, subject?: string, inbox?: string) {
  return {
    from: 'Bricks <hello@brxs.ca>',
    to: [recipientFor(m, inbox)],
    reply_to: [m.email],
    subject: `${isSmokeTest(m) ? '[SMOKE TEST] ' : ''}${subject || `Bricks — message from ${m.name}`}`,
    text: `${m.name} (${m.email})\n\n${m.message}\n\n— sent from ${sourceLabel}`,
  }
}

type Env = Record<string, string | undefined>
type Fetch = typeof fetch

export async function sendContactMessage(
  m: ContactMessage,
  opts: { sourceLabel: string; supabaseUrl: string; supabaseKey: string; subject?: string; inbox?: string; env?: Env; fetchImpl?: Fetch },
): Promise<SendResult> {
  const env = opts.env ?? process.env
  const f = opts.fetchImpl ?? fetch
  const resendKey = (env.RESEND_API_KEY || '').trim()
  if (resendKey) {
    try {
      const r = await f('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(resendPayload(m, opts.sourceLabel, opts.subject, opts.inbox)),
      })
      if (r.ok) return { ok: true, via: 'resend' }
      console.error('Resend error', r.status, (await r.text().catch(() => '')).slice(0, 300))
      return { ok: false, status: 502, error: 'Could not send message.' }
    } catch (e) {
      console.error('Resend exception', e)
      return { ok: false, status: 502, error: 'Could not send message.' }
    }
  }
  if (!opts.supabaseUrl || !opts.supabaseKey) return { ok: false, status: 503, error: 'Email service not configured.' }
  if (isSmokeTest(m)) return { ok: false, status: 503, error: 'Smoke test needs RESEND_API_KEY on this deploy.' }
  try {
    const r = await f(`${opts.supabaseUrl}/functions/v1/contact-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: opts.supabaseKey, Authorization: `Bearer ${opts.supabaseKey}` },
      body: JSON.stringify(m),
    })
    const d = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string }
    if (r.ok && d.ok) return { ok: true, via: 'edge' }
    return { ok: false, status: 502, error: d.error || 'Could not send message.' }
  } catch {
    return { ok: false, status: 502, error: 'Could not send message.' }
  }
}

/**
 * Confirmation to the person who sent a quote request. Resend only (the edge
 * function has no client-copy mode), and skipped for smoke tests so the deploy
 * script never emails anyone. A failed confirmation never fails the request:
 * the request already reached the inbox.
 */
export type ClientConfirmation = { to: string; name: string; subject: string; text: string }

export function confirmationPayload(c: ClientConfirmation) {
  return {
    from: 'Bricks <hello@brxs.ca>',
    to: [c.to],
    reply_to: ['help@brxs.ca'],
    subject: c.subject,
    text: c.text,
  }
}

export async function sendClientConfirmation(
  c: ClientConfirmation,
  opts: { smoke?: boolean; env?: Env; fetchImpl?: Fetch } = {},
): Promise<{ sent: boolean; reason?: string }> {
  const env = opts.env ?? process.env
  const f = opts.fetchImpl ?? fetch
  const resendKey = (env.RESEND_API_KEY || '').trim()
  if (opts.smoke) return { sent: false, reason: 'smoke' }
  if (!resendKey) return { sent: false, reason: 'no-key' }
  try {
    const r = await f('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(confirmationPayload(c)),
    })
    if (r.ok) return { sent: true }
    console.error('Resend confirmation error', r.status, (await r.text().catch(() => '')).slice(0, 300))
    return { sent: false, reason: `status-${r.status}` }
  } catch (e) {
    console.error('Resend confirmation exception', e)
    return { sent: false, reason: 'exception' }
  }
}

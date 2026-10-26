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

export function recipientFor(m: ContactMessage): string {
  return isSmokeTest(m) ? SMOKE_FROM : CONTACT_INBOX
}

export function resendPayload(m: ContactMessage, sourceLabel: string) {
  return {
    from: 'Bricks Group <hello@brxs.ca>',
    to: [recipientFor(m)],
    reply_to: [m.email],
    subject: `${isSmokeTest(m) ? '[SMOKE TEST] ' : ''}Bricks — message from ${m.name}`,
    text: `${m.name} (${m.email})\n\n${m.message}\n\n— sent from ${sourceLabel}`,
  }
}

type Env = Record<string, string | undefined>
type Fetch = typeof fetch

export async function sendContactMessage(
  m: ContactMessage,
  opts: { sourceLabel: string; supabaseUrl: string; supabaseKey: string; env?: Env; fetchImpl?: Fetch },
): Promise<SendResult> {
  const env = opts.env ?? process.env
  const f = opts.fetchImpl ?? fetch
  const resendKey = (env.RESEND_API_KEY || '').trim()
  if (resendKey) {
    try {
      const r = await f('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(resendPayload(m, opts.sourceLabel)),
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

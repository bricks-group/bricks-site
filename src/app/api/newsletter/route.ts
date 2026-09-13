import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const OS_API = (process.env.BRICKS_OS_API_URL || 'https://api.brxs.ca').replace(/\/$/, '')
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_TOKEN || ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function json(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status })
}

async function persistFounder(email: string, source: string) {
  if (!SERVICE_ROLE) return { persisted: false as const, blocked: 'SUPABASE_SERVICE_ROLE_KEY' as const }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers?on_conflict=email`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ email, source, is_founder: true }),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    return { persisted: false as const, error: `persist_${res.status}`, detail: err.slice(0, 240) }
  }
  return { persisted: true as const }
}

function welcomeHtml() {
  return `<div style="font-size:20px;font-weight:600;margin-bottom:16px;color:#14110E">You're on the Bricks list.</div>
<p style="color:#555;line-height:1.6">Thanks for signing up. Bricks is listing media and the operating system for Canadian real estate.</p>
<p style="color:#555;line-height:1.6">Media is live to book. OS is live in preview at app.brxs.ca. Companion and GO are live on the web.</p>
<p style="margin:24px 0 8px"><a href="https://www.brxs.ca/platform" style="display:inline-block;padding:12px 20px;background:#D2542B;color:#fff;text-decoration:none;border-radius:2px;font-weight:500">See the platform</a></p>
<p style="color:#555;line-height:1.6">Rates are the published catalog on <a href="https://www.brxs.ca/pricing" style="color:#D2542B">Pricing</a>. Book a shoot anytime at <a href="https://www.brxs.ca/book" style="color:#D2542B">www.brxs.ca/book</a>.</p>
<p style="margin-top:32px;font-size:12px;color:#999">You're tagged as a founder subscriber for launch updates. Unsubscribe: reply to this email or write help@brxs.ca.</p>`
}

async function sendLocal(email: string): Promise<{ emailed: boolean; mail_blocked: string | null; mail_error?: string }> {
  if (RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Bricks <noreply@brxs.ca>',
        to: [email],
        subject: "You're on the Bricks list",
        html: welcomeHtml(),
      }),
    })
    if (r.ok) return { emailed: true, mail_blocked: null }
    return { emailed: false, mail_blocked: null, mail_error: `RESEND_${r.status}` }
  }
  if (POSTMARK_TOKEN) {
    const r = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': POSTMARK_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        From: 'Bricks <noreply@brxs.ca>',
        To: email,
        Subject: "You're on the Bricks list",
        HtmlBody: welcomeHtml(),
        MessageStream: 'outbound',
      }),
    })
    if (r.ok) return { emailed: true, mail_blocked: null }
    return { emailed: false, mail_blocked: null, mail_error: `POSTMARK_${r.status}` }
  }
  return { emailed: false, mail_blocked: 'RESEND_API_KEY' }
}

export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string }
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400)
  }
  const email = (body.email || '').toString().trim().toLowerCase()
  let source = (body.source || 'www.brxs.ca').toString().trim() || 'www.brxs.ca'
  if (source === 'popup' || source === 'inline' || source === 'bricks-prelaunch') source = `newsletter:${source}`
  else if (!source.startsWith('newsletter')) source = `newsletter:${source}`
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Enter a valid email.' }, 400)

  // Prefer OS API: it has RESEND_API_KEY and does persist + tag + welcome in one shot.
  try {
    const osRes = await fetch(`${OS_API}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })
    const osJson = (await osRes.json().catch(() => ({}))) as Record<string, unknown>
    if (osRes.ok && osJson.ok && osJson.persisted) {
      return json({
        ok: true,
        persisted: true,
        emailed: Boolean(osJson.emailed),
        already_subscribed: Boolean(osJson.already_subscribed),
        mail_blocked: osJson.emailed ? null : (osJson.mail_blocked ?? null),
        mail_error: osJson.mail_error,
        tags: ['newsletter', 'founder'],
      })
    }
  } catch {
    /* fall through to local persist */
  }

  const saved = await persistFounder(email, source)
  if (!saved.persisted) {
    return json({
      ok: false,
      persisted: false,
      emailed: false,
      mail_blocked: 'blocked' in saved ? saved.blocked : 'RESEND_API_KEY',
      error: 'error' in saved ? saved.error : 'Could not subscribe.',
    }, 500)
  }
  const mail = await sendLocal(email)
  return json({
    ok: true,
    persisted: true,
    emailed: mail.emailed,
    mail_blocked: mail.emailed ? null : mail.mail_blocked,
    mail_error: mail.mail_error,
    tags: ['newsletter', 'founder'],
  })
}

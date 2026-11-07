// Supabase Edge Function: newsletter-signup
// Persists to newsletter_subscribers (service-role), tags founder, sends welcome
// via Resend/Postmark when those secrets exist. Never fakes sent.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

function welcomeHtml() {
  return `<div style="font-size:20px;font-weight:600;margin-bottom:16px;color:#14110E">You're on the Bricks list.</div>
<p style="color:#555;line-height:1.6">Thanks for signing up. Bricks is listing media and the operating system for Canadian real estate.</p>
<p style="color:#555;line-height:1.6">Media is live to book. The Bricks app is live in preview at app.brxs.ca. Companion and the photographer app are live on the web.</p>
<p style="margin:24px 0 8px"><a href="https://www.brxs.ca/platform" style="display:inline-block;padding:12px 20px;background:#D2542B;color:#fff;text-decoration:none;border-radius:0;font-weight:500">See the platform</a></p>
<p style="color:#555;line-height:1.6">Rates are the published catalog on <a href="https://www.brxs.ca/pricing" style="color:#D2542B">Pricing</a>. Book a shoot anytime at <a href="https://www.brxs.ca/book" style="color:#D2542B">www.brxs.ca/book</a>.</p>
<p style="margin-top:32px;font-size:12px;color:#999">You're tagged as a founder subscriber for launch updates. Unsubscribe: reply to this email or write hello@brxs.ca.</p>`;
}

async function sendWelcome(email: string): Promise<{ emailed: boolean; mail_blocked: string | null; mail_error?: string }> {
  const resend = Deno.env.get('RESEND_API_KEY') || '';
  const postmark = Deno.env.get('POSTMARK_SERVER_TOKEN') || Deno.env.get('POSTMARK_API_TOKEN') || '';
  if (!resend && !postmark) return { emailed: false, mail_blocked: 'RESEND_API_KEY' };
  try {
    if (resend) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Bricks <noreply@brxs.ca>',
          reply_to: 'support@brxs.ca',
          to: [email],
          subject: "You're on the Bricks list",
          html: welcomeHtml(),
        }),
      });
      if (r.ok) return { emailed: true, mail_blocked: null };
      return { emailed: false, mail_blocked: null, mail_error: `RESEND_${r.status}` };
    }
    const r = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': postmark,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        From: 'Bricks <noreply@brxs.ca>',
        ReplyTo: 'support@brxs.ca',
        To: email,
        Subject: "You're on the Bricks list",
        HtmlBody: welcomeHtml(),
        MessageStream: 'outbound',
      }),
    });
    if (r.ok) return { emailed: true, mail_blocked: null };
    return { emailed: false, mail_blocked: null, mail_error: `POSTMARK_${r.status}` };
  } catch {
    return { emailed: false, mail_blocked: null, mail_error: 'SEND_EXCEPTION' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

  try {
    const body = await req.json();
    const email = (body.email || '').toString().trim().toLowerCase();
    let source = (body.source || 'bricks-prelaunch').toString().trim();
    if (source === 'popup' || source === 'inline' || source === 'bricks-prelaunch') source = `newsletter:${source}`;
    else if (!source.startsWith('newsletter')) source = `newsletter:${source}`;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ok: false, error: 'Invalid email.' }, 400);
    }
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email, source, is_founder: true }, { onConflict: 'email' });
    if (error) {
      return json({ ok: false, persisted: false, emailed: false, error: error.message }, 500);
    }
    const mail = await sendWelcome(email);
    return json({
      ok: true,
      persisted: true,
      emailed: mail.emailed,
      mail_blocked: mail.emailed ? null : mail.mail_blocked,
      mail_error: mail.mail_error,
      tags: ['newsletter', 'founder'],
    });
  } catch {
    return json({ ok: false, error: 'Bad request.' }, 400);
  }
});

import type { Metadata } from 'next'
import { supportDb } from '@/lib/support/db'
import { approveAndSend, dismiss, isAdmin, pendingCodeEmail, requestCode, signInCode, signInPassword, signOut } from './actions'
import { SIGNIN_MESSAGES } from '@/lib/support/account-signin'
import './support.css'
import { helpRef, plainReasons } from '@/lib/support/alert'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Support review · Bricks', robots: { index: false, follow: false } }

type Row = {
  id: string; status: string; mode: string; needs_kam: boolean; escalation_reasons: string[]; to_email: string; subject: string
  body_text: string; category: string | null; created_at: string; sent_at: string | null; last_error: string | null
  support_email_messages: { from_email: string; subject: string; text_body: string; received_at: string | null } | null
  support_email_threads?: { help_no: number | null } | null
}

const fmt = (iso: string | null) => iso ? new Date(iso).toLocaleString('en-CA', { timeZone: 'America/Toronto', dateStyle: 'medium', timeStyle: 'short' }) + ' ET' : ''


export default async function SupportReview({ searchParams }: { searchParams: Promise<{ e?: string; all?: string }> }) {
  const sp = await searchParams
  // Production stays off until Kam approves the preview (flip SUPPORT_REVIEW_LIVE=true).
  if (process.env.VERCEL_ENV === 'production' && (process.env.SUPPORT_REVIEW_LIVE || '').trim() !== 'true') {
    return (
      <main className="sr">
        <h1>Support review</h1>
        <p>This page is waiting for your go-ahead. Until then, each alert email includes the full message and suggested reply, and nothing is sent to customers.</p>
      </main>
    )
  }
  const preview = process.env.VERCEL_ENV === 'preview'
  if (!preview && !(await isAdmin())) {
    const codeEmail = await pendingCodeEmail()
    const msg = sp.e ? SIGNIN_MESSAGES[sp.e] : ''
    return (
      <main className="sr">
        <h1>Support review</h1>
        <p className="lede">Sign in with your Bricks account, the same one you use for the Bricks app. The Open button in any help@ alert email also signs you in.</p>
        {msg && <p className="note" role="status">{msg}</p>}
        <section className="card signin">
          <h2>Sign in with your Bricks account</h2>
          <form action={signInPassword}>
            <label htmlFor="sr-email">Email</label>
            <input id="sr-email" name="email" type="email" autoComplete="username" required defaultValue={codeEmail} />
            <label htmlFor="sr-password">Password</label>
            <input id="sr-password" name="password" type="password" autoComplete="current-password" required />
            <div className="actions"><button className="primary" type="submit">Sign in</button></div>
          </form>
          <details style={{ marginTop: 18 }} open={sp.e === 'sent'}>
            <summary>No password? Email me a sign-in code</summary>
            {sp.e === 'sent' ? (
              <form action={signInCode}>
                <label htmlFor="sr-code">Code from the email{codeEmail ? ` sent to ${codeEmail}` : ''}</label>
                <input id="sr-code" name="code" inputMode="numeric" autoComplete="one-time-code" required />
                {!codeEmail && <input name="email" type="email" placeholder="Email" required />}
                <div className="actions"><button className="primary" type="submit">Sign in</button></div>
              </form>
            ) : (
              <form action={requestCode}>
                <label htmlFor="sr-code-email">Email</label>
                <input id="sr-code-email" name="email" type="email" autoComplete="username" required />
                <div className="actions"><button type="submit">Email me a code</button></div>
              </form>
            )}
          </details>
        </section>
      </main>
    )
  }
  const db = supportDb()
  const filter = sp.all ? '' : '&status=in.(shadow,failed,queued)'
  const res = db ? await db.select('support_email_outbound', `select=id,status,mode,needs_kam,escalation_reasons,to_email,subject,body_text,category,created_at,sent_at,last_error,support_email_messages!support_email_outbound_inbound_message_id_fkey(from_email,subject,text_body,received_at),support_email_threads!support_email_outbound_thread_id_fkey(help_no)${filter}&order=created_at.desc&limit=50`) : { ok: false, rows: [] }
  let rows = res.rows as unknown as Row[]
  // Preview has no service-role key: show sample cards so the layout can be reviewed.
  const sample = preview && !db
  if (sample) rows = SAMPLE
  return (
    <main className="sr">
      <h1>Support review</h1>
      <p className="lede">help@brxs.ca drafts. Auto-send is off. Nothing goes to a customer until you press Approve &amp; send. <a href={sp.all ? '/admin/support' : '/admin/support?all=1'}>{sp.all ? 'Show pending only' : 'Show all'}</a></p>
      {!preview && <form action={signOut} className="signout"><button type="submit">Sign out</button></form>}
      {sample && <p className="note">Preview with sample data. Buttons are disabled here.</p>}
      {!sample && !res.ok && <p>Could not load drafts.</p>}
      {res.ok && rows.length === 0 && <p>No drafts waiting.</p>}
      {rows.map((r) => {
        const m = r.support_email_messages
        const pending = r.status === 'shadow'
        return (
          <section key={r.id} className="card">
            <div>
              {r.needs_kam ? <span className="pill kam">Needs you</span> : <span className="pill">Routine</span>}
              <span className="pill">{r.status === 'shadow' ? 'draft' : r.status}</span>
              <span className="fig" style={{ marginRight: 10 }}>{helpRef(r.support_email_threads?.help_no)}</span><time className="fig">{fmt(m?.received_at ?? r.created_at)}</time>
            </div>
            <h2>{m?.subject || r.subject}</h2>
            <div className="meta">From {m?.from_email ?? r.to_email}{r.escalation_reasons?.length ? ` · ${plainReasons(r.escalation_reasons).join(' · ')}` : ''}</div>
            <details style={{ margin: '14px 0' }} open>
              <summary>Their message</summary>
              <pre>{(m?.text_body ?? '').slice(0, 4000)}</pre>
            </details>
            {pending ? (
              <form>
                <input type="hidden" name="id" value={r.id} />
                <label>Reply to {r.to_email}</label>
                <textarea name="body" defaultValue={r.body_text} rows={12} />
                <div className="actions">
                  <button formAction={approveAndSend} disabled={sample} className="primary">Approve &amp; send</button>
                  <button formAction={dismiss} disabled={sample} >Dismiss</button>
                </div>
              </form>
            ) : (
              <pre>{r.body_text}{r.sent_at ? `\n\nSent ${fmt(r.sent_at)}` : ''}{r.last_error ? `\n\nError: ${r.last_error}` : ''}</pre>
            )}
          </section>
        )
      })}
    </main>
  )
}

const SAMPLE: Row[] = [
  { id: 's1', status: 'shadow', mode: 'shadow', needs_kam: true, escalation_reasons: ['not_in_help'], to_email: 'client@example.com', subject: 'Re: Hub · Help #1042', support_email_threads: { help_no: 1042 }, body_text: 'Hi,\n\nThanks for getting in touch. A person on the Bricks team will look into this and reply shortly.\n\nBricks support', category: null, created_at: '2026-11-07T18:15:33Z', sent_at: null, last_error: null, support_email_messages: { from_email: 'client@example.com', subject: 'Hub', text_body: 'Where do I find the client hub for my listing?', received_at: '2026-11-07T18:15:33Z' } },
  { id: 's2', status: 'shadow', mode: 'shadow', needs_kam: false, escalation_reasons: [], to_email: 'agent@example.com', subject: 'Re: Drone rules? · Help #1041', support_email_threads: { help_no: 1041 }, body_text: 'Hi,\n\nThanks for getting in touch. Our help article “Drone shoots and airspace” covers this…\n\nBricks support', category: 'article:drone-rules', created_at: '2026-11-07T16:01:09Z', sent_at: null, last_error: null, support_email_messages: { from_email: 'agent@example.com', subject: 'Drone rules?', text_body: 'Can you fly a drone downtown?', received_at: '2026-11-07T16:01:09Z' } },
]

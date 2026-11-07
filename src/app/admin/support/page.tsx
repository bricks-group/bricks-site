import type { Metadata } from 'next'
import { supportDb } from '@/lib/support/db'
import { approveAndSend, dismiss, isAdmin } from './actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Support review · Bricks', robots: { index: false, follow: false } }

type Row = {
  id: string; status: string; mode: string; needs_kam: boolean; escalation_reasons: string[]; to_email: string; subject: string
  body_text: string; category: string | null; created_at: string; sent_at: string | null; last_error: string | null
  support_email_messages: { from_email: string; subject: string; text_body: string; received_at: string | null } | null
}

const fmt = (iso: string | null) => iso ? new Date(iso).toLocaleString('en-CA', { timeZone: 'America/Toronto', dateStyle: 'medium', timeStyle: 'short' }) + ' ET' : ''

const wrap: React.CSSProperties = { maxWidth: 880, margin: '0 auto', padding: '48px 20px 96px', fontFamily: 'inherit' }
const card: React.CSSProperties = { border: '1px solid rgba(127,127,127,.25)', borderRadius: 14, padding: 20, marginBottom: 20 }
const pill = (bg: string): React.CSSProperties => ({ display: 'inline-block', fontSize: 12, padding: '2px 10px', borderRadius: 999, background: bg, color: '#fff', marginRight: 8 })
const btn = (primary: boolean): React.CSSProperties => ({ padding: '10px 16px', borderRadius: 10, border: primary ? 'none' : '1px solid rgba(127,127,127,.4)', background: primary ? '#111' : 'transparent', color: primary ? '#fff' : 'inherit', fontWeight: 600, cursor: 'pointer' })

export default async function SupportReview({ searchParams }: { searchParams: Promise<{ e?: string; all?: string }> }) {
  const sp = await searchParams
  // Production stays off until Kam approves the preview (flip SUPPORT_REVIEW_LIVE=true).
  if (process.env.VERCEL_ENV === 'production' && (process.env.SUPPORT_REVIEW_LIVE || '').trim() !== 'true') {
    return (
      <main style={wrap}>
        <h1>Support review</h1>
        <p>This page is waiting for your go-ahead. Until then, each alert email includes the full message and suggested reply, and nothing is sent to customers.</p>
      </main>
    )
  }
  const preview = process.env.VERCEL_ENV === 'preview'
  if (!preview && !(await isAdmin())) {
    return (
      <main style={wrap}>
        <h1>Support review</h1>
        <p>{sp.e === 'link' ? 'That link has expired or is not valid.' : 'Sign in with the link in your latest help@ alert email.'}</p>
      </main>
    )
  }
  const db = supportDb()
  const filter = sp.all ? '' : '&status=in.(shadow,failed,queued)'
  const res = db ? await db.select('support_email_outbound', `select=id,status,mode,needs_kam,escalation_reasons,to_email,subject,body_text,category,created_at,sent_at,last_error,support_email_messages!support_email_outbound_inbound_message_id_fkey(from_email,subject,text_body,received_at)${filter}&order=created_at.desc&limit=50`) : { ok: false, rows: [] }
  let rows = res.rows as unknown as Row[]
  // Preview has no service-role key: show sample cards so the layout can be reviewed.
  const sample = preview && !db
  if (sample) rows = SAMPLE
  return (
    <main style={wrap}>
      <h1 style={{ marginBottom: 4 }}>Support review</h1>
      <p style={{ opacity: .7, marginTop: 0 }}>help@brxs.ca drafts. Auto-send is off. Nothing goes to a customer until you press Approve &amp; send. <a href={sp.all ? '/admin/support' : '/admin/support?all=1'}>{sp.all ? 'Show pending only' : 'Show all'}</a></p>
      {sample && <p style={{ padding: 12, borderRadius: 10, background: 'rgba(255,200,0,.15)' }}>Preview with sample data. Buttons are disabled here.</p>}
      {!sample && !res.ok && <p>Could not load drafts.</p>}
      {res.ok && rows.length === 0 && <p>No drafts waiting.</p>}
      {rows.map((r) => {
        const m = r.support_email_messages
        const pending = r.status === 'shadow'
        return (
          <section key={r.id} style={card}>
            <div style={{ marginBottom: 8 }}>
              {r.needs_kam ? <span style={pill('#b42318')}>Needs you</span> : <span style={pill('#2e7d32')}>Routine</span>}
              <span style={pill('#555')}>{r.status === 'shadow' ? 'draft' : r.status}</span>
              <span style={{ fontSize: 13, opacity: .7 }}>{fmt(m?.received_at ?? r.created_at)}</span>
            </div>
            <h2 style={{ fontSize: 18, margin: '4px 0' }}>{m?.subject || r.subject}</h2>
            <div style={{ fontSize: 14, opacity: .8 }}>From {m?.from_email ?? r.to_email}{r.escalation_reasons?.length ? ` · ${r.escalation_reasons.join(', ')}` : ''}{r.category ? ` · ${r.category}` : ''}</div>
            <details style={{ margin: '12px 0' }} open>
              <summary style={{ cursor: 'pointer' }}>Their message</summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, opacity: .85 }}>{(m?.text_body ?? '').slice(0, 4000)}</pre>
            </details>
            {pending ? (
              <form>
                <input type="hidden" name="id" value={r.id} />
                <label style={{ fontSize: 13, fontWeight: 600 }}>Reply to {r.to_email}</label>
                <textarea name="body" defaultValue={r.body_text} rows={12} style={{ width: '100%', marginTop: 6, padding: 12, borderRadius: 10, font: 'inherit', fontSize: 14, border: '1px solid rgba(127,127,127,.4)', background: 'transparent', color: 'inherit' }} />
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button formAction={approveAndSend} disabled={sample} style={btn(true)}>Approve &amp; send</button>
                  <button formAction={dismiss} disabled={sample} style={btn(false)}>Dismiss</button>
                </div>
              </form>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14 }}>{r.body_text}{r.sent_at ? `\n\nSent ${fmt(r.sent_at)}` : ''}{r.last_error ? `\n\nError: ${r.last_error}` : ''}</pre>
            )}
          </section>
        )
      })}
    </main>
  )
}

const SAMPLE: Row[] = [
  { id: 's1', status: 'shadow', mode: 'shadow', needs_kam: true, escalation_reasons: ['not_answered_by_help'], to_email: 'client@example.com', subject: 'Re: Hub', body_text: 'Hi,\n\nThanks for getting in touch. A person on the Bricks team will look into this and reply shortly.\n\nBricks support', category: null, created_at: '2026-11-07T18:15:33Z', sent_at: null, last_error: null, support_email_messages: { from_email: 'client@example.com', subject: 'Hub', text_body: 'Where do I find the client hub for my listing?', received_at: '2026-11-07T18:15:33Z' } },
  { id: 's2', status: 'shadow', mode: 'shadow', needs_kam: false, escalation_reasons: [], to_email: 'agent@example.com', subject: 'Re: Drone rules?', body_text: 'Hi,\n\nThanks for getting in touch. Our help article “Drone shoots and airspace” covers this…\n\nBricks support', category: 'article:drone-rules', created_at: '2026-11-07T16:01:09Z', sent_at: null, last_error: null, support_email_messages: { from_email: 'agent@example.com', subject: 'Drone rules?', text_body: 'Can you fly a drone downtown?', received_at: '2026-11-07T16:01:09Z' } },
]

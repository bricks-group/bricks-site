'use client'

import { useState } from 'react'
import BrandMark from '@/components/BrandMark'
import BricksLoader from '@/components/BricksLoader'
import { BookCalendar } from '@/app/book/BookCalendar'
import type { VisitState } from '@/lib/plan-visit'

const TZ = 'America/Toronto'
const DAY_FMT = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' })

function humanDay(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  return DAY_FMT.format(new Date(Date.UTC(y, m - 1, d)))
}

type Busy = null | 'confirm' | 'pick' | 'decline'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="pv">
      <header className="pv-top">
        <a href="/" className="brand" aria-label="Bricks — home">
          <BrandMark />
          <span className="wordmark">bricks</span>
        </a>
      </header>
      <section className="pv-body">
        <div className="pv-card">{children}</div>
      </section>
      <footer className="pv-foot">
        Questions? Reply to the email or write to <a href="mailto:help@brxs.ca">help@brxs.ca</a>.
      </footer>
    </main>
  )
}

function Message({ over, title, children, action }: { over?: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Shell>
      {over ? <span className="over">{over}</span> : null}
      <h1 className="pv-h1">{title}</h1>
      <p className="pv-lead">{children}</p>
      {action ? <div className="pv-actions">{action}</div> : null}
    </Shell>
  )
}

export default function VisitConfirm({ token, initial }: { token: string; initial: VisitState }) {
  const [st, setSt] = useState<VisitState>(initial)
  const [view, setView] = useState<'main' | 'pick'>('main')
  const [picked, setPicked] = useState(initial.state === 'proposed' ? initial.visit_date : '')
  const [busy, setBusy] = useState<Busy>(null)
  const [err, setErr] = useState('')

  async function call(action: 'confirm' | 'decline', date?: string, which: Busy = action) {
    setBusy(which)
    setErr('')
    try {
      const r = await fetch(`/api/visit/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(date ? { token, date } : { token }),
      })
      const j = await r.json().catch(() => ({}))
      if (j && j.ok) {
        setSt(action === 'confirm' ? { state: 'confirmed', visit_date: j.visit_date, day: j.day } : { state: 'declined' })
        return
      }
      if (j && typeof j.state === 'string' && j.state !== 'proposed') {
        setSt(j as VisitState)
        return
      }
      setErr((j && j.message) || "That didn't work. Try another date.")
    } catch {
      setErr("We couldn't reach Bricks. Check your connection and try again.")
    } finally {
      setBusy(null)
    }
  }

  switch (st.state) {
    case 'confirmed':
      return (
        <Message over="Plan visit" title="You're booked">
          Your visit is confirmed{st.day ? <> for <strong>{st.day}</strong></> : null}. We'll send the photographer's details the day before.
        </Message>
      )
    case 'declined':
      return (
        <Message over="Plan visit" title="Skipped">
          No visit booked. Your credit stays on your plan, and we'll suggest the next date.
        </Message>
      )
    case 'lapsed':
      return (
        <Message over="Plan visit" title="This date has lapsed">
          Your visit credit is still on your plan. Book it from the Bricks app, or reply to the email.
        </Message>
      )
    case 'inactive':
      return (
        <Message over="Plan visit" title="This link isn't active yet">
          Reply to the email and we'll sort it out.
        </Message>
      )
    case 'expired':
    case 'missing':
      return (
        <Message over="Plan visit" title="This link has expired">
          Reply to the email and we'll send you a fresh one.
        </Message>
      )
    case 'error':
      return (
        <Message
          over="Plan visit"
          title="We couldn't load your visit"
          action={
            <button type="button" className="btn btn-sec pv-btn" onClick={() => location.reload()}>
              Try again
            </button>
          }
        >
          Give it a moment and try again, or reply to the email.
        </Message>
      )
  }

  const v = st
  const disabled = busy !== null

  if (view === 'pick') {
    const same = picked === v.visit_date
    return (
      <Shell>
        <span className="over">Plan visit</span>
        <h1 className="pv-h1">Pick another date</h1>
        <p className="pv-lead">Choose a day that works{v.site ? <> for <strong>{v.site}</strong></> : null}. It's still included in your plan.</p>
        <div className="pv-cal">
          <BookCalendar value={picked} onChange={(d) => { setPicked(d); setErr('') }} tz={TZ} min={v.min_date} max={v.max_date} checkAvailability={false} />
        </div>
        {err ? <p className="pv-err" role="alert">{err}</p> : null}
        <div className="pv-actions">
          <button type="button" className="btn pv-btn pv-primary" disabled={disabled || !picked} onClick={() => call('confirm', same ? undefined : picked, 'pick')}>
            {busy === 'pick' ? <BricksLoader variant="cycle" size={16} color="currentColor" label="Booking" /> : null}
            <span>Confirm {picked ? humanDay(picked) : 'date'}</span>
          </button>
          <button type="button" className="btn btn-sec pv-btn" disabled={disabled} onClick={() => { setView('main'); setErr('') }}>
            Back
          </button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <span className="over">Plan visit</span>
      <h1 className="pv-h1">Confirm your visit</h1>
      <p className="pv-lead">
        We'd like to visit{v.site ? <> <strong>{v.site}</strong></> : ' your site'} on <strong>{v.day}</strong>.
      </p>
      <dl className="pv-sum">
        <div><dt>Date</dt><dd>{v.day}</dd></div>
        {v.site ? <div><dt>Site</dt><dd>{v.site}</dd></div> : null}
        <div><dt>Cost</dt><dd>Included in your plan</dd></div>
      </dl>
      {err ? <p className="pv-err" role="alert">{err}</p> : null}
      <div className="pv-actions">
        <button type="button" className="btn pv-btn pv-primary" disabled={disabled} onClick={() => call('confirm')}>
          {busy === 'confirm' ? <BricksLoader variant="cycle" size={16} color="currentColor" label="Confirming" /> : null}
          <span>Confirm {v.day}</span>
        </button>
        <button type="button" className="btn btn-sec pv-btn" disabled={disabled} onClick={() => { setPicked(v.visit_date); setView('pick'); setErr('') }}>
          Pick another date
        </button>
        <button type="button" className="pv-link" disabled={disabled} onClick={() => call('decline')}>
          {busy === 'decline' ? <BricksLoader variant="cycle" size={14} color="currentColor" label="Skipping" /> : null}
          <span>Not this time</span>
        </button>
      </div>
      <p className="pv-note">Nothing is booked until you confirm. Your visit credit stays on your plan if you skip.</p>
    </Shell>
  )
}

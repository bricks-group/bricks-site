'use client'

import { useState } from 'react'
import { NOT_COVERED_MESSAGE, joinCoverageWaitlist, type CoverageInput } from '@/lib/booking-coverage'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Shown instead of times and checkout when no vendor reaches the address. No charge. */
export default function NotInArea({ input, email: initialEmail = '' }: { input: CoverageInput; email?: string }) {
  const [email, setEmail] = useState(initialEmail)
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [err, setErr] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) { setErr('Enter a valid email.'); return }
    setErr('')
    setState('saving')
    const r = await joinCoverageWaitlist({ ...input, email })
    if (r.ok) setState('saved')
    else { setState('idle'); setErr(r.error || '') }
  }

  return (
    <div
      role="status"
      data-testid="not-in-area"
      style={{ border: '1px solid var(--hair)', borderRadius: 0, background: 'var(--paper)', padding: 18, display: 'grid', gap: 10 }}
    >
      <p style={{ margin: 0, color: 'var(--ink)', fontWeight: 500 }}>{NOT_COVERED_MESSAGE}</p>
      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--inkMute)' }}>Nothing has been charged.</p>
      {state === 'saved' ? (
        <p style={{ margin: 0, fontSize: 14, color: 'var(--inkSoft)' }}>Thanks. We’ll email you when a vendor is near.</p>
      ) : (
        <form onSubmit={save} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="email"
            aria-label="Email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: '1 1 220px', minHeight: 44, borderRadius: 0, border: '1px solid var(--hairStrong)', padding: '0 12px', font: 'inherit' }}
          />
          <button className="btn btn-sec" type="submit" disabled={state === 'saving'} style={{ minHeight: 44, borderRadius: 0 }}>
            {state === 'saving' ? 'Saving…' : 'Let me know'}
          </button>
        </form>
      )}
      {err && <p role="alert" style={{ margin: 0, fontSize: 13.5, color: 'var(--brickDeep)' }}>{err}</p>}
    </div>
  )
}

'use client'

import { useState } from 'react'

/**
 * Shown on the confirmation to guests (Kam 2026-11-21): one click emails a
 * sign-in link that creates their Bricks account with the details they just
 * booked with. Optional, after payment, never in the way of checkout.
 */
export default function SaveDetailsOffer({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'error'>('idle')
  const [hint, setHint] = useState('')

  async function save() {
    setState('busy')
    try {
      const r = await fetch('/api/book/save-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      })
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; email_hint?: string }
      if (r.ok && j.ok) { setHint(j.email_hint || ''); setState('sent') } else setState('error')
    } catch {
      setState('error')
    }
  }

  return (
    <div data-testid="save-details" style={{ marginTop: 16, padding: 'var(--card-pad, 24px)', border: '1px solid var(--hairStrong)', borderRadius: 0, textAlign: 'left' }}>
      {state === 'sent' ? (
        <>
          <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>Check your email.</h3>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--inkSoft)' }}>We sent a link{hint ? ` to ${hint}` : ''}. Open it to finish. No password needed.</p>
        </>
      ) : (
        <>
          <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>Save your details for next time.</h3>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--inkSoft)' }}>Next booking takes seconds, and this shoot shows up in your Bricks account.</p>
          <button type="button" className="btn btn-sec" onClick={save} disabled={state === 'busy'} style={{ borderRadius: 0, background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)' }}>
            {state === 'busy' ? 'Saving…' : 'Save my details'}
          </button>
          {state === 'error' && <p role="status" style={{ margin: '12px 0 0', fontSize: 13.5, color: 'var(--inkSoft)' }}>That didn&apos;t go through. You can set up an account any time at app.brxs.ca.</p>}
        </>
      )}
    </div>
  )
}

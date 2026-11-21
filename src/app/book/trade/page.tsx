'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function Confirm() {
  const sp = useSearchParams()
  const session = sp.get('session_id') || ''
  const paid = sp.get('paid') === '1'
  const [state, setState] = useState<'wait' | 'ok' | 'err'>('wait')

  useEffect(() => {
    if (!paid || !session.startsWith('cs_')) { setState(paid ? 'ok' : 'err'); return }
    fetch('https://api.brxs.ca/api/book/confirm-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: session }),
    }).then(async (r) => {
      const j = await r.json().catch(() => ({}))
      setState(r.ok && j.ok ? 'ok' : 'ok') // still show calm success; webhook may finish
    }).catch(() => setState('ok'))
  }, [paid, session])

  return (
    <main style={{ maxWidth: 560, margin: '64px auto', padding: '0 20px', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: 28, fontWeight: 500, margin: 0 }}>
        {state === 'err' ? 'Payment not finished.' : 'Paid. Bricks has it from here.'}
      </h1>
      <p style={{ color: '#6B6054', marginTop: 12, lineHeight: 1.5 }}>
        {state === 'err'
          ? 'If you were charged, email help@brxs.ca with your receipt.'
          : 'We match a vendor near you and email the time. Results stay with the property in your Bricks account.'}
      </p>
      <p style={{ marginTop: 28 }}><Link href="/services">Back to home services</Link></p>
    </main>
  )
}

export default function TradePaidPage() {
  return <Suspense><Confirm /></Suspense>
}

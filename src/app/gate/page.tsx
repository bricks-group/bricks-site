'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BrandMark from '@/components/BrandMark'

function GateForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password: password.trim() }),
      })
      if (!res.ok) {
        setError('Incorrect password')
        setPending(false)
        return
      }
      const next = searchParams.get('next') || '/'
      const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
      router.replace(safeNext)
      router.refresh()
    } catch {
      setError('Something went wrong')
      setPending(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'var(--paper)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 28,
            justifyContent: 'center',
          }}
        >
          <BrandMark />
          <span className="wordmark">bricks</span>
        </div>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label
            htmlFor="gate-password"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              letterSpacing: '0.16em',
              textTransform: 'none',
              color: 'var(--inkMute)',
            }}
          >
            Password
          </label>
          <input
            id="gate-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              fontFamily: "'General Sans', system-ui, sans-serif",
              fontSize: 15,
              padding: '12px 14px',
              border: '1px solid var(--hairStrong)',
              borderRadius: 2,
              background: 'var(--paperSoft)',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
          {error ? (
            <p style={{ color: 'var(--brickDeep)', fontSize: 13, margin: 0 }} role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            style={{
              marginTop: 8,
              fontFamily: "'General Sans', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              padding: '12px 16px',
              border: 'none',
              borderRadius: 2,
              background: 'var(--brick)',
              color: '#fff',
              cursor: pending ? 'wait' : 'pointer',
              opacity: pending ? 0.7 : 1,
            }}
          >
            {pending ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function GatePage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh' }} />}>
      <GateForm />
    </Suspense>
  )
}

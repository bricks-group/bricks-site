import type { ReactNode } from 'react'

export function NlShell({ children }: { children: ReactNode }) {
  return (
    <main className="pv">
      <header className="pv-top">
        <a href="/" className="brand" aria-label="Bricks — home"><span className="wordmark">bricks</span></a>
      </header>
      <section className="pv-body"><div className="pv-card">{children}</div></section>
      <footer className="pv-foot">Questions? Write to <a href="mailto:hello@brxs.ca">hello@brxs.ca</a>.</footer>
    </main>
  )
}

export function NlMessage({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <NlShell>
      <h1 className="pv-h1">{title}</h1>
      <p className="pv-lead">{children}</p>
      {action ? <div className="pv-actions">{action}</div> : null}
    </NlShell>
  )
}

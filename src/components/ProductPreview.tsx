'use client'

import { useState } from 'react'
import ThemedScreenshot from './ThemedScreenshot'

// Real screenshot of the Brokerage OS, full-bleed backdrop with the window
// floating on top — same composition Cursor uses for its own hero (one window,
// real shadow, no contained card). The clickable regions sit invisibly over the
// actual sidebar nav rows in the image (Overview/CRM/Transactions/MLS/
// Accounting) — clicking one swaps in the matching screenshot, so it reads as
// navigating the app itself rather than a row of tab buttons floating outside it.
const VIEWS = [
  { id: 'overview', label: 'Overview', light: '/screens/brokerage-overview.png', dark: '/screens/brokerage-overview-dark.png', top: 19, height: 3.2 },
  { id: 'crm', label: 'CRM', light: '/screens/brokerage-crm.png', dark: '/screens/brokerage-crm-dark.png', top: 27, height: 2.6 },
  { id: 'transactions', label: 'Transactions', light: '/screens/brokerage-transactions.png', dark: '/screens/brokerage-transactions-dark.png', top: 30.8, height: 2.6 },
  { id: 'mls', label: 'MLS submission', light: '/screens/brokerage-mls.png', dark: '/screens/brokerage-mls-dark.png', top: 34.4, height: 2.6 },
  { id: 'accounting', label: 'Accounting', light: '/screens/brokerage-accounting.png', dark: '/screens/brokerage-accounting-dark.png', top: 57, height: 2.6 },
]

export default function ProductPreview({ status }: { status?: string }) {
  const [active, setActive] = useState(0)
  const view = VIEWS[active]

  return (
    <div className="pp-desk">
      <div className="pp-win">
        <div className="pp-bar">
          <i /><i /><i />
        </div>
        <div className="pp-screen">
          <ThemedScreenshot
            srcLight={view.light}
            srcDark={view.dark}
            alt={`Bricks OS — ${view.label}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            loading="lazy"
          />
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              className="pp-hot"
              style={{ top: `${v.top}%`, height: `${v.height}%` }}
              aria-label={`Show ${v.label}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
      {status && <span className="pp-status">{status}</span>}
      <style>{`
        .pp-desk{position:relative;width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);overflow:hidden;
          padding:72px 32px;display:flex;justify-content:center;
          background:radial-gradient(80% 100% at 50% 0%, var(--brick-tint), var(--paper-deep) 45%, var(--paper-soft) 80%);
          animation:pp-fade .8s cubic-bezier(.16,1,.3,1) .5s both;}
        @keyframes pp-fade{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @media (prefers-reduced-motion:reduce){.pp-desk{animation:none;}}
        .pp-win{position:relative;z-index:1;width:100%;max-width:920px;border-radius:10px;overflow:hidden;
          background:var(--paper);box-shadow:0 70px 140px -50px rgba(20,17,14,.55);}
        .pp-bar{height:34px;display:flex;align-items:center;gap:7px;padding:0 14px;background:var(--paper-soft);}
        .pp-bar i{width:10px;height:10px;border-radius:999px;background:var(--paper-deep);border:1px solid var(--hair-s);display:block;}
        .pp-screen{position:relative;}
        .pp-hot{position:absolute;left:0;width:16%;border:none;background:transparent;cursor:pointer;padding:0;
          border-radius:0 6px 6px 0;transition:background .12s ease;}
        .pp-hot:hover,.pp-hot:focus-visible{background:rgba(210,84,43,.08);outline:none;}
        .pp-status{position:relative;z-index:1;display:block;text-align:center;margin-top:16px;
          font-family:'Ioskeley Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-4);}
        @media (max-width:640px){.pp-desk{padding:36px 16px;} .pp-hot{display:none;}}
      `}</style>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { PLANS as SITE_PLANS, PER_VISIT } from '@/lib/commercial'
import { AGENT_STACK_MONTHLY, SEAT_MONTHLY_RANGE } from '@/lib/brokerage-pitch'
import {
  FX, ROLES, SAVINGS_CHECKED, SAVINGS_FOOTNOTE, SAVINGS_PLANS, SAVINGS_SOURCES_PATH,
  builderStack, stackFor, type Role, type SavingsPlan,
} from '@/lib/savings'

const NAMES: Record<SavingsPlan, string> = { keystone: 'Keystone', marble: 'Marble', diamond: 'Diamond' }
const day = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
const money = (n: number) => `$${n.toLocaleString('en-CA')}`

type Row = { id: string; job: string; tool: string; url: string; price: string; cad: number }
type View = { figure: string; figureSub: string; separateLabel: string; separate: number; bricksLabel: string; bricks: number; rowsTitle: string; rows: Row[]; notes: string[] }

function Pills<T extends string>({ label, options, value, onChange }: { label: string; options: readonly { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="pg-switch sv-switch" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={value === o.id ? 'on' : ''} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function viewFor(role: Role, plan: SavingsPlan): View {
  if (role === 'builder') {
    const mapped = SITE_PLANS[1].rows[0].price
    const s = builderStack(mapped, PER_VISIT[2].price)
    return {
      figure: `You keep ~${money(s.keep)} a month`,
      figureSub: `About ${money(s.keep * 12)} a year on one site, with one vendor, one portal and dated evidence for every draw.`,
      separateLabel: 'Two separate services, one visit a month',
      separate: s.separate,
      bricksLabel: 'Bricks mapped plan, per site a month',
      bricks: s.bricks,
      rowsTitle: 'What you’d book separately',
      rows: s.tools.map(({ tool, cad }) => ({ id: tool.id, job: tool.job, tool: tool.tool, url: tool.url, price: `${money(cad)} ${tool.unit}`, cad })),
      notes: [
        `First month: both add a one-time ground-control setup (Bricks ${money(s.setupBricks)}; the mapping firm’s first capture is ${money(s.setupSeparate)} more).`,
        'Not counted: a photo platform to store and share it all (OpenSpace and similar quote on request), and the hours spent assembling lender and investor reports.',
      ],
    }
  }
  if (role === 'brokerage') {
    const s = stackFor('diamond')
    const low = AGENT_STACK_MONTHLY - SEAT_MONTHLY_RANGE.max
    const high = AGENT_STACK_MONTHLY - SEAT_MONTHLY_RANGE.min
    return {
      figure: `~${money(low)} to ${money(high)} less per agent a month`,
      figureSub: 'Than each agent buying their own tools for what a seat includes. Smaller offices pay the higher seat price.',
      separateLabel: 'Separate tools, per agent a month',
      separate: s.separate,
      bricksLabel: `Bricks seat, a month (${money(SEAT_MONTHLY_RANGE.min)} to ${money(SEAT_MONTHLY_RANGE.max)} by office size)`,
      bricks: SEAT_MONTHLY_RANGE.max,
      rowsTitle: 'What each agent would buy separately',
      rows: s.tools.map(({ tool, cad }) => ({ id: tool.id, job: tool.job, tool: tool.tool, url: tool.url, price: `$${tool.usdMonthly} USD a month`, cad })),
      notes: ['Trust accounting, the AI CMA and the AI document drafter come with every seat and are not counted.'],
    }
  }
  const s = stackFor(plan)
  return {
    figure: `You keep ~${money(s.keep)} a month`,
    figureSub: `About ${money(s.keep * 12)} a year on Bricks ${NAMES[plan]}.`,
    separateLabel: 'Separate tools, a month',
    separate: s.separate,
    bricksLabel: `Bricks ${NAMES[plan]}, a month`,
    bricks: s.bricks,
    rowsTitle: 'What you’d pay for separately',
    rows: s.tools.map(({ tool, cad }) => ({ id: tool.id, job: tool.job, tool: tool.tool, url: tool.url, price: `$${tool.usdMonthly} USD a month`, cad })),
    notes: [
      ...(plan === 'diamond' ? ['The AI CMA and AI document drafter are not counted: we found no like tool with a public price.'] : []),
      'Bricks e-sign uses a signing checklist; placing fields on the PDF is coming soon.',
      ...(role === 'team' ? ['Your agents use your plan, and Bricks doesn’t charge per agent. Separate tools set their own terms for extra users.'] : []),
    ],
  }
}

/** "One system, not a stack of subscriptions": one clear figure per role, then the tool-by-tool detail. */
export default function Savings() {
  const [role, setRole] = useState<Role>('agent')
  const [plan, setPlan] = useState<SavingsPlan>('marble')
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 721px)')
    const on = () => setWide(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const v = viewFor(role, plan)
  const max = Math.max(v.separate, v.bricks)

  return (
    <div className="sv">
      <Pills label="Who you are" options={ROLES} value={role} onChange={setRole} />
      {role === 'agent' || role === 'team' ? (
        <Pills label="Plan" options={SAVINGS_PLANS.map((p) => ({ id: p, label: NAMES[p] }))} value={plan} onChange={setPlan} />
      ) : null}

      <div className="sv-lead" aria-live="polite">
        <p className="sv-fig">{v.figure}</p>
        <p className="sv-figsub">{v.figureSub}</p>
        <dl className="sv-bars">
          <div>
            <dt>{v.separateLabel}</dt>
            <dd><span className="sv-bar sv-bar-them" style={{ width: `${(v.separate / max) * 100}%` }} /><span className="sv-amt">~{money(v.separate)}</span></dd>
          </div>
          <div>
            <dt>{v.bricksLabel}</dt>
            <dd><span className="sv-bar sv-bar-us" style={{ width: `${(v.bricks / max) * 100}%` }} /><span className="sv-amt">{money(v.bricks)}</span></dd>
          </div>
        </dl>
      </div>

      <details className="sv-detail" open={wide} key={wide ? 'w' : 'n'}>
        <summary>{v.rowsTitle}</summary>
        <ul className="cm-rows sv-rows">
          {v.rows.map((r) => (
            <li key={r.id}>
              <div className="cm-row">
                <span className="cm-row-t">{r.job}</span>
                <span className="cm-row-d"><a href={r.url} rel="noopener nofollow" target="_blank">{r.tool}</a>, {r.price}</span>
                <span className="cm-row-v">~{money(r.cad)} / mo</span>
              </div>
            </li>
          ))}
        </ul>
        {v.notes.map((n) => <p className="cm-note" key={n}>{n}</p>)}
      </details>

      <p className="cm-note sv-foot">
        {SAVINGS_FOOTNOTE} Vendor list prices checked {day(SAVINGS_CHECKED)}, one user, month to month, before tax. USD prices converted at the Bank of Canada rate of {FX.usdToCad} ({day(FX.date)}); builder prices are listed in CAD. <a href={SAVINGS_SOURCES_PATH}>Sources and method</a>.
      </p>
    </div>
  )
}

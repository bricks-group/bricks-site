'use client'

import { useEffect, useState } from 'react'
import { PLANS as SITE_PLANS, PER_VISIT } from '@/lib/commercial'
import AppShot from '@/components/AppShot'
import BuilderEdge from '@/components/BuilderEdge'
import { AGENT_STACK_MONTHLY, SEAT_MONTHLY_RANGE } from '@/lib/brokerage-pitch'
import {
  FX, ROLES, SAVINGS_CHECKED, SAVINGS_FOOTNOTE, SAVINGS_PLANS, SAVINGS_SOURCES_PATH,
  builderStack, stackFor, type Role, type SavingsPlan,
} from '@/lib/savings'

const NAMES: Record<SavingsPlan, string> = { keystone: 'Keystone', marble: 'Marble', diamond: 'Diamond' }
const day = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
const money = (n: number) => `$${n.toLocaleString('en-CA')}`
const usd = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)} USD a month`

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

function viewFor(role: Exclude<Role, 'builder'>, plan: SavingsPlan): View {
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
      rows: s.tools.map(({ tool, cad }) => ({ id: tool.id, job: tool.job, tool: tool.tool, url: tool.url, price: usd(tool.usdMonthly), cad })),
      notes: ['Trust accounting and the AI CMA come with every seat and are not counted.', 'Follow Up Boss charges per user, so the gap grows with every agent who would otherwise buy it.'],
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
    rows: s.tools.map(({ tool, cad }) => ({ id: tool.id, job: tool.job, tool: tool.tool, url: tool.url, price: usd(tool.usdMonthly), cad })),
    notes: [
      ...(plan !== 'keystone' ? ['Forms are not counted again: dotloop Premium already includes document templates.'] : []),
      ...(plan === 'diamond' ? ['The AI CMA is not counted: the leading CMA tools don’t publish a price.'] : []),
      'Follow Up Boss does more as a CRM (lead routing, action plans, calling and texting). Bricks syncs with it both ways if you keep it.',
      'Bricks e-sign uses a signing checklist; placing fields on the PDF is coming soon.',
      'Not counted: the listing site that comes with each paid shoot, and Virtual Visit tours, which are quoted on request.',
      ...(role === 'team' ? ['Follow Up Boss Grow is priced per user. Your agents use your Bricks plan, and Bricks doesn’t charge per agent.'] : []),
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

  return (
    <div className="sv">
      <Pills label="Who you are" options={ROLES} value={role} onChange={setRole} />
      {role === 'agent' || role === 'team' ? (
        <Pills label="Plan" options={SAVINGS_PLANS.map((p) => ({ id: p, label: NAMES[p] }))} value={plan} onChange={setPlan} />
      ) : null}

      {role === 'builder' ? <BuilderView wide={wide} /> : <PlanView v={viewFor(role, plan)} wide={wide} />}
      {role === 'brokerage' ? (
        <div className="sv-shot">
          <AppShot name="brokerage-overview" sizes="(max-width:760px) 100vw, 720px" alt="Bricks brokerage overview for a sample brokerage: pipeline, today's shoots, top performers and trust reconciliation" caption="What every seat runs on: the brokerage overview, shown with a sample brokerage." />
        </div>
      ) : null}

      <p className="cm-note sv-foot">
        {SAVINGS_FOOTNOTE} Vendor list prices checked {day(SAVINGS_CHECKED)}, one user, month to month, before tax. USD prices converted at the Bank of Canada rate of {FX.usdToCad} ({day(FX.date)}); builder prices are listed in CAD. <a href={SAVINGS_SOURCES_PATH}>Sources and method</a>.
      </p>
    </div>
  )
}

function PlanView({ v, wide }: { v: View; wide: boolean }) {
  const max = Math.max(v.separate, v.bricks)
  return (
    <>
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
    </>
  )
}

/** Builders: no savings figure (it depends on the vendor). What Bricks adds beyond a file handoff, then vendor prices for reference. */
function BuilderView({ wide }: { wide: boolean }) {
  const mapped = SITE_PLANS[1].rows[0].price
  const s = builderStack(mapped, PER_VISIT[2].price)
  return (
    <>
      <div className="sv-lead sv-lead-edge" aria-live="polite">
        <BuilderEdge compact />
      </div>
      <div className="sv-shot">
        <AppShot name="builder-timeline" sizes="(max-width:760px) 100vw, 720px" alt="Bricks site visit timeline for a sample project: dated visits with orthomosaic, 3D model, photos and site report" caption="The site portal: every visit filed by date. Sample project." />
      </div>
      <details className="sv-detail" open={wide} key={wide ? 'w' : 'n'}>
        <summary>What local vendors charge</summary>
        <ul className="cm-rows sv-rows">
          {s.tools.map(({ tool, cad }) => (
            <li key={tool.id}>
              <div className="cm-row">
                <span className="cm-row-t">{tool.job}</span>
                <span className="cm-row-d"><a href={tool.url} rel="noopener nofollow" target="_blank">{tool.tool}</a>, {money(cad)} {tool.unit}</span>
                <span className="cm-row-v">{money(cad)}</span>
              </div>
            </li>
          ))}
          <li>
            <div className="cm-row">
              <span className="cm-row-t">Bricks mapped plan</span>
              <span className="cm-row-d">Per site a month, visits, portal, sharing and reports included</span>
              <span className="cm-row-v">{money(s.bricks)}</span>
            </div>
          </li>
        </ul>
        <p className="cm-note">Vendor prices vary by city and package; some Toronto-area firms charge less per visit. Both add a one-time ground-control setup in the first month (Bricks {money(s.setupBricks)}).</p>
      </details>
    </>
  )
}

'use client'

import { useState } from 'react'
import { OFFICE_SEAT_PRICE_PER_MONTH } from '@/lib/catalog'
import { PLANS as SITE_PLANS, PER_VISIT, fmt } from '@/lib/commercial'
import {
  DRONE_SOFTWARE, FX, ROLES, SAVINGS_CHECKED, SAVINGS_FOOTNOTE, SAVINGS_PLANS, SAVINGS_SOURCES_PATH,
  cad, stackFor, type Role, type SavingsPlan, type Stack,
} from '@/lib/savings'

const NAMES: Record<SavingsPlan, string> = { keystone: 'Keystone', marble: 'Marble', diamond: 'Diamond' }
const day = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
const money = (n: number) => `$${n.toLocaleString('en-CA')}`

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

function ToolRows({ stack }: { stack: Stack }) {
  return (
    <ul className="cm-rows sv-rows">
      {stack.tools.map(({ tool, cad: c }) => (
        <li key={tool.id}>
          <div className="cm-row">
            <span className="cm-row-t">{tool.job}</span>
            <span className="cm-row-d">
              <a href={tool.url} rel="noopener nofollow" target="_blank">{tool.tool}</a>, list ${tool.usdMonthly} USD a month, checked {day(SAVINGS_CHECKED)}
            </span>
            <span className="cm-row-v">~{money(c)} / mo</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function Totals({ items }: { items: readonly { fig: string; label: string }[] }) {
  return (
    <dl className="cm-stats sv-totals">
      {items.map((s) => (
        <div key={s.label}><dt>{s.label}</dt><dd>{s.fig}</dd></div>
      ))}
    </dl>
  )
}

/** "One system instead of a stack of subscriptions": pick a role, see only the tools that role would replace. */
export default function Savings() {
  const [role, setRole] = useState<Role>('agent')
  const [plan, setPlan] = useState<SavingsPlan>('marble')
  const stack = stackFor(role === 'brokerage' ? 'diamond' : plan)
  const seats = Object.values(OFFICE_SEAT_PRICE_PER_MONTH)
  const mapped = SITE_PLANS[1].rows[0].price
  const setup = PER_VISIT[2].price
  const droneMonthly = cad(DRONE_SOFTWARE.usdYearly / 12)

  return (
    <div className="sv">
      <Pills label="Who you are" options={ROLES} value={role} onChange={setRole} />

      {role === 'agent' || role === 'team' ? (
        <>
          <Pills label="Plan" options={SAVINGS_PLANS.map((p) => ({ id: p, label: NAMES[p] }))} value={plan} onChange={setPlan} />
          <ToolRows stack={stack} />
          <Totals
            items={[
              { fig: `~${money(stack.separate)}`, label: 'Separate tools, a month' },
              { fig: money(stack.bricks), label: `Bricks ${NAMES[plan]}, a month` },
              { fig: `~${money(stack.keep)}`, label: 'You keep, a month' },
            ]}
          />
          <p className="cm-note">
            {plan === 'diamond' ? 'AI CMA and the AI document drafter are not counted: we found no like tool with a public price. ' : ''}
            Bricks e-sign uses a signing checklist; placing fields on the PDF is coming soon.
            {role === 'team' ? ' Your agents use your plan, and Bricks doesn’t charge per agent. Separate tools set their own terms for extra users.' : ''}
          </p>
        </>
      ) : null}

      {role === 'brokerage' ? (
        <>
          <p className="sv-lede">If each agent buys their own tools for what a seat includes:</p>
          <ToolRows stack={stack} />
          <Totals
            items={[
              { fig: `~${money(stack.separate)}`, label: 'Separate tools, per agent a month' },
              { fig: `${money(Math.min(...seats))}–${money(Math.max(...seats))}`, label: 'Bricks seat, a month, by office size' },
              { fig: 'Included', label: 'Trust accounting' },
            ]}
          />
          <p className="cm-note">AI CMA and the AI document drafter come with every seat and are not counted.</p>
        </>
      ) : null}

      {role === 'builder' ? (
        <>
          <p className="sv-lede">
            We don’t claim a saving here. Drone mapping software alone, <a href={DRONE_SOFTWARE.url} rel="noopener nofollow" target="_blank">{DRONE_SOFTWARE.tool}</a>, lists at {money(DRONE_SOFTWARE.usdYearly)} USD a year (checked {day(SAVINGS_CHECKED)}), and you still need a drone, a pilot and insurance. Site Progress includes the flight.
          </p>
          <Totals
            items={[
              { fig: `~${money(droneMonthly)}`, label: 'Mapping software alone, a month' },
              { fig: fmt(mapped), label: 'Bricks mapped plan, per site a month' },
              { fig: fmt(setup), label: 'One-time mapping setup per site' },
            ]}
          />
        </>
      ) : null}

      <p className="cm-note sv-foot">
        {SAVINGS_FOOTNOTE} One-user, month-to-month list prices in USD, converted at the Bank of Canada rate of {FX.usdToCad} on {day(FX.date)}, before tax. Each tool links to its pricing page. <a href={SAVINGS_SOURCES_PATH}>Sources and method</a>.
      </p>
    </div>
  )
}

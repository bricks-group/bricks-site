'use client'

import { useId, useMemo, useState } from 'react'
import './software.css'
import { TODAY_PER_VISIT } from '@/lib/market-rates'
import { agentSavings, builderSavings } from '@/lib/savings-math'

/**
 * Savings calculator. Every input is the visitor's own number; the defaults are labelled examples.
 * Bricks prices are passed in from lib/catalog and lib/commercial (the same values Stripe charges),
 * never typed here. The builder "today" starting prices are the middle of published rates (lib/market-rates).
 */

export type PlanPrice = { id: string; name: string; monthly: number }
export type SitePrice = { setup: number; visualPerVisit: number; mappedPerVisit: number; visualPlans: readonly { visits: number; price: number }[]; mappedPlans: readonly { visits: number; price: number }[] }

const money = (n: number) => `${n < 0 ? '−' : ''}$${Math.round(Math.abs(n)).toLocaleString('en-CA')}`
const hours = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString('en-CA')} h`
const num = (v: string) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : 0 }

function Field({ label, hint, value, onChange, unit, max }: { label: string; hint: string; value: number; onChange: (n: number) => void; unit?: string; max?: number }) {
  const id = useId()
  return (
    <div className="sc-field">
      <label htmlFor={id}>{label}</label>
      <div className="sc-input">
        <input id={id} type="number" inputMode="decimal" min={0} max={max} step="any" value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(num(e.target.value))} aria-describedby={`${id}-h`} />
        {unit ? <span className="sc-unit">{unit}</span> : null}
      </div>
      <p className="sc-hint" id={`${id}-h`}>{hint}</p>
    </div>
  )
}

type Line = { label: string; sub?: string; amount: number }
type Part = { label: string; value: number }

/**
 * One story, top to bottom: what you spend today, what it costs with Bricks, the saving, then where it comes from.
 * Today − With Bricks = You save, and the lines add up to the same figure (lib/savings-math).
 * A shortfall reads "costs $X more", never a red minus.
 */
function Story({ today, bricks, setup, lines, save, short }: {
  today: { total: number; parts: Part[] }
  bricks: { total: number; parts: Part[]; priceLabel: string }
  setup?: { value: number; sub: string }
  lines: Line[]
  save: number
  short: string
}) {
  const ahead = save >= 0
  const amt = (n: number) => (n >= 0 ? money(n) : `costs ${money(-n)} more`)
  return (
    <div className="sc-story">
      <div className="sc-row">
        <div><p className="sc-row-k">What you spend today</p><p className="sc-row-s">{today.parts.map((x, i) => <span key={x.label} className="sc-part">{i ? "· " : ""}{x.label} {money(x.value)}</span>)}</p></div>
        <p className="sc-row-v">{money(today.total)}<span>/mo</span></p>
      </div>
      <div className="sc-row">
        <div>
          <p className="sc-row-k">With Bricks</p>
          <p className="sc-row-s"><span className="sc-part">{bricks.parts[0].label} {money(bricks.parts[0].value)} <em>{bricks.priceLabel}</em></span>{bricks.parts.slice(1).map((x) => <span key={x.label} className="sc-part">· {x.label} {money(x.value)}</span>)}</p>
        </div>
        <p className="sc-row-v">{money(bricks.total)}<span>/mo</span></p>
      </div>
      {setup ? <p className="sc-setup">Plus {money(setup.value)} setup, once. {setup.sub}</p> : null}
      <div className={`sc-save${ahead ? '' : ' is-short'}`}>
        <p className="sc-save-k">{ahead ? 'You save' : 'Bricks costs more'}</p>
        <p className="sc-save-v">{money(Math.abs(save))}<span> a month</span></p>
        <p className="sc-save-s">{ahead ? `${money(save * 12)} a year` : short}</p>
      </div>
      <div className="sc-why">
        <p className="sc-why-h">Where it comes from</p>
        <ul>
          {lines.map((l) => (
            <li key={l.label}><span><b>{l.label}</b>{l.sub ? <i>{l.sub}</i> : null}</span><span className="sc-why-v">{amt(l.amount)}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString('en-CA')} ${n === 1 ? one : many}`

function AgentCalc({ plans }: { plans: readonly PlanPrice[] }) {
  const [listings, setListings] = useState(4)
  const [coordHours, setCoordHours] = useState(3)
  const [subs, setSubs] = useState(60)
  const [rate, setRate] = useState(75)
  const [share, setShare] = useState(30)
  // Example tools are a CRM, e-sign, a spreadsheet, a website builder and file transfer. Keystone ($49) is the
  // lowest plan that covers them (CRM and e-sign from Keystone; listing site on every plan), so it is the honest default.
  const [plan, setPlan] = useState((plans.find((p) => p.id === 'keystone') ?? plans[1] ?? plans[0]).id)
  const planName = plans.find((p) => p.id === plan)?.name ?? ''
  const planPrice = plans.find((p) => p.id === plan)?.monthly ?? 0

  const r = useMemo(() => agentSavings({ listings, coordHours, subs, rate, share, planPrice }), [listings, coordHours, subs, rate, share, planPrice])

  return (
    <div className="sc-body">
      <div className="sc-inputs">
        <Field label="Listings a month" hint="Example: 4. Use your own." value={listings} onChange={setListings} />
        <Field label="Hours coordinating each listing" hint="Booking vendors, sending access notes, chasing delivery and paperwork. Example: 3." value={coordHours} onChange={setCoordHours} unit="h" />
        <Field label="Monthly cost of tools Bricks would replace" hint="CRM, e-sign, website builder, file transfer. Only count what you would cancel. Example: $60." value={subs} onChange={setSubs} unit="$ / mo" />
        <Field label="What an hour of your time is worth" hint="Your own figure. Example: $75." value={rate} onChange={setRate} unit="$ / h" />
        <Field label="Share of coordinating time Bricks takes off your plate" hint="Your estimate. Example: 30%. Set it to 0 to count tools only." value={share} onChange={setShare} unit="%" max={100} />
        <div className="sc-field">
          <span className="sc-label" id="plan-l">Bricks plan</span>
          <div className="sc-seg" role="radiogroup" aria-labelledby="plan-l">
            {plans.map((p) => (
              <button key={p.id} type="button" role="radio" aria-checked={plan === p.id} className={plan === p.id ? 'on' : ''} onClick={() => setPlan(p.id)}>
                {p.name} <span>{p.monthly ? `$${p.monthly}` : 'Free'}</span>
              </button>
            ))}
          </div>
          {plan === 'clay' ? <p className="sc-hint">Clay has no CRM or e-sign, so only count tools it replaces, like a listing site.</p> : null}
          <p className="sc-hint">Starts on Keystone, the lowest plan with the CRM and e-sign from the example tools. Forms come with Marble; the AI suite with Diamond. Real Bricks prices, monthly, CAD before tax. Yearly billing gets two months free.</p>
        </div>
      </div>
      <div className="sc-out" aria-live="polite">
        <Story
          today={{ total: r.today.total, parts: [{ label: 'Tools', value: r.today.cash }, { label: 'Your time', value: r.today.time }] }}
          bricks={{ total: r.bricks.total, priceLabel: 'Bricks price', parts: [{ label: `${planName} plan`, value: r.bricks.price }, { label: 'Your time', value: r.bricks.time }] }}
          save={r.save}
          lines={[
            { label: 'Tools dropped, less the plan', sub: `${money(r.today.cash)} today, ${money(r.bricks.price)} for ${planName}`, amount: r.lines.cash },
            { label: 'Time back', sub: `${hours(r.hoursNow - r.hoursWith)} of ${hours(r.hoursNow)} at ${money(rate)} an hour`, amount: r.lines.time },
          ]}
          short="With these numbers the plan costs more than the tools and time it replaces. A lower plan may fit better."
        />
        <p className="sc-fine">Media is priced separately and isn’t counted here. With Bricks you pay one checkout per booking instead of each vendor. This is an estimate from the numbers you entered, not a promise of savings.</p>
      </div>
    </div>
  )
}


function BuilderCalc({ site }: { site: SitePrice }) {
  const [sites, setSites] = useState(2)
  const [visits, setVisits] = useState(2)
  const [mapped, setMapped] = useState(false)
  // "Today" follows the visit type until the visitor types their own figure.
  const [payNow, setPayNowRaw] = useState<number>(TODAY_PER_VISIT.visual)
  const [payEdited, setPayEdited] = useState(false)
  const setPayNow = (n: number) => { setPayEdited(true); setPayNowRaw(n) }
  const chooseKind = (m: boolean) => { setMapped(m); if (!payEdited) setPayNowRaw(m ? TODAY_PER_VISIT.mapped : TODAY_PER_VISIT.visual) }
  const [reports, setReports] = useState(1)
  const [reportHours, setReportHours] = useState(4)
  const [rate, setRate] = useState(90)
  const [share, setShare] = useState(50)

  const r = useMemo(() => builderSavings({ sites, visits, mapped, payNow, reports, reportHours, rate, share }, site), [sites, visits, mapped, payNow, reports, reportHours, rate, share, site])

  return (
    <div className="sc-body">
      <div className="sc-inputs">
        <Field label="Active sites" hint="Example: 2." value={sites} onChange={setSites} />
        <Field label="Visits per site a month" hint="Monthly plans cover 1, 2 or 4. Example: 2." value={visits} onChange={setVisits} />
        <div className="sc-field">
          <span className="sc-label" id="kind-l">Visit type</span>
          <div className="sc-seg" role="radiogroup" aria-labelledby="kind-l">
            <button type="button" role="radio" aria-checked={!mapped} className={!mapped ? 'on' : ''} onClick={() => chooseKind(false)}>Progress visit</button>
            <button type="button" role="radio" aria-checked={mapped} className={mapped ? 'on' : ''} onClick={() => chooseKind(true)}>Mapped capture</button>
          </div>
          <p className="sc-hint">Mapped plans add a one-time ${site.setup.toLocaleString('en-CA')} ground-control setup per site in the first month. It’s shown under the result, not in the monthly figure.</p>
        </div>
        <Field label="What you pay per visit today" hint={`Pilot, processing and any photographer, together. Example: $${(mapped ? TODAY_PER_VISIT.mapped : TODAY_PER_VISIT.visual).toLocaleString('en-CA')}, the middle of published GTA and Ontario ${mapped ? 'mapped capture' : 'progress visit'} prices. Use your own quote.`} value={payNow} onChange={setPayNow} unit="$" />
        <Field label="Reports per site a month" hint="Progress reports and investor updates. Example: 1." value={reports} onChange={setReports} />
        <Field label="Hours compiling each report" hint="Pulling images, writing what changed, laying it out. Example: 4." value={reportHours} onChange={setReportHours} unit="h" />
        <Field label="What an hour of that time is worth" hint="Your own figure. Example: $90." value={rate} onChange={setRate} unit="$ / h" />
        <Field label="Share of report work Bricks drafts for you" hint="Your estimate. Example: 50%. You still review every report." value={share} onChange={setShare} unit="%" max={100} />
      </div>
      <div className="sc-out" aria-live="polite">
        <Story
          today={{ total: r.today.total, parts: [{ label: 'Visits', value: r.today.cash }, { label: 'Report time', value: r.today.time }] }}
          bricks={{ total: r.bricks.total, priceLabel: 'Bricks price', parts: [{ label: 'Visits', value: r.bricks.price }, { label: 'Report time', value: r.bricks.time }] }}
          setup={r.setupOnce ? { value: r.setupOnce, sub: `${money(site.setup)} per site for ground control, first month only.` } : undefined}
          save={r.save}
          lines={[
            { label: 'Visits', sub: `${plural(visits * sites, 'visit')}: ${money(r.today.cash)} today, ${money(r.bricks.price)} with Bricks (${money(r.perVisit)} each)`, amount: r.lines.cash },
            { label: 'Report time back', sub: `${hours(r.hoursNow - r.hoursWith)} of ${hours(r.hoursNow)} at ${money(rate)} an hour`, amount: r.lines.time },
          ]}
          short="With these numbers Bricks costs more than what you pay today. You get one vendor, one place and dated evidence for every report."
        />
        <p className="sc-fine">Bricks isn’t pitched as the cheapest per visit: it’s one vendor, one place and dated evidence for every report. CAD before tax.</p>
      </div>
    </div>
  )
}

export default function SavingsCalculator({ plans, site, initial = 'builder' }: { plans: readonly PlanPrice[]; site: SitePrice; initial?: 'agent' | 'builder' }) {
  const [tab, setTab] = useState<'agent' | 'builder'>(initial)
  return (
    <div className="sc">
      <div className="sc-tabs" role="tablist" aria-label="Calculator">
        <button type="button" role="tab" aria-selected={tab === 'builder'} className={tab === 'builder' ? 'on' : ''} onClick={() => setTab('builder')}>Builders and developers</button>
        <button type="button" role="tab" aria-selected={tab === 'agent'} className={tab === 'agent' ? 'on' : ''} onClick={() => setTab('agent')}>Agents and teams</button>
      </div>
      {tab === 'agent' ? <AgentCalc plans={plans} /> : <BuilderCalc site={site} />}
    </div>
  )
}

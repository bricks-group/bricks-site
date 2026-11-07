'use client'

import { useId, useMemo, useState } from 'react'
import './software.css'
import { TODAY_PER_VISIT } from '@/lib/market-rates'

/**
 * Savings calculator. Every input is the visitor's own number; the defaults are labelled examples.
 * Bricks prices are passed in from lib/catalog and lib/commercial (the same values Stripe charges),
 * never typed here. No industry benchmarks are used.
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

/**
 * One story, top to bottom: what you spend today, the Bricks price, the saving, then where it comes from.
 * A shortfall reads "costs $X more", never a red minus.
 */
function Story({ today, bricks, setup, lines, short }: {
  today: { value: number; sub: string }
  bricks: { value: number; sub: string }
  setup?: { value: number; sub: string }
  lines: Line[]
  short: string
}) {
  const net = lines.reduce((a, l) => a + l.amount, 0)
  const ahead = net >= 0
  const amt = (n: number) => (n >= 0 ? money(n) : `costs ${money(-n)} more`)
  return (
    <div className="sc-story">
      <div className="sc-row">
        <div><p className="sc-row-k">What you spend today</p><p className="sc-row-s">{today.sub}</p></div>
        <p className="sc-row-v">{money(today.value)}<span>/mo</span></p>
      </div>
      <div className="sc-row">
        <div><p className="sc-row-k">With Bricks <em>Bricks price</em></p><p className="sc-row-s">{bricks.sub}</p></div>
        <p className="sc-row-v">{money(bricks.value)}<span>/mo</span></p>
      </div>
      {setup ? <p className="sc-setup">Plus {money(setup.value)} setup, once. {setup.sub}</p> : null}
      <div className={`sc-save${ahead ? '' : ' is-short'}`}>
        <p className="sc-save-k">{ahead ? 'You save' : 'Bricks costs more'}</p>
        <p className="sc-save-v">{money(Math.abs(net))}<span> a month</span></p>
        <p className="sc-save-s">{ahead ? `${money(net * 12)} a year` : short}</p>
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

  const r = useMemo(() => {
    const hoursBack = listings * coordHours * (Math.min(share, 100) / 100)
    const timeValue = hoursBack * rate
    const toolChange = subs - planPrice
    return {
      hoursBack,
      timeValue,
      toolChange,
      net: timeValue + toolChange,
    }
  }, [listings, coordHours, subs, rate, share, planPrice])

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
          today={{ value: subs, sub: 'Tools you would cancel' }}
          bricks={{ value: planPrice, sub: planPrice ? `${planName} plan` : `${planName} plan, free` }}
          lines={[
            { label: 'Tools dropped, less the plan', sub: `${money(subs)} today, ${money(planPrice)} with Bricks`, amount: subs - planPrice },
            { label: 'Time back', sub: `${hours(r.hoursBack)} at ${money(rate)} an hour`, amount: r.timeValue },
          ]}
          short="With these numbers the plan costs more than the tools and time it replaces. A lower plan may fit better."
        />
        <p className="sc-fine">Media is priced separately and isn’t counted here. With Bricks you pay one checkout per booking instead of each vendor. This is an estimate from the numbers you entered, not a promise of savings.</p>
      </div>
    </div>
  )
}

function siteCost(visits: number, perVisit: number, plans: readonly { visits: number; price: number }[]) {
  const plan = plans.find((p) => p.visits === visits)
  return plan ? { cost: plan.price, how: `monthly plan with ${visits} visit${visits === 1 ? '' : 's'} each` } : { cost: visits * perVisit, how: `${visits} visit${visits === 1 ? '' : 's'} each at $${perVisit.toLocaleString('en-CA')}` }
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

  const r = useMemo(() => {
    const per = siteCost(visits, mapped ? site.mappedPerVisit : site.visualPerVisit, mapped ? site.mappedPlans : site.visualPlans)
    const bricksCost = per.cost * sites
    const setupOnce = mapped ? site.setup * sites : 0
    const nowCost = payNow * visits * sites
    const hoursBack = sites * reports * reportHours * (Math.min(share, 100) / 100)
    const timeValue = hoursBack * rate
    return { per, bricksCost, setupOnce, perVisit: visits ? per.cost / visits : 0, nowCost, visitChange: nowCost - bricksCost, hoursBack, timeValue, net: nowCost - bricksCost + timeValue }
  }, [sites, visits, mapped, payNow, reports, reportHours, rate, share, site])

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
          today={{ value: r.nowCost, sub: `${plural(visits * sites, 'visit')} at ${money(payNow)}` }}
          bricks={{ value: r.bricksCost, sub: `${plural(sites, 'site')}, ${plural(visits, 'visit')} each, ${money(r.perVisit)} a visit` }}
          setup={r.setupOnce ? { value: r.setupOnce, sub: `${money(site.setup)} per site for ground control, first month only.` } : undefined}
          lines={[
            { label: 'Visits', sub: `${money(r.nowCost)} today, ${money(r.bricksCost)} with Bricks`, amount: r.nowCost - r.bricksCost },
            { label: 'Report time back', sub: `${hours(r.hoursBack)} at ${money(rate)} an hour`, amount: r.timeValue },
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

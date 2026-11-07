'use client'

import { useId, useMemo, useState } from 'react'
import './software.css'

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

function Result({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="sc-res">
      <dt>{label}</dt>
      <dd>{value}</dd>
      {sub ? <p>{sub}</p> : null}
    </div>
  )
}

function AgentCalc({ plans }: { plans: readonly PlanPrice[] }) {
  const [listings, setListings] = useState(4)
  const [coordHours, setCoordHours] = useState(3)
  const [vendors, setVendors] = useState(3)
  const [msgs, setMsgs] = useState(4)
  const [tools, setTools] = useState(5)
  const [subs, setSubs] = useState(60)
  const [rate, setRate] = useState(75)
  const [share, setShare] = useState(30)
  const [plan, setPlan] = useState(plans[1]?.id ?? plans[0].id)
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
      bookingsNow: listings * vendors,
      bookingsWith: listings,
      msgsNow: listings * vendors * msgs,
    }
  }, [listings, coordHours, vendors, msgs, subs, rate, share, planPrice])

  return (
    <div className="sc-body">
      <div className="sc-inputs">
        <Field label="Listings a month" hint="Example: 4. Use your own." value={listings} onChange={setListings} />
        <Field label="Hours coordinating each listing" hint="Booking vendors, sending access notes, chasing delivery and paperwork. Example: 3." value={coordHours} onChange={setCoordHours} unit="h" />
        <Field label="Media vendors you book for each listing" hint="Photos, drone, video, floor plan, 3D. Example: 3." value={vendors} onChange={setVendors} />
        <Field label="Messages to each vendor, per listing" hint="Booking, access, arrival, delivery. Example: 4." value={msgs} onChange={setMsgs} />
        <Field label="Separate tools you log in to" hint="CRM, e-sign, spreadsheet, website builder, file transfer. Example: 5." value={tools} onChange={setTools} />
        <Field label="Monthly cost of tools Bricks would replace" hint="Only count tools you would actually cancel. Example: $60." value={subs} onChange={setSubs} unit="$ / mo" />
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
          <p className="sc-hint">Real Bricks prices, monthly, CAD before tax. Yearly billing gets two months free.</p>
        </div>
      </div>
      <div className="sc-out" aria-live="polite">
        <dl>
          <Result label="Hours back a month" value={hours(r.hoursBack)} sub={`${listings} listings × ${coordHours} h × ${share}%`} />
          <Result label="Value of that time" value={money(r.timeValue)} sub={`${hours(r.hoursBack)} × $${rate} an hour`} />
          <Result label="Tools cancelled, less the plan" value={money(r.toolChange)} sub={`$${subs} − $${planPrice} for the plan`} />
          <Result label="Net a month" value={money(r.net)} sub={`${money(r.net * 12)} a year`} />
        </dl>
        <table className="sc-tally">
          <caption>Each month, from your numbers</caption>
          <thead><tr><th scope="col"></th><th scope="col">Now</th><th scope="col">With Bricks</th></tr></thead>
          <tbody>
            <tr><th scope="row">Logins</th><td>{tools}</td><td>1</td></tr>
            <tr><th scope="row">Media bookings</th><td>{r.bookingsNow}</td><td>{r.bookingsWith}</td></tr>
            <tr><th scope="row">Vendor invoices to pay</th><td>{r.bookingsNow}</td><td>0</td></tr>
            <tr><th scope="row">Messages to vendors</th><td>{r.msgsNow}</td><td>Updates sent for you</td></tr>
          </tbody>
        </table>
        <p className="sc-fine">Media is priced separately and isn’t counted here. With Bricks you pay one checkout per booking instead of each vendor. This is an estimate from the numbers you entered, not a promise of savings.</p>
      </div>
    </div>
  )
}

function siteCost(visits: number, perVisit: number, plans: readonly { visits: number; price: number }[]) {
  const plan = plans.find((p) => p.visits === visits)
  return plan ? { cost: plan.price, how: `monthly plan, ${visits} visit${visits === 1 ? '' : 's'}` } : { cost: visits * perVisit, how: `${visits} × $${perVisit.toLocaleString('en-CA')} per visit` }
}

function BuilderCalc({ site }: { site: SitePrice }) {
  const [sites, setSites] = useState(2)
  const [visits, setVisits] = useState(2)
  const [mapped, setMapped] = useState(false)
  const [payNow, setPayNow] = useState(600)
  const [vendors, setVendors] = useState(2)
  const [reports, setReports] = useState(1)
  const [reportHours, setReportHours] = useState(4)
  const [rate, setRate] = useState(90)
  const [share, setShare] = useState(50)

  const r = useMemo(() => {
    const per = siteCost(visits, mapped ? site.mappedPerVisit : site.visualPerVisit, mapped ? site.mappedPlans : site.visualPlans)
    const bricksCost = per.cost * sites
    const nowCost = payNow * visits * sites
    const hoursBack = sites * reports * reportHours * (Math.min(share, 100) / 100)
    const timeValue = hoursBack * rate
    return { per, bricksCost, nowCost, visitChange: nowCost - bricksCost, hoursBack, timeValue, net: nowCost - bricksCost + timeValue, handoffsNow: sites * visits * vendors, handoffsWith: sites * visits }
  }, [sites, visits, mapped, payNow, vendors, reports, reportHours, rate, share, site])

  return (
    <div className="sc-body">
      <div className="sc-inputs">
        <Field label="Active sites" hint="Example: 2." value={sites} onChange={setSites} />
        <Field label="Visits per site a month" hint="Monthly plans cover 1, 2 or 4. Example: 2." value={visits} onChange={setVisits} />
        <div className="sc-field">
          <span className="sc-label" id="kind-l">Visit type</span>
          <div className="sc-seg" role="radiogroup" aria-labelledby="kind-l">
            <button type="button" role="radio" aria-checked={!mapped} className={!mapped ? 'on' : ''} onClick={() => setMapped(false)}>Progress visit</button>
            <button type="button" role="radio" aria-checked={mapped} className={mapped ? 'on' : ''} onClick={() => setMapped(true)}>Mapped capture</button>
          </div>
          <p className="sc-hint">Mapped plans add a one-time ${site.setup.toLocaleString('en-CA')} setup per site, not included here.</p>
        </div>
        <Field label="What you pay per visit today" hint="Pilot, processing and any photographer, together. Example: $600." value={payNow} onChange={setPayNow} unit="$" />
        <Field label="Vendors per visit today" hint="Drone pilot, map processing, photographer. Example: 2." value={vendors} onChange={setVendors} />
        <Field label="Reports per site a month" hint="Progress reports and investor updates. Example: 1." value={reports} onChange={setReports} />
        <Field label="Hours compiling each report" hint="Pulling images, writing what changed, laying it out. Example: 4." value={reportHours} onChange={setReportHours} unit="h" />
        <Field label="What an hour of that time is worth" hint="Your own figure. Example: $90." value={rate} onChange={setRate} unit="$ / h" />
        <Field label="Share of report work Bricks drafts for you" hint="Your estimate. Example: 50%. You still review every report." value={share} onChange={setShare} unit="%" max={100} />
      </div>
      <div className="sc-out" aria-live="polite">
        <dl>
          <Result label="Bricks visits a month" value={money(r.bricksCost)} sub={`${sites} site${sites === 1 ? '' : 's'} × ${r.per.how}`} />
          <Result label="Visit cost change" value={money(r.visitChange)} sub={`${money(r.nowCost)} today − ${money(r.bricksCost)} with Bricks`} />
          <Result label="Report hours back" value={hours(r.hoursBack)} sub={`worth ${money(r.timeValue)}`} />
          <Result label="Net a month" value={money(r.net)} sub={`${money(r.net * 12)} a year`} />
        </dl>
        <table className="sc-tally">
          <caption>Each month, from your numbers</caption>
          <thead><tr><th scope="col"></th><th scope="col">Now</th><th scope="col">With Bricks</th></tr></thead>
          <tbody>
            <tr><th scope="row">Vendor bookings</th><td>{r.handoffsNow}</td><td>{r.handoffsWith}</td></tr>
            <tr><th scope="row">Reports compiled by hand</th><td>{sites * reports}</td><td>Drafted, you review</td></tr>
          </tbody>
        </table>
        <p className="sc-fine">A negative number means Bricks costs more than what you pay today. Bricks isn’t pitched as the cheapest per visit: it’s one vendor, one place and dated evidence for every report. CAD before tax.</p>
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

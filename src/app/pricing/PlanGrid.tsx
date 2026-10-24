'use client'

import { useState } from 'react'
import { SOFTWARE_PRICES } from '@/lib/catalog'

type Cycle = 'monthly' | 'yearly'

const PLANS = [
  { id: 'keystone', name: 'Keystone', base: 'Everything in Clay, plus', adds: ['CRM', 'E-sign with a signing checklist and shareable links'] },
  { id: 'marble', name: 'Marble', base: 'Everything in Keystone, plus', adds: ['Forms'] },
  { id: 'diamond', name: 'Diamond', base: 'Everything in Marble, plus', adds: ['AI listing copy', 'AI CMA', 'AI document drafter'] },
] as const

const money = (n: number) => `$${n.toLocaleString('en-US')}`

/** Individual plan cards with one monthly / yearly switch. Prices come from catalog SOFTWARE_PRICES (mirrors the app checkout). */
export default function PlanGrid({ signup }: { signup: string }) {
  const [cycle, setCycle] = useState<Cycle>('monthly')
  return (
    <div className="pg">
      <div className="pg-switch" role="radiogroup" aria-label="Billing cycle">
        {(['monthly', 'yearly'] as const).map((c) => (
          <button key={c} type="button" role="radio" aria-checked={cycle === c} className={cycle === c ? 'on' : ''} onClick={() => setCycle(c)}>
            {c === 'monthly' ? 'Monthly' : 'Yearly, 2 months free'}
          </button>
        ))}
      </div>
      <ul className="pg-cards">
        {PLANS.map((p) => {
          const price = SOFTWARE_PRICES[p.id]
          return (
            <li key={p.id} className="pg-card">
              <h3>{p.name}</h3>
              <p className="pg-price">
                <span className="pg-fig">{cycle === 'monthly' ? money(price.monthly) : money(price.yearly)}</span>
                <span className="pg-per">{cycle === 'monthly' ? '/ mo' : '/ yr'}</span>
              </p>
              <p className="pg-alt">{cycle === 'monthly' ? `or ${money(price.yearly)} a year, 2 months free` : `${money(price.monthly * 12 - price.yearly)} less than 12 months at ${money(price.monthly)}`}</p>
              <p className="pg-base">{p.base}</p>
              <ul className="pg-adds">
                {p.adds.map((a) => <li key={a}>{a}</li>)}
              </ul>
              <a className="btn btn-night pg-cta" href={signup}>Choose {p.name}</a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

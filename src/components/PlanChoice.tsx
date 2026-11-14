import { SOFTWARE_PLANS } from '@/lib/catalog'

/** One plain sentence per live plan. Longer feature lists stay in the compare drawer. */
export const PLAN_LINE: Record<string, string> = {
  clay: 'Your listings, deals and MLS® feed. No card.',
  keystone: 'Adds CRM and e-sign.',
  marble: 'Adds forms and deal rooms.',
  diamond: 'Adds Brixton AI.',
}

/**
 * The four live software plans, side by side, with one recommended default.
 * No new prices: figures come from the catalog, which matches Stripe.
 */
export default function PlanChoice() {
  return (
    <ul className="pr-choice">
      {SOFTWARE_PLANS.map((p) => {
        const rec = 'recommended' in p && p.recommended
        return (
          <li key={p.id} className={rec ? 'is-rec' : undefined}>
            <p className="pr-choice-price">
              {p.price}
              {rec ? <span className="pr-choice-rec">Recommended</span> : null}
            </p>
            <h3>{p.name}</h3>
            <p className="pr-choice-line">{PLAN_LINE[p.id]}</p>
            {p.yearly && p.yearly !== 'No card' ? <p className="pr-choice-yr">{p.yearly}</p> : null}
          </li>
        )
      })}
    </ul>
  )
}

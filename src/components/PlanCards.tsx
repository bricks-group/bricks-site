import { SOFTWARE_PLANS, PLAN_FEATURES, PLAN_ORDER } from '@/lib/catalog'

const LABEL: Record<string, string> = {
  'Listing file, transactions, and BYO MLS®': 'Your listings, deals and MLS® feed',
  'Book media at rack rate': 'Book shoots at standard prices',
}
const NOTE: Record<string, string> = {
  'Fields on the PDF, SHA-256 fingerprints and an audit trail': 'A tamper-proof record of every signature.',
}

type St = 'new' | 'inherited' | 'addon' | 'no'
function rowState(from: string, id: string, addon?: string): St {
  const at = PLAN_ORDER.indexOf(id as never), f = PLAN_ORDER.indexOf(from as never)
  if (at === f) return 'new'
  if (at > f) return 'inherited'
  if (addon && id !== 'clay') return 'addon'
  return 'no'
}

/** Clay–Diamond: every card lists the same rows in the same order; higher tiers check more of them. */
export default function PlanCards({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="incl plans" style={style}>
      {SOFTWARE_PLANS.map((p, i) => {
        const rec = 'recommended' in p && p.recommended
        const n = PLAN_FEATURES.filter((r) => ['new', 'inherited'].includes(rowState(r.from, p.id, r.addon))).length
        const prev = i > 0 ? SOFTWARE_PLANS[i - 1].name : null
        return (
          <div key={p.id} className={`c rvl${rec ? ' rec' : ''}`}>
            <span className="ic">{p.price}{rec ? <b className="rec-tag">Recommended</b> : null}</span>
            <h3>{p.name}</h3>
            <p className="yr">{p.yearly}</p>
            <p className="val">{p.value}</p>
            <p className="inh">{prev ? `Everything in ${prev}, plus` : 'Includes'} <span className="cnt">· {n} of {PLAN_FEATURES.length}</span></p>
            <ul>
              {PLAN_FEATURES.map((r) => {
                const st = rowState(r.from, p.id, r.addon)
                return (
                  <li key={LABEL[r.label] ?? r.label} className={`st-${st}`}>
                    {LABEL[r.label] ?? r.label}
                    {st === 'addon' ? <span className="add"> · add-on {r.addon}</span> : null}
                    {(NOTE[r.note ?? ""] ?? r.note) ? <span className="nt">{NOTE[r.note ?? ""] ?? r.note}</span> : null}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

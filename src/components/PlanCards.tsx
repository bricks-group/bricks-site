import { SOFTWARE_PLANS, PLAN_FEATURES, PLAN_ORDER } from '@/lib/catalog'

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
            <h4>{p.name}</h4>
            <p className="yr">{p.yearly}</p>
            <p className="val">{p.value}</p>
            <p className="inh">{prev ? `Everything in ${prev}, plus` : 'Includes'} <span className="cnt">· {n} of {PLAN_FEATURES.length}</span></p>
            <ul>
              {PLAN_FEATURES.map((r) => {
                const st = rowState(r.from, p.id, r.addon)
                return (
                  <li key={r.label} className={`st-${st}`}>
                    {r.label}
                    {st === 'addon' ? <span className="add"> · add-on {r.addon}</span> : null}
                    {r.note && (st === 'new' || st === 'inherited') ? <span className="nt">{r.note}</span> : null}
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

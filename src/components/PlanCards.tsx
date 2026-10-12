import { SOFTWARE_PLANS } from '@/lib/catalog'

/** Clay–Diamond cards. Each tier opens with "Everything in <prev>, plus" so higher tiers visibly carry more. */
export default function PlanCards({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="incl plans" style={style}>
      {SOFTWARE_PLANS.map((p) => {
        const [first, ...rest] = p.points as readonly string[]
        const inherits = first.startsWith('Everything in ') ? first : null
        const adds = inherits ? rest : (p.points as readonly string[])
        const rec = 'recommended' in p && p.recommended
        return (
          <div key={p.id} className={`c rvl${rec ? ' rec' : ''}`}>
            <span className="ic">{p.price}{rec ? <b className="rec-tag">Recommended</b> : null}</span>
            <h4>{p.name}</h4>
            <p className="yr">{p.yearly}</p>
            <p className="val">{p.value}</p>
            {inherits ? <p className="inh">{inherits}, plus</p> : null}
            <ul>{adds.map((a) => <li key={a}>{a}</li>)}</ul>
          </div>
        )
      })}
    </div>
  )
}

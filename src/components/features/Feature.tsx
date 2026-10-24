import FeatureShot, { type FeatureShotName } from './FeatureShot'
import './features.css'

export type FeatureItem = {
  title: string
  body: string
  points?: readonly string[]
  shot: FeatureShotName
  alt: string
}

/** Product feature rows: numbered copy beside a real screenshot, alternating sides on desktop, stacked on phones. */
export function FeatureList({ items, label, sheet }: { items: readonly FeatureItem[]; label: string; sheet: string }) {
  return (
    <ol className="fx-list" aria-label={label}>
      {items.map((f, i) => (
        <li key={f.title} className={`fx-row rvl${i % 2 ? ' fx-flip' : ''}`}>
          <div className="fx-copy">
            <span className="fx-num">{sheet}-{String(i + 1).padStart(2, '0')}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
            {f.points?.length ? (
              <ul className="fx-points">
                {f.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            ) : null}
          </div>
          <FeatureShot name={f.shot} alt={f.alt} />
        </li>
      ))}
    </ol>
  )
}

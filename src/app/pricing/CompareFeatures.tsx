'use client'

import { useState } from 'react'
import { MATRIX_PLANS, MATRIX_PLAN_NAMES, PLAN_MATRIX, cellFor, type Cell, type MatrixPlan } from '@/lib/plan-matrix'

function Mark({ cell }: { cell: Cell }) {
  if (cell.kind === 'yes') return <span className="cf-yes" aria-label="Included">✓</span>
  if (cell.kind === 'no') return <span className="cf-no" aria-label="Not included">—</span>
  return <span className="cf-txt">{cell.text}</span>
}

/**
 * "Compare every feature": collapsed by default. A grouped table on wide screens;
 * on phones, pick one plan and read a plain two-column list (no sideways scroll).
 * Rows mirror the app's plan gates (src/lib/plan-matrix.ts).
 */
export default function CompareFeatures() {
  const [plan, setPlan] = useState<MatrixPlan>('marble')
  return (
    <details className="cf" id="compare">
      <summary>
        <span>Compare every feature</span>
        <span className="cf-hint">Every plan, side by side</span>
      </summary>

      <table className="cf-table">
        <caption className="cf-sr">Features by plan</caption>
        <thead>
          <tr>
            <th scope="col"><span className="cf-sr">Feature</span></th>
            {MATRIX_PLANS.map((p) => <th scope="col" key={p}>{MATRIX_PLAN_NAMES[p]}</th>)}
          </tr>
        </thead>
        {PLAN_MATRIX.map((g) => (
          <tbody key={g.title}>
            <tr className="cf-group"><th scope="rowgroup" colSpan={MATRIX_PLANS.length + 1}>{g.title}</th></tr>
            {g.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {MATRIX_PLANS.map((p) => <td key={p}><Mark cell={cellFor(r, p)} /></td>)}
              </tr>
            ))}
          </tbody>
        ))}
      </table>

      <div className="cf-mobile">
        <label className="cf-pick">
          <span>Show plan</span>
          <select value={plan} onChange={(e) => setPlan(e.target.value as MatrixPlan)}>
            {MATRIX_PLANS.map((p) => <option key={p} value={p}>{MATRIX_PLAN_NAMES[p]}</option>)}
          </select>
        </label>
        {PLAN_MATRIX.map((g) => (
          <div key={g.title} className="cf-mgroup">
            <h4>{g.title}</h4>
            <ul>
              {g.rows.map((r) => (
                <li key={r.label}><span>{r.label}</span><Mark cell={cellFor(r, plan)} /></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="cm-note">✓ included. — not on this plan. Brokerage seats get every feature, plus trust accounting. Team members use the owner’s plan.</p>
    </details>
  )
}

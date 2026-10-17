import type { ReactNode } from 'react'
import './phone.css'

/**
 * Realistic modern iPhone (19.5:9) in CSS: thin dark bezel, deliberate rounded corners
 * (the one exception to the square aesthetic), Dynamic Island, subtle side buttons.
 * Place inside a tray with overflow:hidden: the phone rises from the bottom edge and is clipped.
 */
export default function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="pf-stage">
      <div className="pf" role="img" aria-label={label}>
        <i className="pf-btn pf-btn-action" aria-hidden="true" />
        <i className="pf-btn pf-btn-volup" aria-hidden="true" />
        <i className="pf-btn pf-btn-voldn" aria-hidden="true" />
        <i className="pf-btn pf-btn-power" aria-hidden="true" />
        <div className="pf-screen">
          <div className="pf-island" aria-hidden="true" />
          <div className="pfs" aria-hidden="true">{children}</div>
        </div>
      </div>
    </div>
  )
}

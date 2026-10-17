'use client'

import BricksIcon from '@/components/icons/BricksIcon'
import { CORE_FROM, STORY_FROM, SHOWCASE_FROM } from '@/lib/pricing'
import StatusBar from './StatusBar'
import { usePlayInView } from './usePlayInView'

/** Booking phone (Media row): sample listing → package → time slot → Booked, then status ticks. 12s loop. */
const PKGS = [
  { n: 'Essentials', d: 'HDR photos, drone, floor plan', f: CORE_FROM },
  { n: 'Story', d: 'Essentials + cinematic reel', f: STORY_FROM },
  { n: 'Showcase', d: 'Story + Virtual tour', f: SHOWCASE_FROM },
]
const SLOTS = ['10:00', '13:30', '16:00']
const STATES = ['Booked', 'Assigned', 'In flight', 'Delivered'] as const

export default function BookingFlow() {
  const ref = usePlayInView<HTMLDivElement>()
  return (
    <div className="pfa pfa-book" ref={ref} data-play="0">
      <StatusBar />
      <div className="pfs-head">
        <span className="pfs-title">Book a shoot</span>
      </div>
      <div className="pfs-card pfa-in-0">
        <span className="pfs-addr">120 Sample Street, Toronto</span>
        <span className="pfs-meta"><span className="pfs-mono">2,140 sq ft</span> · Detached</span>
      </div>
      <div className="pfs-sec pfa-in-1">
        <span className="pfs-lbl">Package</span>
        <ul className="pfs-pk">
          {PKGS.map((p) => (
            <li key={p.n}><span className="pfs-pk-n">{p.n}<small>{p.d}</small></span><span className="pfs-mono">${p.f}</span></li>
          ))}
          <i className="pfs-pk-sel" aria-hidden="true" />
        </ul>
      </div>
      <div className="pfs-sec pfa-in-2">
        <span className="pfs-lbl">Thu, Apr 23</span>
        <ul className="pfs-slots">
          {SLOTS.map((s) => <li key={s} className="pfs-mono">{s}</li>)}
          <i className="pfs-slot-sel" aria-hidden="true" />
        </ul>
      </div>
      <div className="pfs-cta pfa-in-3">
        <span className="pfs-cta-a">Confirm booking</span>
        <span className="pfs-cta-b"><BricksIcon name="booked" size={16} /> Booked</span>
      </div>
      <ol className="pfs-states pfa-in-4">
        {STATES.map((s) => (
          <li key={s}><i />{s}</li>
        ))}
      </ol>
    </div>
  )
}

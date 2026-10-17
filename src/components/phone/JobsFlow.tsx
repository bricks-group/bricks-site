'use client'

import BricksIcon from '@/components/icons/BricksIcon'
import StatusBar from './StatusBar'
import { usePlayInView } from './usePlayInView'

/** Photographer phone: jobs drop in; the first is accepted → navigating → uploading → delivered. 12s loop. Sample data. */
const JOBS = [
  { a: '45 Demo Crescent, Mississauga', t: '10:30', p: '$185.00', k: 'Photos + drone' },
  { a: '9 Example Court, Oakville', t: '13:00', p: '$240.00', k: 'Showcase' },
  { a: '310 Placeholder Rd, Vaughan', t: '15:45', p: '$120.00', k: 'Photos' },
]

export default function JobsFlow() {
  const ref = usePlayInView<HTMLDivElement>()
  return (
    <div className="pfa pfa-jobs" ref={ref} data-play="0">
      <StatusBar />
      <div className="pfs-head">
        <span className="pfs-title">Jobs</span>
        <span className="pfs-kicker"><span className="pfs-mono">Thu, Apr 23</span> · 3 new</span>
      </div>
      <ul className="pfs-jobs">
        {JOBS.map((j, i) => (
          <li key={j.a} className={`pfs-job pfs-job-${i}`}>
            <div className="pfs-job-top">
              <span className="pfs-addr">{j.a}</span>
              <span className="pfs-mono pfs-pay">{j.p}</span>
            </div>
            <span className="pfs-meta"><span className="pfs-mono">{j.t}</span> · {j.k}</span>
            {i === 0 ? (
              <div className="pfs-job-state">
                <span className="pjs pjs-new">Accept job</span>
                <span className="pjs pjs-acc"><BricksIcon name="assigned" size={16} /> Accepted</span>
                <span className="pjs pjs-nav"><BricksIcon name="in-flight" size={16} /> Navigating · <span className="pfs-mono">12 min</span></span>
                <span className="pjs pjs-up"><BricksIcon name="uploading" size={16} /> Uploading <span className="pfs-mono">48 files</span></span>
                <span className="pjs pjs-del"><BricksIcon name="delivered" size={16} /> Delivered</span>
                <i className="pfs-prog" aria-hidden="true"><b /></i>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

import Link from 'next/link'
import './software.css'

/** "Who Bricks is for": four audiences, equal weight, builders and developers first. One short line each. */
const AUDIENCES = [
  { id: 'builders', who: 'Builders and developers', line: 'Dated site visits, reports and investor updates.', href: '/builders', go: 'For builders' },
  { id: 'agents', who: 'Agents and brokerages', line: 'Listings, media and deals in one file.', href: '/agents', go: 'For agents' },
  { id: 'pm', who: 'Property managers', line: 'Condition reports and turnovers, unit by unit.', href: '/property-managers', go: 'For managers' },
  { id: 'vendors', who: 'Photographers and vendors', line: 'Steady jobs at a fixed rate, paid automatically.', href: '/photographers', go: 'Work with Bricks' },
]

export default function WhoFor() {
  return (
    <section className="cm-sec who rvl" aria-label="Who Bricks is for" id="who">
      <div className="cm-head"><div><h2>Who Bricks is for.</h2></div></div>
      <ul className="who-grid who-tight">
        {AUDIENCES.map((a, i) => (
          <li key={a.id} className="who-card">
            <span className="who-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3>{a.who}</h3>
            <p className="who-line">{a.line}</p>
            <Link className="who-go" href={a.href}>{a.go}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

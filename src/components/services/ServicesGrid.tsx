import Link from 'next/link'
import './services-grid.css'
import { MARK_BRICKS, MARK_COLOR, MARK_VIEWBOX } from '@/lib/brandMark'
import ServiceArt, { type ArtKind } from './ServiceArt'

/** Homepage "Every part, one system." — every Bricks module, equal weight, square tiles. */
type Tile = { t: string; d: string; href: string; art: ArtKind }

const TILES: Tile[] = [
  { t: 'Bricks', d: 'The desk for deals, CRM, e-sign and MLS® submission.', href: '/platform', art: 'os' },
  { t: 'Media', d: 'HDR photos, drone, floor plans, reels and video.', href: '/media', art: 'media' },
  { t: 'Virtual Visit', d: 'Free-roam 3D of the home.', href: '/media#visit', art: 'visit' },
  { t: 'Site Progress', d: 'Maps, models and reports for builders.', href: '/builders', art: 'site' },
  { t: 'Photographers', d: 'Independent pros, dispatched through Bricks.', href: '/photographers', art: 'pros' },
  { t: 'Integrations', d: 'Your MLS® feed and calendar, connected.', href: '#integrations', art: 'integrations' },
]

export default function ServicesGrid() {
  return (
    <section className="svc-sec rvl" id="services" aria-label="Bricks modules">
      <div className="wrap">
        <ul className="svc-grid">
          <li className="svc-head">
            <svg className="svc-assemble" viewBox={MARK_VIEWBOX} fill="none" shapeRendering="geometricPrecision" aria-hidden="true">
              {MARK_BRICKS.map((b, i) => (
                <rect key={i} x={b.x} y={b.y} width={b.width} height={b.height} rx={b.rx} fill={MARK_COLOR} fillOpacity={b.fillOpacity} style={{ ['--i' as string]: i }} />
              ))}
            </svg>
            <h2>Every part, one system.</h2>
            <p>Each module feeds the same deal, listing or site file.</p>
          </li>
          {TILES.map((x) => (
            <li key={x.t}>
              <Link className="svc-tile" href={x.href}>
                <span className="svc-vis">
                  <ServiceArt kind={x.art} />
                </span>
                <span className="svc-t">{x.t}<span className="svc-ar" aria-hidden="true">→</span></span>
                <span className="svc-d">{x.d}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import Link from 'next/link'
import './services-grid.css'
import { MARK_BRICKS, MARK_COLOR, MARK_VIEWBOX } from '@/lib/brandMark'

/** Homepage "Every part, one system." — every Bricks module, equal weight, square tiles.
 *  Covers: public/media/services/*-{480,800}.{avif,webp}, built by one art direction (see covers/make.py notes in changes.md). */
type Tile = { t: string; d: string; href: string; img: string }

const TILES: Tile[] = [
  { t: 'Bricks', d: 'The desk for deals, CRM, e-sign and MLS® submission.', href: '/platform', img: 'os' },
  { t: 'Media', d: 'HDR photos, drone, floor plans, reels and video.', href: '/media', img: 'media' },
  { t: 'Virtual Visit', d: 'Free-roam 3D of the home.', href: '/media#visit', img: 'visit' },
  { t: 'Site Progress', d: 'Maps, models and reports for builders.', href: '/builders', img: 'site' },
  { t: 'Photographers', d: 'Independent pros, dispatched through Bricks.', href: '/photographers', img: 'pros' },
  { t: 'Integrations', d: 'Your MLS® feed and calendar, connected.', href: '#integrations', img: 'integrations' },
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
                  {(
                    <picture>
                      <source type="image/avif" srcSet={`/media/services/${x.img}-480.avif 480w, /media/services/${x.img}-800.avif 800w`} sizes="(max-width:700px) 50vw, (max-width:1100px) 33vw, 340px" />
                      <source type="image/webp" srcSet={`/media/services/${x.img}-480.webp 480w, /media/services/${x.img}-800.webp 800w`} sizes="(max-width:700px) 50vw, (max-width:1100px) 33vw, 340px" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/media/services/${x.img}-480.webp`} width={480} height={480} alt="" loading="lazy" decoding="async" />
                    </picture>
                  )}
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

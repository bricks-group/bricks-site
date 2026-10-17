import type { Metadata } from 'next'
import BricksIcon from '@/components/icons/BricksIcon'
import type { IconName } from '@/components/icons/icons'
import './sample.css'

export const metadata: Metadata = {
  title: 'Design sample · Dispatch job view',
  robots: { index: false, follow: false },
}

/*
 * Visual-system sample (not linked from the site). Capture data is REAL, read from the EXIF of
 * DroneShot0352.jpeg (Kam's Drive, Development / Construction). Job ID, step times and crew are SAMPLE values.
 */
const CAPTURE = {
  lat: 43.729742, // 43°43'47.07" N
  lng: -79.774217, // 79°46'27.18" W
  altMsl: 267.8, // GPSAltitude, metres, WGS-84
  shutter: '1/2000 s', aperture: 'f/1.7', iso: 'ISO 100', focal: '6.7 mm',
  camera: 'DJI FC8482',
  taken: '2025-01-11 02:34:35', // DateTimeOriginal (camera clock, zone not recorded)
}

type Step = { k: string; icon: IconName; t: string; state: 'done' | 'live' | 'next' }
const STEPS: Step[] = [
  { k: 'Booked', icon: 'booked', t: '01-08 14:02', state: 'done' },
  { k: 'Assigned', icon: 'assigned', t: '01-08 14:03', state: 'done' },
  { k: 'In flight', icon: 'in-flight', t: '02:34:35', state: 'done' },
  { k: 'Uploading', icon: 'uploading', t: '02:51', state: 'done' },
  { k: 'QC', icon: 'qc', t: 'live', state: 'live' },
  { k: 'Delivered', icon: 'delivered', t: '—', state: 'next' },
]

const fmt = (n: number, ns: [string, string]) => `${Math.abs(n).toFixed(5)}° ${n >= 0 ? ns[0] : ns[1]}`

export default function DesignSample() {
  return (
    <main className="ds">
      <div className="ds-wrap">
        <p className="ds-note">Sample screen for the Bricks visual system. Capture data is real (photo EXIF); job ID, step times and crew are sample values.</p>

        <header className="ds-head">
          <div>
            <h1>Progress visit</h1>
            <p className="ds-sub">Podium at formwork stage. Drone stills and video, filed by visit.</p>
          </div>
          <dl className="ds-ids">
            <div><dt>Job</dt><dd className="vs-fig">SP-26-0352</dd></div>
            <div><dt>Visit</dt><dd className="vs-fig">04 / 12</dd></div>
            <div><dt>Plan</dt><dd>Visual</dd></div>
          </dl>
        </header>

        <ol className="ds-rail" aria-label="Job status">
          {STEPS.map((s) => (
            <li key={s.k} className={`ds-step is-${s.state}`} aria-current={s.state === 'live' ? 'step' : undefined}>
              <BricksIcon name={s.icon} size={16} />
              <span className="ds-step-k">{s.k}</span>
              <span className="ds-step-t vs-fig">{s.state === 'live' ? <><i className="ds-live" aria-hidden="true" />In review</> : s.t}</span>
            </li>
          ))}
        </ol>

        <section className="ds-body">
          <figure className="ds-frame">
            <picture>
              <source type="image/avif" srcSet="/media/site-progress/podium-formwork-960.avif 960w, /media/site-progress/podium-formwork-1600.avif 1600w" sizes="(max-width:900px) 100vw, 880px" />
              <source type="image/webp" srcSet="/media/site-progress/podium-formwork-960.webp 960w, /media/site-progress/podium-formwork-1600.webp 1600w" sizes="(max-width:900px) 100vw, 880px" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/site-progress/podium-formwork-960.webp" width={1600} height={900} alt="Drone still of a podium at formwork stage" />
            </picture>
            {/* No overlay mark on the frame: the GPS fix is the drone position, not a point in this oblique view. */}
            <figcaption className="ds-cap">
              <span><BricksIcon name="coordinate" size={16} /><span className="vs-fig">{fmt(CAPTURE.lat, ['N', 'S'])}  {fmt(CAPTURE.lng, ['E', 'W'])}</span></span>
              <span><BricksIcon name="elevation" size={16} /><span className="vs-fig">{CAPTURE.altMsl.toFixed(1)} m</span><span className="ds-cap-k">GPS altitude, MSL</span></span>
              <span><BricksIcon name="media" size={16} /><span className="vs-fig">{CAPTURE.shutter}  {CAPTURE.aperture}  {CAPTURE.iso}  {CAPTURE.focal}</span></span>
            </figcaption>
          </figure>

          <aside className="ds-side">
            <section>
              <h2>Capture</h2>
              <dl className="ds-kv">
                <div><dt>Taken</dt><dd className="vs-fig">{CAPTURE.taken}</dd></div>
                <div><dt>Camera</dt><dd className="vs-fig">{CAPTURE.camera}</dd></div>
                <div><dt>Datum</dt><dd className="vs-fig">WGS-84</dd></div>
                <div><dt>Latitude</dt><dd className="vs-fig">{CAPTURE.lat.toFixed(6)}</dd></div>
                <div><dt>Longitude</dt><dd className="vs-fig">{CAPTURE.lng.toFixed(6)}</dd></div>
              </dl>
            </section>
            <section>
              <h2>Deliverables</h2>
              <ul className="ds-list">
                <li><BricksIcon name="media" size={16} />Drone stills, dated</li>
                <li><BricksIcon name="film" size={16} />Flyover video</li>
                <li><BricksIcon name="layers" size={16} />Compare to last visit</li>
                <li><BricksIcon name="deal" size={16} />Filed to the site file</li>
              </ul>
            </section>
            <section>
              <h2>Crew</h2>
              <dl className="ds-kv">
                <div><dt>Pilot</dt><dd>Tier 3, Advanced RPAS</dd></div>
                <div><dt>Files</dt><dd className="vs-fig">1 still</dd></div>
              </dl>
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}

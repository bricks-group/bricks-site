'use client'

import { useMemo, useState } from 'react'
import type { DevAmenity, DevLot, DevPhase, DevProjectPublic } from './page'

type PinKind = 'phase' | 'lot' | 'amenity'
type Selected = { kind: PinKind; item: DevPhase | DevLot | DevAmenity } | null

const LOT_STATUS_COLOR: Record<DevLot['status'], string> = {
  available: '#2F6B3A',
  reserved: '#B8863B',
  sold: '#6B6054',
}

const PHASE_STATUS_LABEL: Record<DevPhase['status'], string> = {
  future: 'Future',
  under_construction: 'Under construction',
  released: 'Released',
}

function formatPrice(cents: number | null): string | null {
  if (cents == null) return null
  return `$${(cents / 100).toLocaleString()}`
}

const pageCss = `
  .ps-hero{padding:32px 0 24px;border-bottom:1px solid var(--hair);}
  .ps-hero h1{font-weight:500;font-size:clamp(28px,4vw,42px);letter-spacing:-0.7px;line-height:1.05;color:var(--ink);margin:10px 0 0;}
  .ps-hero p{font-size:15px;color:var(--inkSoft);margin-top:12px;max-width:640px;line-height:1.6;}
  .ps-legend{display:flex;flex-wrap:wrap;gap:16px;margin-top:18px;}
  .ps-legend-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--inkMute);}
  .ps-legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
  .ps-body{padding:28px 0 64px;}
  .ps-layout{display:grid;grid-template-columns:1fr;gap:28px;}
  @media (min-width:900px){ .ps-layout{grid-template-columns:1.4fr 1fr;align-items:start;} }
  .ps-plan{position:relative;width:100%;border-radius:4px;overflow:hidden;border:1px solid var(--hair);background:var(--paperDeep,#F4F1EB);}
  .ps-plan img{display:block;width:100%;height:auto;}
  .ps-pin{position:absolute;transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;
    border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);cursor:pointer;padding:0;
    display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;}
  .ps-pin:hover{transform:translate(-50%,-50%) scale(1.15);}
  .ps-pin.selected{outline:2px solid var(--brick);outline-offset:2px;}
  .ps-panel{border:1px solid var(--hair);border-radius:4px;padding:20px;min-height:160px;}
  .ps-panel h3{font-weight:500;font-size:18px;color:var(--ink);margin:0 0 4px;}
  .ps-panel .kind{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--inkMute);}
  .ps-panel .row{display:flex;justify-content:space-between;font-size:13px;color:var(--inkSoft);margin-top:6px;}
  .ps-panel .status-pill{display:inline-block;padding:2px 8px;border-radius:2px;font-size:11px;font-weight:600;
    text-transform:uppercase;color:#fff;margin-top:8px;}
  .ps-empty{font-size:13px;color:var(--inkMute);}
  .ps-list{margin-top:24px;}
  .ps-list h4{font-size:13px;font-weight:600;color:var(--ink);margin:0 0 8px;}
  .ps-list ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;}
  .ps-list li{font-size:13px;color:var(--inkSoft);display:flex;justify-content:space-between;gap:8px;cursor:pointer;}
  .ps-list li:hover{color:var(--ink);}
`

export default function ProjectSitePlan({ project }: { project: DevProjectPublic }) {
  const [selected, setSelected] = useState<Selected>(null)

  const pinned = useMemo(() => {
    const phases = project.phases.filter((p) => p.map_x != null && p.map_y != null)
    const lots = project.lots.filter((l) => l.map_x != null && l.map_y != null)
    const amenities = project.amenities.filter((a) => a.map_x != null && a.map_y != null)
    return { phases, lots, amenities }
  }, [project])

  const unpinnedLots = project.lots.filter((l) => l.map_x == null || l.map_y == null)

  function select(kind: PinKind, item: DevPhase | DevLot | DevAmenity) {
    setSelected({ kind, item })
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <section className="hero ps-hero">
        <div className="wrap">
          <span className="badge">Interactive site plan</span>
          <h1>{project.name}</h1>
          {project.description ? <p>{project.description}</p> : null}
          <div className="ps-legend">
            <span className="ps-legend-item"><span className="ps-legend-dot" style={{ background: LOT_STATUS_COLOR.available }} />Available</span>
            <span className="ps-legend-item"><span className="ps-legend-dot" style={{ background: LOT_STATUS_COLOR.reserved }} />Reserved</span>
            <span className="ps-legend-item"><span className="ps-legend-dot" style={{ background: LOT_STATUS_COLOR.sold }} />Sold / leased</span>
            <span className="ps-legend-item"><span className="ps-legend-dot" style={{ background: 'var(--brick)' }} />Phase</span>
            <span className="ps-legend-item"><span className="ps-legend-dot" style={{ background: '#3B3F6B' }} />Amenity</span>
          </div>
        </div>
      </section>

      <section className="block ps-body">
        <div className="wrap">
          {project.site_plan_image_url ? (
            <div className="ps-layout">
              <div className="ps-plan">
                {/* eslint-disable-next-line @next/next/no-img-element -- fractional-coordinate pin overlay needs the image's own rendered box, not next/image's fixed intrinsic sizing */}
                <img src={project.site_plan_image_url} alt={`${project.name} site plan`} />
                {pinned.phases.map((p) => (
                  <button
                    key={`phase-${p.id}`}
                    className={`ps-pin${selected?.kind === 'phase' && selected.item.id === p.id ? ' selected' : ''}`}
                    style={{ left: `${(p.map_x as number) * 100}%`, top: `${(p.map_y as number) * 100}%`, background: 'var(--brick)' }}
                    onClick={() => select('phase', p)}
                    aria-label={`Phase: ${p.name}`}
                  >
                    P
                  </button>
                ))}
                {pinned.lots.map((l) => (
                  <button
                    key={`lot-${l.id}`}
                    className={`ps-pin${selected?.kind === 'lot' && selected.item.id === l.id ? ' selected' : ''}`}
                    style={{ left: `${(l.map_x as number) * 100}%`, top: `${(l.map_y as number) * 100}%`, background: LOT_STATUS_COLOR[l.status] }}
                    onClick={() => select('lot', l)}
                    aria-label={`Lot ${l.lot_number}`}
                  />
                ))}
                {pinned.amenities.map((a) => (
                  <button
                    key={`amenity-${a.id}`}
                    className={`ps-pin${selected?.kind === 'amenity' && selected.item.id === a.id ? ' selected' : ''}`}
                    style={{ left: `${(a.map_x as number) * 100}%`, top: `${(a.map_y as number) * 100}%`, background: '#3B3F6B' }}
                    onClick={() => select('amenity', a)}
                    aria-label={`Amenity: ${a.name}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div>
                <DetailPanel selected={selected} phases={project.phases} />
                {unpinnedLots.length > 0 ? (
                  <div className="ps-list">
                    <h4>All lots</h4>
                    <ul>
                      {unpinnedLots.map((l) => (
                        <li key={l.id} onClick={() => select('lot', l)}>
                          <span>{l.lot_number}</span>
                          <span style={{ color: LOT_STATUS_COLOR[l.status] }}>{l.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <PlainListing project={project} />
          )}
        </div>
      </section>
    </>
  )
}

function DetailPanel({ selected, phases }: { selected: Selected; phases: DevPhase[] }) {
  if (!selected) {
    return (
      <div className="ps-panel">
        <p className="ps-empty">Click a pin on the site plan to see details.</p>
      </div>
    )
  }
  if (selected.kind === 'phase') {
    const p = selected.item as DevPhase
    return (
      <div className="ps-panel">
        <span className="kind">Phase</span>
        <h3>{p.name}</h3>
        <div className="row"><span>Status</span><span>{PHASE_STATUS_LABEL[p.status]}</span></div>
        {p.release_date ? <div className="row"><span>Release</span><span>{p.release_date}</span></div> : null}
      </div>
    )
  }
  if (selected.kind === 'lot') {
    const l = selected.item as DevLot
    const price = formatPrice(l.price_cents)
    const phaseName = l.phase_id ? phases.find((p) => p.id === l.phase_id)?.name : null
    return (
      <div className="ps-panel">
        <span className="kind">Lot</span>
        <h3>{l.lot_number}</h3>
        {phaseName ? <div className="row"><span>Phase</span><span>{phaseName}</span></div> : null}
        {price ? <div className="row"><span>Price</span><span>{price}</span></div> : null}
        {l.sqft ? <div className="row"><span>Size</span><span>{l.sqft.toLocaleString()} sqft</span></div> : null}
        <span className="status-pill" style={{ background: LOT_STATUS_COLOR[l.status] }}>{l.status}</span>
        {l.floor_plan_url ? (
          <div style={{ marginTop: 10 }}>
            <a className="btn btn-sec" href={l.floor_plan_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, padding: '8px 14px' }}>
              View floor plan
            </a>
          </div>
        ) : null}
      </div>
    )
  }
  const a = selected.item as DevAmenity
  return (
    <div className="ps-panel">
      <span className="kind">Amenity</span>
      <h3>{a.name}</h3>
      {a.description ? <p style={{ fontSize: 13, color: 'var(--inkSoft)', marginTop: 8 }}>{a.description}</p> : null}
      {a.media_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.media_url} alt={a.name} style={{ width: '100%', borderRadius: 4, marginTop: 10 }} />
      ) : null}
    </div>
  )
}

function PlainListing({ project }: { project: DevProjectPublic }) {
  return (
    <div className="ps-layout">
      <div>
        <div className="ps-list">
          <h4>Phases</h4>
          {project.phases.length === 0 ? <p className="ps-empty">No phases published yet.</p> : (
            <ul>
              {project.phases.map((p) => (
                <li key={p.id}><span>{p.name}</span><span>{PHASE_STATUS_LABEL[p.status]}</span></li>
              ))}
            </ul>
          )}
        </div>
        <div className="ps-list">
          <h4>Lots</h4>
          {project.lots.length === 0 ? <p className="ps-empty">No lots published yet.</p> : (
            <ul>
              {project.lots.map((l) => (
                <li key={l.id}>
                  <span>{l.lot_number}{l.sqft ? ` — ${l.sqft.toLocaleString()} sqft` : ''}</span>
                  <span style={{ color: LOT_STATUS_COLOR[l.status] }}>
                    {formatPrice(l.price_cents) || l.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="ps-list">
        <h4>Amenities</h4>
        {project.amenities.length === 0 ? <p className="ps-empty">No amenities published yet.</p> : (
          <ul>
            {project.amenities.map((a) => (
              <li key={a.id}><span>{a.name}</span></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

import { BUILDER_EDGE, BUILDER_EDGE_LEDE, BUILDER_EDGE_TITLE } from '@/lib/builder-edge'

/** "More than a local vendor": a calm two-column list (vendor, then Bricks). Shared by /pricing and /builders. */
export default function BuilderEdge({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`be${compact ? ' be-compact' : ''}`}>
      <style>{CSS}</style>
      {compact ? (
        <>
          <p className="sv-fig be-lede">{BUILDER_EDGE_LEDE}</p>
          <p className="sv-figsub">{BUILDER_EDGE_TITLE.replace(/\.$/, '')}: what you get beyond a file handoff.</p>
        </>
      ) : null}
      <div className="be-table" role="table" aria-label="Local drone or photo vendor compared with Bricks">
        <div className="be-row be-head" role="row">
          <span role="columnheader" className="be-topic" aria-label="Topic" />
          <span role="columnheader">Local drone/photo vendor</span>
          <span role="columnheader">Bricks</span>
        </div>
        {BUILDER_EDGE.map((r) => (
          <div className="be-row" role="row" key={r.topic}>
            <span role="rowheader" className="be-topic">{r.topic}</span>
            <span role="cell" className="be-vendor"><span className="be-tag">Local vendor</span>{r.vendor}</span>
            <span role="cell" className="be-bricks"><span className="be-tag">Bricks</span>{r.bricks}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const CSS = `
.be{margin:0}
.be-lede{max-width:22ch}
.be-table{margin-top:20px;border-top:1px solid var(--hair, rgba(20,17,14,.14))}
.be-row{display:grid;grid-template-columns:minmax(110px,.6fr) 1fr 1.25fr;gap:8px 24px;padding:14px 0;border-bottom:1px solid var(--hair, rgba(20,17,14,.14));font-size:15px;line-height:1.5}
.be-head{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--inkMute);padding:10px 0}
.be-topic{font-weight:500;color:var(--ink)}
.be-vendor{color:var(--inkMute)}
.be-bricks{color:var(--ink)}
.be-tag{display:none}
.be-compact .be-row{font-size:14px}
@media (max-width:720px){
  .be-head{display:none}
  .be-row{grid-template-columns:1fr;gap:4px;padding:14px 0}
  .be-tag{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--inkMute);margin:4px 0 1px}
  .be-bricks .be-tag{color:var(--ink)}
}
`

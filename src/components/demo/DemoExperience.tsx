import Link from 'next/link'
import { DEMO_APP_URL } from '@/lib/brand'
import { DEMO_PERSONAS, demoLink } from '@/lib/demo-personas'

/** Pick a persona and open the interactive demo build. Mock data only; nothing saves. */
export default function DemoExperience() {
  return (
    <section className="block block-flush">
      <div className="wrap">
        <ul className="demo-personas" data-testid="demo-personas">
          {DEMO_PERSONAS.map((p) => (
            <li key={p.key}>
              <a className="demo-persona" href={demoLink(DEMO_APP_URL, p.key)} data-persona={p.key}>
                <span className="demo-persona-label">{p.label}</span>
                <span className="demo-persona-who">{p.who}</span>
                <span className="demo-persona-line">{p.line}</span>
                <span className="demo-persona-go">Open demo →</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="sub" style={{ marginTop: 24 }}>
          Sample data throughout. Clicks work, nothing is saved and no one is contacted.
        </p>
        <div className="cta-row" style={{ marginTop: 24 }}>
          <Link className="btn btn-brick" href="/book">Book a shoot</Link>
          <Link className="btn btn-sec" href="/pricing">Pricing</Link>
        </div>
      </div>
      <style>{`
        .demo-personas{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1px;background:var(--hair);border:1px solid var(--hair);}
        .demo-personas li{background:var(--paper, #F4F1EA);}
        .demo-persona{display:flex;flex-direction:column;gap:6px;padding:20px;min-height:44px;height:100%;color:var(--ink);text-decoration:none;}
        .demo-persona:hover,.demo-persona:focus-visible{background:var(--hair);}
        .demo-persona-label{font-size:17px;font-weight:500;}
        .demo-persona-who{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--inkMute);}
        .demo-persona-line{font-size:14px;line-height:1.5;color:var(--inkSoft, var(--inkMute));flex:1;}
        .demo-persona-go{font-size:13px;text-decoration:underline;text-underline-offset:3px;margin-top:8px;}
      `}</style>
    </section>
  )
}

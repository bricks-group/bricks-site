import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div>
          <Link href="/" className="brand" style={{marginBottom:'14px'}}>
            <svg width="22" height="14" viewBox="0 0 27 16" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="12" height="6" rx="0.8" fill="#D2542B" opacity="0.82"/>
              <rect x="1" y="9" width="12" height="6" rx="0.8" fill="#D2542B"/>
              <rect x="15" y="9" width="11" height="6" rx="0.8" fill="#D2542B"/>
            </svg>
            bricks
          </Link>
          <p className="foot-blurb">The operating system for real estate. From booking to capture to delivery to close.</p>
        </div>
        <div>
          <h5>Product</h5>
          <ul>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/gallery">Work</Link></li>
            <li><Link href="/service-areas">Service areas</Link></li>
            <li><Link href="/photographers">Photographers</Link></li>
            <li><Link href="/book">Book a shoot</Link></li>
          </ul>
        </div>
        <div>
          <h5>Audiences</h5>
          <ul>
            <li><Link href="/about">For agents</Link></li>
            <li><Link href="/contact">For teams</Link></li>
            <li><Link href="/blog">For brokerages</Link></li>
            <li><Link href="/photographers">Photographer network</Link></li>
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><a href="https://share.google/7ttYfc6W7JRwlqA9U" target="_blank" rel="noopener noreferrer">Find us on Google</a></li>
          </ul>
        </div>
        <div>
          <h5>Legal</h5>
          <ul>
            <li><Link href="/terms">Terms &amp; Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="foot-word" aria-hidden="true">bricks</div>
      <div className="foot-meta">
        <span>© 2026 BRICKS · brxs.ca · TORONTO</span>
        <span>v1.0 · <Link href="/terms">TERMS</Link></span>
      </div>
      <style>{`
        .foot-word{max-width:980px;margin:72px auto -10px;
          font-weight:500;font-size:clamp(110px,17vw,250px);line-height:.78;letter-spacing:-.045em;
          color:transparent;-webkit-text-stroke:1px var(--hairStrong);user-select:none;pointer-events:none;
          transition:color 1s var(--ease,ease-out);text-align:center;}
        .foot-word.in{color:var(--inkFaint);-webkit-text-stroke:1px transparent;}
        footer{overflow:hidden;}
        .foot-inner{max-width:980px;margin:0 auto;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr 1fr;gap:48px;align-items:start;}
        footer h5{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;
          text-transform:uppercase;color:var(--inkFaint);margin:0 0 18px;font-weight:500;}
        footer ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;}
        footer a{color:var(--inkSoft);text-decoration:none;font-size:13px;}
        footer a:hover{color:var(--brickDeep);}
        .foot-meta{max-width:980px;margin:48px auto 0;padding-top:20px;border-top:1px solid var(--hair);
          font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;
          color:var(--inkFaint);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;}
        .foot-blurb{font-size:13px;color:var(--inkFaint);max-width:240px;line-height:1.55;margin:14px 0 0;}
      `}</style>
    </footer>
  )
}

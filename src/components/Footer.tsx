import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div>
          <Link href="/" className="brand" style={{marginBottom:'14px'}}>
            <svg className="brand-mark" viewBox="0 0 24 24" fill="none" aria-label="Bricks mark">
              <rect x="3" y="4" width="11" height="6.4" rx="0.8" fill="#D2542B" opacity="0.82" />
              <rect x="3" y="11.6" width="6" height="8.4" rx="0.8" fill="#D2542B" />
              <rect x="10.2" y="11.6" width="10.8" height="8.4" rx="0.8" fill="#D2542B" />
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
        <span>© 2026 Bricks · Toronto</span>
        <ThemeToggle />
      </div>
      <style>{`
        .foot-word{max-width:980px;margin:72px auto -10px;
          font-weight:500;font-size:clamp(110px,17vw,250px);line-height:.78;letter-spacing:-.045em;
          color:transparent;-webkit-text-stroke:1px var(--hair-s);user-select:none;pointer-events:none;
          transition:color 1s var(--ease,ease-out);text-align:center;}
        .foot-word.in{color:var(--ink-4);-webkit-text-stroke:1px transparent;}
        footer{overflow:hidden;}
        .foot-inner{max-width:980px;margin:0 auto;padding-top:16px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr 1fr;gap:48px;align-items:start;}
        footer h5{font-family:'General Sans',sans-serif;font-size:13px;font-weight:500;
          color:var(--ink-3);margin:0 0 16px;}
        footer ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;}
        footer a{color:var(--ink);text-decoration:none;font-size:14px;}
        footer a:hover{color:var(--brick-deep);}
        .foot-meta{max-width:980px;margin:48px auto 0;padding-top:20px;border-top:1px solid var(--hair);
          font-size:13px;color:var(--ink-3);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}
        .foot-blurb{font-size:13px;color:var(--ink-3);max-width:240px;line-height:1.55;margin:14px 0 0;}
      `}</style>
    </footer>
  )
}

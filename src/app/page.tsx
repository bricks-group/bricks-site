import type { Metadata } from 'next'
// Plain <img> used throughout (not next/image) for local reliability — mirrors bricks-site.
import Link from 'next/link'
import Script from 'next/script'
import NewsletterInline from './NewsletterInline'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, PHOTO_RATE, DRONE_RATE } from '@/lib/pricing'

const CORE_FROM = PHOTO_RATE[0] + DRONE_RATE[0] // HDR + drone starting point (~$248)
export const metadata: Metadata = {
  title: 'GTA Real Estate Photography & Media | Bricks',
  description: "GTA real estate listing media — HDR photography, licensed drone, floor plans, with optional 3D virtual tours. Book a shoot in 24–48h, serving agents at Canada's leading brokerages and REITs.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'GTA Real Estate Photography & Media | Bricks',
    description: "GTA real estate listing media — HDR photography, licensed drone, floor plans, with optional 3D virtual tours. Book a shoot in 24–48h, serving agents at Canada's leading brokerages and REITs.",
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'GTA Real Estate Photography & Media | Bricks',
    description: 'GTA real estate listing media — HDR photography, licensed drone, floor plans, and 3D virtual tours. Book a shoot in 24–48h.',
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
}

const logos = [
  { src: '/media/logos/royallepage.svg', alt: 'Royal LePage' },
  { src: '/media/logos/remax.png', alt: 'RE/MAX' },
  { src: '/media/logos/century21.png', alt: 'Century 21' },
  { src: '/media/logos/sothebys.png', alt: "Sotheby's International Realty" },
  { src: '/media/logos/sutton.svg', alt: 'Sutton' },
  { src: '/media/logos/cushman.svg', alt: 'Cushman & Wakefield' },
  { src: '/media/logos/smartcentres.svg', alt: 'SmartCentres' },
  { src: '/media/logos/boardwalk.png', alt: 'Boardwalk' },
  { src: '/media/logos/realstar.png', alt: 'Realstar' },
  { src: '/media/logos/homestead.svg', alt: 'Homestead' },
  { src: '/media/logos/engelvoelkers.png', alt: 'Engel & Völkers' },
]

const workPreview = [
  { src: '/media/work/01.jpg', alt: 'GTA residence' },
  { src: '/media/work/02.jpg', alt: 'Residential interior' },
  { src: '/media/work/03.jpg', alt: 'Residential interior' },
  { src: '/media/work/04.jpg', alt: 'Residential interior' },
  { src: '/media/work/05.jpg', alt: 'Residential interior' },
  { src: '/media/work/06.jpg', alt: 'Residential interior' },
]

const beforeAfter = [
  { before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png', label: 'Sky replacement before and after' },
  { before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png', label: 'HDR blending before and after' },
  { before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png', label: 'Twilight before and after' },
  { before: '/media/proof/Staging Before.png', after: '/media/proof/Staging After.png', label: 'Virtual staging before and after' },
]

const faqs = [
  { q: 'Is the platform live?', a: 'No — the media service is live in the GTA today; the Booking app, Dispatch network, and Brokerage operating system are in development. You can book media now via the form above or email.' },
  { q: 'How do I book a shoot?', a: 'Use the booking form (it emails us pre-filled) or write booking@brxs.ca. We confirm the slot and send the one-pager with exact pricing by footprint.' },
  { q: "What's included?", a: `HDR photo, licensed drone, and a floor plan every shoot. Cinematic reel and 3D virtual tour are optional add-ons (+${REEL_RANGE} and +${TOUR_RANGE}). Build your shoot à la carte on the pricing page.` },
  { q: 'Where do you shoot?', a: "The Greater Toronto Area. Outside GTA, ask — we'll tell you if it's covered." },
  { q: 'When do I get my media?', a: 'Edited and MLS-ready in 24-48 hours.' },
 ]

 const HERO_IMG = '/media/work/01.jpg' // Toronto brick townhomes — hero still; swap for new MLS-style photo when available

 export default function Home() {
  return (
    <>
      <RevealObserver />
      <Script src="/assets/ba.js" strategy="afterInteractive" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Bricks',
            description: 'Bricks is GTA listing media — From Capture to Close. Real estate listing media -- HDR photography, licensed drone, floor plans, twilight photography, and optional 3D virtual tours -- live now in the Greater Toronto Area, serving agents and sales reps at Canada\'s leading brokerages and REITs. The self-serve booking app is in development.',
            url: 'https://www.brxs.ca/',
            telephone: '+1-343-453-4578',
            email: 'booking@brxs.ca',
            priceRange: `$$ (à la carte from $${PHOTO_RATE[0]}; HDR + drone + floor plan from ~$${CORE_FROM})`,
            areaServed: ['Greater Toronto Area', 'Toronto', 'Mississauga', 'Brampton', 'Oakville', 'Milton', 'Halton Hills', 'Vaughan', 'Richmond Hill'].map((name) => ({ '@type': 'City', name })),
            knowsAbout: ['Real estate photography', 'Aerial photography', 'Floor plans', '3D virtual tours', 'Real estate media', 'Drone photography'],
            founder: { '@type': 'Person', name: 'Raphael Merchant', url: 'https://www.brxs.ca/about' },
            sameAs: ['https://share.google/7ttYfc6W7JRwlqA9U'],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />

      <section className="hero-split">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="badge-lit"><span className="dot" />Pre-launch · GTA rates</span>
            <h1>From Capture to Close.</h1>
            <p className="sub">Bricks is the GTA&apos;s shoot-and-deliver media service for listing agents — HDR, licensed drone, floor plans, with optional 3D tours, back in 24–48 hours. Book in minutes; we run the whole shoot end to end across the Greater Toronto Area.</p>
            <div className="cta-row">
              <Link className="btn btn-brick" href="/book">Book listing media</Link>
              <Link className="btn btn-sec" href="/pricing">View pricing</Link>
              <NewsletterInline />
            </div>
          </div>
          <div className="hero-visual">
            <div className="kb"><img className="kb-img" src={HERO_IMG} alt="GTA listing photographed by Bricks" /></div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="trust">
          <p className="trust-cap">Agents &amp; sales reps from Canada&apos;s leading brokerages &amp; REITs</p>
          <p className="proof-cap">14,000+ properties shot.</p>
          <div className="marquee" aria-label="Logos of leading Canadian brokerages and REITs where Bricks serves agents and sales reps">
            <div className="marquee-track">
              {[...logos, ...logos].map((l, i) => (
                <div key={l.alt + i} className="logo"><img src={l.src} alt={l.alt} width={100} height={32} /></div>
              ))}
              <div className="logo logo-txt">CBRE</div>
              <div className="logo logo-txt">CBRE</div>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">For teams &amp; brokerages</span><h2>One standard, whoever&apos;s booking it.</h2></div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--inkMute)', maxWidth: 620 }}>Every shoot follows the same standard — same HDR treatment, same drone coverage, same floor plan format — no matter which agent on your team is behind the request. One point of contact, one consistent look across every listing under your brand, direct booked at <Link href="/book" style={{ color: 'var(--brickDeep)' }}>the same price</Link> whether it&apos;s your first shoot or your fiftieth.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Selected work · GTA</span><h2>Real shoots, not stock.</h2></div>
            <Link href="/gallery" className="btn btn-sec" style={{ whiteSpace: 'nowrap' }}>See more work →</Link>
          </div>
          <div className="reel-wrap">
            <video className="reel-video" autoPlay muted loop playsInline preload="metadata" poster="/media/reel-poster.jpg">
              <source src="https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/Video/bid.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="grid3">
            {workPreview.map((w) => (
              <div key={w.src} className="card rvl"><div className="img"><img loading="lazy" src={w.src} alt={w.alt} width={480} height={360} /></div></div>
            ))}
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="edit">
          <div className="sec-head">
            <div><span className="over">The edit</span><h2>The difference is in the delivery.</h2></div>
            <p>Drag across each pair. Sky replacement, HDR blending, twilight, and virtual staging — the Bricks edit, every shoot.</p>
          </div>
          <div className="ba-grid">
            {beforeAfter.map((p) => (
              <div key={p.label} className="ba" data-pos="50" tabIndex={0} role="slider" aria-label={p.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={50}>
                <img className="ba-after" src={p.after} alt={`${p.label.split(' before')[0]} — after`} />
                <img className="ba-before" src={p.before} alt={`${p.label.split(' before')[0]} — before`} />
                <span className="ba-tag ba-tag-before">Before</span>
                <span className="ba-tag ba-tag-after">After</span>
                <div className="ba-handle" aria-hidden="true"><span className="ba-knob">&#8596;</span></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">What&apos;s in the shoot</span><h2>Every shoot ships the core set.</h2></div>
          </div>
          <div className="incl">
            <div className="c rvl"><span className="ic">01</span><h4>HDR photography</h4><p>Architectural interiors &amp; exteriors, bracketed and edited for MLS.</p></div>
            <div className="c rvl"><span className="ic">02</span><h4>Licensed drone</h4><p>Advanced RPAS-certified aerial of the lot, surroundings, and roofline.</p></div>
            <div className="c rvl"><span className="ic">03</span><h4>Floor plan</h4><p>Branded 2D layout with room dimensions — included on every shoot.</p></div>
            <div className="c rvl"><span className="ic">04</span><h4>24–48h delivery</h4><p>Edited media in one hosted portal, branded and MLS-ready.</p></div>
          </div>
          <div className="sec-head" style={{ marginTop: 38 }}>
            <div><span className="over">Add-ons</span><h2>Scale a shoot up.</h2></div>
          </div>
          <div className="adds">
            <div className="a rvl"><div className="nm">Cinematic reel</div><div className="pr">+{REEL_RANGE}</div><p>30–45s motion reel for social and listing pages.</p></div>
            <div className="a rvl"><div className="nm">3D virtual tour</div><div className="pr">+{TOUR_RANGE}</div><p>Interactive walkthrough, MLS-ready. Scanned from a phone.</p></div>
            <div className="a rvl"><div className="nm">Twilight exterior</div><div className="pr">+{TWILIGHT_RANGE}</div><p>Golden-hour exterior frame that sells the lifestyle.</p></div>
          </div>
          <p className="note">Full tiers and à la carte pricing by footprint are on the <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>pricing page</Link>.</p>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">Questions</span><h2>Before you book.</h2></div>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <div key={f.q} className="qa rvl"><h4>{f.q}</h4><p>{f.a}</p></div>
            ))}
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="book">
          <div className="book">
            <div>
              <span className="over">Book a shoot</span>
              <h2 style={{ color: 'var(--moon)', marginTop: 8 }}>Listings don&apos;t wait. Neither should booking.</h2>
              <p style={{ color: 'var(--moonSoft)', fontSize: 14, marginTop: 10, maxWidth: 480 }}>Four steps — pick your shoot, package, and date. We confirm the slot and send pricing by footprint. The self-serve Booking app replaces this in development.</p>
              <Link className="btn btn-brick" href="/book" style={{ marginTop: 18, display: 'inline-flex' }}>Start booking →</Link>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl">
          <div className="sec-head">
            <div><span className="over">The platform is coming</span><h2>Media is live. The operating system is next.</h2></div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--inkMute)', maxWidth: 660 }}>Today Bricks runs the shoot end to end in the GTA — booking, capture, and delivery handled direct. We&apos;re building the software around it: a self-serve Booking app, a Dispatch network for photographers, and a Brokerage operating system for allocations, reporting, and one invoice. <a href="mailto:booking@brxs.ca" style={{ color: 'var(--brickDeep)' }}>Get launch updates &rarr;</a></p>
        </section>
      </div>

      <NewsletterPopup />

      <style>{`
        .reel-wrap{margin-top:26px;border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paperDeep);}
        .reel-video{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;outline:none;}
        .trust{text-align:center;padding:8px 0 4px;}
        .trust-cap{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--inkMute);margin:0 0 18px;}
        .proof-cap{font-family:'General Sans',system-ui,sans-serif;font-size:30px;font-weight:500;letter-spacing:-0.7px;line-height:1.05;color:var(--ink);max-width:680px;margin:0 auto 22px;text-align:center;}
        /* ===== V2 hero-forward motion (2026-08-07) ===== */
        .hero-split{padding:0;border-bottom:1px solid var(--hair);overflow:hidden;}
        .hero-grid{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1.05fr 1fr;align-items:stretch;min-height:540px;}
        .hero-copy{padding:76px 44px 60px 36px;display:flex;flex-direction:column;justify-content:center;}
        .hero-copy .badge-lit{display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--brickDeep);background:var(--brickTint);border-radius:2px;padding:6px 10px;width:fit-content;margin-bottom:20px;}
        .hero-copy .badge-lit .dot{width:6px;height:6px;border-radius:50%;background:var(--brick);animation:pulse 2s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(210,84,43,.5)}50%{opacity:.6;box-shadow:0 0 0 5px rgba(210,84,43,0)}}
        .hero-copy h1{font-weight:500;font-size:46px;line-height:1.0;letter-spacing:-1.6px;color:var(--ink);}
        .hero-copy p.sub{font-size:17px;color:var(--inkSoft);margin-top:18px;max-width:520px;}
        .hero-visual{position:relative;overflow:hidden;background:var(--paperDeep);}
        .hero-visual .kb{position:absolute;inset:-4%;width:108%;height:108%;animation:kenburns 18s ease-in-out infinite alternate;will-change:transform;}
        @keyframes kenburns{from{transform:scale(1.0) translate(0,0);}to{transform:scale(1.09) translate(-1.2%,-1.5%);}}
        .kb-img{object-fit:cover;}
        .hero-visual::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,17,14,0) 55%,rgba(20,17,14,.34) 100%),linear-gradient(90deg,rgba(20,17,14,.12),transparent 32%);pointer-events:none;}
        .hero-copy .badge-lit,.hero-copy h1,.hero-copy p.sub,.hero-copy .cta-row{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,.8,.3,1) forwards;}
        .hero-copy h1{animation-delay:.06s;} .hero-copy p.sub{animation-delay:.17s;} .hero-copy .cta-row{animation-delay:.28s;}
        @keyframes heroIn{to{opacity:1;transform:translateY(0);}}
        .hero-visual{opacity:0;animation:heroFade 1s ease .1s forwards;}
        @keyframes heroFade{to{opacity:1;}}
        @media (max-width:900px){
          .hero-grid{grid-template-columns:1fr;min-height:0;}
          .hero-visual{aspect-ratio:16/9;order:-1;}
          .hero-copy{padding:40px 20px;}
          .hero-copy h1{font-size:34px;}
        }
        .marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);}
        .marquee-track{display:flex;align-items:center;gap:64px;width:max-content;animation:scrollx 22s linear infinite;padding:6px 0;}
        .marquee:hover .marquee-track{animation-play-state:paused;}
        .logo{display:flex;align-items:center;justify-content:center;height:32px;flex:none;overflow:hidden;}
        .logo img{height:32px;max-height:32px;max-width:130px;width:auto;object-fit:contain;display:block;opacity:.78;filter:grayscale(1);transition:opacity .2s ease,filter .2s ease;}
        .logo:hover img{opacity:1;filter:grayscale(0);}
        .logo-txt{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:18px;letter-spacing:.06em;color:var(--inkMute);opacity:.78;}
        @keyframes scrollx{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        @media (prefers-reduced-motion:reduce){.marquee-track{animation:none;}}
        .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:26px;}
        .grid3 .card{border:1px solid var(--hair);border-radius:2px;overflow:hidden;background:var(--paper);transition:border-color .2s ease;}
        .grid3 .card:hover{border-color:var(--brick);}
        .grid3 .card .img{aspect-ratio:4/3;background:var(--paperDeep);overflow:hidden;}
        .grid3 .card .img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;}
        .grid3 .card:hover .img img{transform:scale(1.04);}
        .incl{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .incl .c{background:var(--paper);padding:22px 22px;}
        .incl .c h4{font-weight:500;font-size:15px;color:var(--ink);margin-bottom:6px;}
        .incl .c p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        .incl .c .ic{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--brickDeep);display:block;margin-bottom:8px;}
        .adds{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .adds .a{background:var(--paper);padding:20px 22px;}
        .adds .a .nm{font-weight:500;font-size:15px;color:var(--ink);}
        .adds .a .pr{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--brickDeep);margin:5px 0 6px;}
        .adds .a p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        @media (max-width:680px){ .incl,.adds{grid-template-columns:1fr;} }
        .ba-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:26px;}
        @media(max-width:720px){.ba-grid{grid-template-columns:1fr;}}
        .ba{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--paperDeep);
          border:1px solid var(--hair);border-radius:2px;cursor:ew-resize;user-select:none;-webkit-user-select:none;touch-action:pan-y;}
        .ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;-webkit-user-drag:none;}
        .ba-before{clip-path:inset(0 50% 0 0);}
        .ba-handle{position:absolute;top:0;bottom:0;left:50%;width:2px;background:var(--paper);
          transform:translateX(-1px);box-shadow:0 0 0 1px rgba(20,17,14,0.18);pointer-events:none;}
        .ba-knob{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:34px;height:34px;border-radius:50%;background:var(--paper);
          display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--brickDeep);
          box-shadow:0 1px 5px rgba(20,17,14,0.32);font-family:'JetBrains Mono',monospace;}
        .ba-tag{position:absolute;bottom:10px;font-family:'JetBrains Mono',monospace;font-size:10px;
          letter-spacing:.12em;text-transform:uppercase;padding:4px 8px;border-radius:2px;pointer-events:none;z-index:2;}
        .ba-tag-before{left:10px;background:rgba(20,17,14,0.6);color:var(--paper);}
        .ba-tag-after{right:10px;background:var(--brick);color:#fff;}
        .newsletter{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;}
        .newsletter input{font-family:'General Sans',sans-serif;font-size:14px;background:var(--paper);
          color:var(--ink);border:1px solid var(--hairStrong);border-radius:2px;padding:12px 14px;outline:none;min-width:200px;}
        .newsletter input:focus{border-color:var(--brick);}
        .nl-msg{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--brickDeep);}
        .nl-pop{position:fixed;right:20px;bottom:20px;width:330px;max-width:calc(100vw - 40px);
          background:var(--paper);border:1px solid var(--hairStrong);border-radius:2px;
          box-shadow:0 0 0 1px var(--hair);padding:22px 22px 20px;z-index:60;
          transform:translateY(140%);opacity:0;transition:transform .45s ease,opacity .45s ease;
          font-family:'General Sans',sans-serif;}
        .nl-pop.show{transform:translateY(0);opacity:1;}
        .nl-pop .x{position:absolute;top:10px;right:12px;background:none;border:none;cursor:pointer;
          font-family:'JetBrains Mono',monospace;font-size:16px;color:var(--inkMute);line-height:1;}
        .nl-pop .x:hover{color:var(--brickDeep);}
        .nl-pop h4{font-weight:500;font-size:18px;letter-spacing:-0.4px;color:var(--ink);margin:0 0 6px;}
        .nl-pop p{font-size:13px;color:var(--inkSoft);line-height:1.5;margin:0 0 14px;}
        .nl-pop form{display:flex;flex-direction:column;gap:10px;}
        .nl-pop input{font-family:'General Sans',sans-serif;font-size:14px;background:var(--paper);
          color:var(--ink);border:1px solid var(--hairStrong);border-radius:2px;padding:12px 14px;outline:none;}
        .nl-pop input:focus{border-color:var(--brick);}
        .nl-pop .consent{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--inkFaint);
          line-height:1.5;margin:2px 0 0;}
        .nl-pop .btn-brick{justify-content:center;}
        .nl-pop .nlmsg{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--brickDeep);min-height:14px;}
        .nl-pill{position:fixed;right:20px;bottom:20px;z-index:55;display:flex;align-items:center;gap:7px;
          background:var(--ink);color:var(--paper);border:none;border-radius:2px;cursor:pointer;
          font-family:'General Sans',sans-serif;font-weight:500;font-size:13px;padding:11px 16px;
          box-shadow:0 0 0 1px var(--hair);}
        .nl-pill:hover{background:var(--brick);}
        .nl-pill::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--brick);}
        .nl-pill:hover::before{background:var(--paper);}
        @media (prefers-reduced-motion: reduce){.nl-pop{transition:none;}}
      `}</style>
    </>
  )
}

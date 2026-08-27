import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import NewsletterPopup from './NewsletterPopup'
import RevealObserver from '@/components/RevealObserver'
import { REEL_RANGE, TOUR_RANGE, TWILIGHT_RANGE, PHOTO_RATE, DRONE_RATE } from '@/lib/pricing'
import {
  AREA_SERVED_SCHEMA,
  BROKERAGE_LOGOS,
  COVERAGE_LINE,
  KNOWS_ABOUT,
  TOUR_BLURB,
  TOUR_NAME,
  VISIT_BLURB,
  VISIT_NAME,
  VISIT_PACKAGING,
  VISIT_PRICE_LABEL,
  WORK_PHOTOS,
} from '@/lib/brand'

const CORE_FROM = PHOTO_RATE[0] + DRONE_RATE[0] // HDR + drone starting point (~$248)
const HERO_IMG = WORK_PHOTOS[0]

export const metadata: Metadata = {
  title: 'Canadian Real Estate Photography & Media | Bricks',
  description: "Listing media for Canadian real estate — HDR photography, licensed drone, floor plans, with optional virtual tour and virtual visit. Book a shoot in 24–48h.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Canadian Real Estate Photography & Media | Bricks',
    description: "Listing media for Canadian real estate — HDR photography, licensed drone, floor plans, with optional virtual tour and virtual visit. Book a shoot in 24–48h.",
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
  twitter: {
    title: 'Canadian Real Estate Photography & Media | Bricks',
    description: 'Listing media for Canadian real estate — HDR photography, licensed drone, floor plans, with optional virtual tour and virtual visit. Book a shoot in 24–48h.',
    images: ['https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
  },
}

const beforeAfter = [
  { before: '/media/proof/Sky Before.png', after: '/media/proof/Sky After.png', label: 'Sky replacement before and after' },
  { before: '/media/proof/HDR Before.png', after: '/media/proof/HDR After.png', label: 'HDR blending before and after' },
  { before: '/media/proof/Twilight before.png', after: '/media/proof/twilight After.png', label: 'Twilight before and after' },
  { before: '/media/proof/Staging Before.png', after: '/media/proof/Staging After.png', label: 'Virtual staging before and after' },
]

const faqs = [
  { q: 'Is the platform live?', a: 'The media service is live in Canada today. The Booking app, Dispatch network, and Brokerage operating system are in development. Book now via the form or email booking@brxs.ca.' },
  { q: 'How do I book a shoot?', a: 'Use the booking form or write booking@brxs.ca / 343-453-4578. We confirm the slot and send pricing by footprint.' },
  { q: "What's included?", a: `HDR photo, licensed drone, and a floor plan on every standard shoot. Photos only drops drone and the floor plan. Cinematic reel (+${REEL_RANGE}) and ${TOUR_NAME.toLowerCase()} (+${TOUR_RANGE}) are optional add-ons. ${VISIT_NAME} is always a paid add-on, quoted separately — never packaged.` },
  { q: `Is the ${TOUR_NAME.toLowerCase()} included?`, a: `À la carte, no — it's a ${TOUR_RANGE} add-on, priced by footprint. Showcase and Full suite include it. ${VISIT_NAME} is never included in any package.` },
  { q: `Is the ${VISIT_NAME.toLowerCase()} included?`, a: `Never. ${VISIT_NAME} is always a paid add-on (${VISIT_PRICE_LABEL.toLowerCase()} separately) and is not part of Showcase, Full suite, or any other package.` },
  { q: 'Where do you shoot?', a: `Canada — ${COVERAGE_LINE} Outside that, ask and we'll tell you if it's covered.` },
  { q: 'When do I get my media?', a: 'Edited and MLS-ready in 24-48 hours.' },
]

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
            legalName: 'Bricks Group',
            description: 'Bricks is listing media for Canadian real estate — From Capture to Close. HDR photography, licensed drone, floor plans, twilight, optional virtual tour (path-confined) and virtual visit (free-roam Gaussian splat). Media service live now in Canada. The self-serve booking app is in development.',
            url: 'https://www.brxs.ca/',
            telephone: '+1-343-453-4578',
            email: 'booking@brxs.ca',
            priceRange: `$$ (à la carte from $${PHOTO_RATE[0]}; HDR + drone + floor plan from ~$${CORE_FROM})`,
            areaServed: AREA_SERVED_SCHEMA,
            knowsAbout: KNOWS_ABOUT,
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

      <section className="hero-photo">
        <Image
          className="hero-photo-img"
          src={HERO_IMG.src}
          alt="Listing exterior photographed by Bricks"
          fill
          sizes="100vw"
          priority
        />
        <div className="hero-photo-veil" />
        <div className="hero-photo-copy">
          <span className="badge-lit"><span className="dot" />Live in Canada</span>
          <h1>Listing media for Canadian real estate.</h1>
          <p className="sub">HDR, licensed drone, and a floor plan on every standard shoot. Book in minutes — MLS-ready in 24–48 hours.</p>
          <div className="cta-row">
            <Link className="btn btn-brick" href="/book">Book a shoot</Link>
            <Link className="btn btn-sec hero-sec" href="/pricing">View pricing</Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="trust">
          <p className="trust-cap">Agents &amp; sales reps from Canada&apos;s leading brokerages &amp; REITs</p>
          <p className="proof-cap">14,000+ properties, shot by founder Raphael Merchant.</p>
          <p className="proof-sub">Career body of work as Regional Visual Director / Architectural Photographer at CoStar — not a Bricks job count.</p>
          <div className="marquee" aria-label="Logos of leading Canadian brokerages and REITs where Bricks serves agents and sales reps">
            <div className="marquee-track">
              {[...BROKERAGE_LOGOS, ...BROKERAGE_LOGOS].map((l, i) => (
                <div key={l.alt + i} className="logo"><Image src={l.src} alt={l.alt} width={100} height={32} /></div>
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
            <div><span className="over">Selected work</span><h2>Real shoots, not stock.</h2></div>
            <Link href="/gallery" className="btn btn-sec" style={{ whiteSpace: 'nowrap' }}>See more work →</Link>
          </div>
          <div className="grid3">
            {WORK_PHOTOS.map((w) => (
              <div key={w.src} className="card rvl"><div className="img"><Image loading="lazy" src={w.src} alt={w.alt} width={480} height={360} /></div></div>
            ))}
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="block rvl" id="edit">
          <div className="sec-head">
            <div><span className="over">The edit</span><h2>The difference is in the delivery.</h2></div>
            <p>Drag across each pair. Sky replacement, HDR blending, twilight, and virtual staging.</p>
          </div>
          <div className="ba-grid">
            {beforeAfter.map((p) => (
              <div key={p.label} className="ba" data-pos="50" tabIndex={0} role="slider" aria-label={p.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={50}>
                <Image className="ba-after" src={p.after} alt={`${p.label.split(' before')[0]} — after`} fill sizes="(max-width: 720px) 100vw, 50vw" />
                <Image className="ba-before" src={p.before} alt={`${p.label.split(' before')[0]} — before`} fill sizes="(max-width: 720px) 100vw, 50vw" />
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
            <div><span className="over">What&apos;s in the shoot</span><h2>Every standard shoot ships the core set.</h2></div>
          </div>
          <div className="incl">
            <div className="c rvl"><span className="ic">01</span><h4>HDR photography</h4><p>Architectural interiors &amp; exteriors, bracketed and edited for MLS.</p></div>
            <div className="c rvl"><span className="ic">02</span><h4>Licensed drone</h4><p>Advanced RPAS-certified aerial of the lot, surroundings, and roofline.</p></div>
            <div className="c rvl"><span className="ic">03</span><h4>Floor plan</h4><p>Branded 2D layout with room dimensions — included on every standard shoot.</p></div>
            <div className="c rvl"><span className="ic">04</span><h4>24–48h delivery</h4><p>Edited media in one hosted portal, branded and MLS-ready.</p></div>
          </div>
          <div className="sec-head" style={{ marginTop: 38 }}>
            <div><span className="over">Add-ons</span><h2>Scale a shoot up.</h2></div>
          </div>
          <div className="adds">
            <div className="a rvl"><div className="nm">Cinematic reel</div><div className="pr">+{REEL_RANGE}</div><p>30–45s motion reel for social and listing pages.</p></div>
            <div className="a rvl"><div className="nm">{TOUR_NAME}</div><div className="pr">+{TOUR_RANGE}</div><p>{TOUR_BLURB} À la carte add-on; included in Showcase and Full suite.</p></div>
            <div className="a rvl"><div className="nm">{VISIT_NAME}</div><div className="pr">{VISIT_PRICE_LABEL}</div><p>{VISIT_BLURB} {VISIT_PACKAGING}</p></div>
            <div className="a rvl"><div className="nm">Twilight exterior</div><div className="pr">+{TWILIGHT_RANGE}</div><p>Golden-hour exterior frame that sells the lifestyle.</p></div>
          </div>
          <p className="note">Photos only drops drone and the floor plan. Full tiers and à la carte pricing by footprint are on the <Link href="/pricing" style={{ color: 'var(--brickDeep)' }}>pricing page</Link>.</p>
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
              <p style={{ color: 'var(--moonSoft)', fontSize: 14, marginTop: 10, maxWidth: 480 }}>Four steps — pick your shoot, package, and date. We confirm the slot and send pricing by footprint.</p>
              <Link className="btn btn-brick" href="/book" style={{ marginTop: 18, display: 'inline-flex' }}>Start booking →</Link>
            </div>
          </div>
        </section>
      </div>

      <NewsletterPopup />

      <style>{`
        .proof-sub{font-size:13.5px;color:var(--inkMute);max-width:560px;margin:0 auto 22px;text-align:center;line-height:1.45;}
        .hero-photo{position:relative;min-height:min(78vh,720px);display:flex;align-items:flex-end;overflow:hidden;background:var(--night);}
        .hero-photo-img{object-fit:cover;object-position:center 40%;}
        .hero-photo-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,17,14,.18) 0%,rgba(20,17,14,.28) 42%,rgba(20,17,14,.78) 100%);z-index:1;pointer-events:none;}
        .hero-photo-copy{position:relative;z-index:2;max-width:980px;width:100%;margin:0 auto;padding:72px 36px 56px;color:var(--moon);}
        .hero-photo-copy .badge-lit{display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#fff;background:rgba(210,84,43,.92);border-radius:2px;padding:6px 10px;width:fit-content;margin-bottom:18px;}
        .hero-photo-copy .badge-lit .dot{width:6px;height:6px;border-radius:50%;background:#fff;animation:pulse 2s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(255,255,255,.45)}50%{opacity:.6;box-shadow:0 0 0 5px rgba(255,255,255,0)}}
        .hero-photo-copy h1{font-weight:500;font-size:48px;line-height:1.02;letter-spacing:-1.6px;color:var(--moon);max-width:720px;}
        .hero-photo-copy p.sub{font-size:17px;color:var(--moonSoft);margin-top:16px;max-width:520px;}
        .hero-photo-copy .cta-row{margin-top:24px;}
        .hero-sec{color:var(--moon);border-color:var(--moonMute);}
        .hero-sec:hover{border-color:var(--moon);}
        .hero-photo-copy .badge-lit,.hero-photo-copy h1,.hero-photo-copy p.sub,.hero-photo-copy .cta-row{opacity:0;transform:translateY(14px);animation:heroIn .7s cubic-bezier(.16,.8,.3,1) forwards;}
        .hero-photo-copy h1{animation-delay:.06s;} .hero-photo-copy p.sub{animation-delay:.17s;} .hero-photo-copy .cta-row{animation-delay:.28s;}
        @keyframes heroIn{to{opacity:1;transform:translateY(0);}}
        @media (max-width:900px){
          .hero-photo{min-height:min(70vh,620px);}
          .hero-photo-copy{padding:48px 20px 40px;}
          .hero-photo-copy h1{font-size:34px;}
        }
        .marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);}
        .marquee-track{display:flex;align-items:center;gap:64px;width:max-content;animation:scrollx 22s linear infinite;padding:6px 0;}
        .marquee:hover .marquee-track{animation-play-state:paused;}
        .logo{display:flex;align-items:center;justify-content:center;height:32px;flex:none;overflow:hidden;}
        .logo img{height:32px;max-height:32px;max-width:130px;width:auto;object-fit:contain;display:block;opacity:.78;filter:grayscale(1);transition:opacity .2s ease,filter .2s ease;}
        .logo:hover img{opacity:1;filter:grayscale(0);}
        .logo-txt{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:18px;letter-spacing:.06em;color:var(--inkMute);opacity:.78;}
        @keyframes scrollx{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        @media (prefers-reduced-motion:reduce){.marquee-track{animation:none;}.hero-photo-copy .badge-lit,.hero-photo-copy h1,.hero-photo-copy p.sub,.hero-photo-copy .cta-row{opacity:1;transform:none;animation:none;}}
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
        .adds{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:2px;margin-top:4px;}
        .adds .a{background:var(--paper);padding:20px 22px;}
        .adds .a .nm{font-weight:500;font-size:15px;color:var(--ink);}
        .adds .a .pr{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--brickDeep);margin:5px 0 6px;}
        .adds .a p{font-size:12.5px;color:var(--inkMute);line-height:1.45;}
        @media (max-width:680px){ .incl,.adds,.grid3{grid-template-columns:1fr;} }
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

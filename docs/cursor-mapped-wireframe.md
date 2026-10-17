# Bricks homepage — Cursor-mapped wireframe (v10)

Borrowed: structure and rhythm only (product-as-hero, quiet strip, alternating product rows, one centred proof line, small flat type, one big final CTA).
Not borrowed: Cursor's branding, copy, paintings or assets. Visual language is the Bricks token set (docs/visual-system.md): off-white/ink/graphite, one accent for state only, square corners, hairlines, mono only for figures/dates.

Type scale used: 14 caption · 16 body · 22 row titles · clamp(30–40) H1 · clamp(44–76) final CTA. Weight 500 for titles, 400 body. No eyebrows.
Rhythm: section gap 112px desktop / 72px mobile; panels on --vs-surface; 8px gutters between cards; container 1200px.

```
┌──────────────────────────────────────────────────────────────────────┐
│ NAV (unchanged)                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ 1 HERO   left-aligned, small                                         │
│   H1  The system that brings it all together.                        │
│   sub Software, media, 3D and site progress for Canadian real        │
│       estate, working as one.                                        │
│   [Book a shoot]  [Try Bricks free]                                  │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ original painted tray                                      │ │
│ │   ┌─────────────── Bricks desk (live ProductStage) ───────────┐  │ │
│ │   │  Overview / Deal windows, click-to-front                  │  │ │
│ └──────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│ 2 WORKS-WITH STRIP  (#integrations)                                  │
│   caption: Works with your MLS® feed, calendar and payments.         │
│   [PropTx][Bridge][Repliers][Stripe][Follow Up Boss][kvCORE]…  plates│
├──────────────────────────────────────────────────────────────────────┤
│ 3 PRODUCT ROWS  (panel ≈ 1/3 copy, 2/3 frame, sides alternate)       │
│ ┌────────────┬─────────────────────────────────────┐                 │
│ │ The desk   │  painted tray + CRM desk frame        │  → /platform    │
│ │ runs the   │                                     │                 │
│ │ deal.      │                                     │                 │
│ └────────────┴─────────────────────────────────────┘                 │
│ ┌─────────────────────────────────────┬────────────┐                 │
│ │ painted tray + phone: booking app     │ Media,     │  → /media       │
│ │                                     │ inside     │                 │
│ └─────────────────────────────────────┴────────────┘                 │
│ ┌────────────┬─────────────────────────────────────┐                 │
│ │ Site       │  tower-cranes drone photo (real)    │  → /builders    │
│ │ Progress   │                                     │                 │
│ └────────────┴─────────────────────────────────────┘                 │
│ ┌─────────────────────────────────────┬────────────┐                 │
│ │ painted tray + phone: photographer app│ Photo-     │  → /photographers│
│ │                                     │ graphers   │                 │
│ └─────────────────────────────────────┴────────────┘                 │
├──────────────────────────────────────────────────────────────────────┤
│ 4 EVERY PART, ONE SYSTEM  (existing 6-tile ServicesGrid, kept)       │
│   Bricks · Media · Virtual Visit · Site Progress · Photographers ·   │
│   Integrations   — 3-up / 2-up, photos + linework                    │
├──────────────────────────────────────────────────────────────────────┤
│ 5 PROOF  one centred quote (Jordan Malcolm), name + role             │
├──────────────────────────────────────────────────────────────────────┤
│ 6 PRICING TEASER  (Cursor has none; Bricks keeps a compact one       │
│   because media is bookable today) 4 packages, one row, mono figures │
├──────────────────────────────────────────────────────────────────────┤
│ 7 GUIDES  (= Cursor "Recent highlights") 4 cards: date (mono) ·      │
│   title · read time  → /blog                                         │
├──────────────────────────────────────────────────────────────────────┤
│ 8 FAQ  4 questions (kept for FAQPage schema / SEO)                   │
├──────────────────────────────────────────────────────────────────────┤
│ 9 FINAL CTA   huge centred  "Ready when you are."  [Book a shoot]    │
│               Try Bricks free →   Book a site visit →                │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER (unchanged)                                                   │
└──────────────────────────────────────────────────────────────────────┘
```

Mobile (390): everything is one column. Row copy sits above its frame in every row (no flip on mobile). The strip becomes a 3-up plate grid. Product frames keep a 4:3 tray and phone frames a 4:5 tray.

Removed from the home page (components kept, can be restored): the hero pillar links (Cursor-style hero has two buttons only), the "Request a walkthrough" third CTA (still in the nav and footer), the "Who it's for" audience row (paths remain in the nav and footer), the pinned StepsRail booking rail (replaced by the Media product row), the separate Site Progress band (now product row 3), and the marquee IntegrationsBand (now the strip in section 2).
Motion: the shared MotionLayer rise on enter, once; no pinning; product frames stay live.

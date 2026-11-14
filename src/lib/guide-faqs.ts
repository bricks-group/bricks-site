// W2 guide FAQs (Markez, seo-content-w2/pages, 2026-11-14). Each array feeds both the visible
// .faq block and faqPageSchema, so the JSON-LD always matches the page. Prices are checked
// against the catalog in faq-prices.test.ts.

export const BROKERAGE_SOFTWARE_ONTARIO_FAQS = [
  { q: 'Does brokerage software replace the broker of record’s trust duties?', a: 'No. It keeps the trust ledger, commissions and statements on one record so they are easier to keep current. The broker of record stays responsible, and RECO’s guidance sets the rules.' },
  { q: 'What is the difference between team software and brokerage software?', a: 'Team software covers a group of agents sharing a pipeline. Brokerage software adds the office: roster, seats, commission plans, agent statements and the trust account. In Bricks, trust accounting is on brokerage accounts only.' },
  { q: 'Do agents pay for their own Bricks seat?', a: 'Not on a brokerage account. The brokerage buys seats and every seat gets all of Bricks.' },
  { q: 'Does Bricks work with TRREB listing data?', a: 'Yes. Bricks pulls listings from PropTx (TRREB) through the RESO Web API on your own credentials. It never posts or submits to your MLS®.' },
  { q: 'Is there a minimum number of seats?', a: 'Brokerage seats start at five, on the Boutique tier. Smaller groups use a team plan, which covers up to six agents.' },
  { q: 'Can a brokerage pay month to month?', a: 'Yes. Seats are $74, $56, $44 or $31 a month by tier, with no lock-in, or $708, $540, $420 or $300 a seat per year. CAD, before tax.' },
] as const

export const DRONE_PROGRESS_REPORTS_ONTARIO_BUILDERS_FAQS = [
  { q: 'How often should a construction site be flown for progress reports?', a: 'Monthly suits most draw schedules. Every two weeks or weekly suits fast phases or tight schedules. Keep the same flight plan each time so visits compare cleanly.' },
  { q: 'Who can fly a drone on a construction site in Ontario?', a: 'A pilot with a Transport Canada Advanced certificate, with NAV CANADA authorization in controlled airspace. Bricks pilots also carry at least $2M drone liability insurance, verified for the flight date.' },
  { q: 'What is the difference between a progress visit and a mapped capture?', a: 'A progress visit is dated drone photos and video. A mapped capture adds an orthomosaic, a 3D model and a measurable map for distances, areas and elevation.' },
  { q: 'Can I use drone captures from another pilot?', a: 'Yes. Import GeoTIFF, LAS, LAZ, E57, PLY, OBJ, GLB, photos, video or PDF, up to 5 GB a file. Each import becomes a dated visit, marked as imported.' },
  { q: 'Can a drone progress report replace a quantity survey?', a: 'No. Volumes and areas are estimates for tracking progress. A progress report documents site conditions and doesn’t certify cost, quantity or completion.' },
] as const

// Counsel-cleared wording (2026-11-14) for the first question.
export const MOVE_OUT_CONDITION_REPORT_ONTARIO_FAQS = [
  { q: 'Why do a move-in condition report?', a: 'It gives you a dated record to compare against at move-out. If a damage claim goes to the Landlord and Tenant Board, photos of the unit before and after can help show what changed.' },
  { q: 'When should the move-out report be done?', a: 'After the tenant has left and before cleaning or repairs, so it shows the unit as it was returned.' },
  { q: 'What does a condition report cost with Bricks?', a: '$145 for a dated move-in or move-out condition report, CAD plus tax, booked online by address.' },
  { q: 'Can I compare move-in and move-out photos?', a: 'Yes. In a Bricks property manager account, each condition report is compared room by room with the last one for that unit.' },
  { q: 'Can owners get a report?', a: 'Yes. A property manager account prints an owner report for any period.' },
] as const

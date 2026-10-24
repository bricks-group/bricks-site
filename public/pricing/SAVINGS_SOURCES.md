# Savings comparison: sources

Used by the "One system, not a stack of subscriptions" section on https://www.brxs.ca/pricing.
Data lives in `src/lib/savings.ts`; `src/lib/savings.test.ts` checks that every price below matches it.

## Method

- Public list prices only, read from each vendor's own pricing page on 2026-10-24. If a vendor does not show a price publicly, the tool is left out.
- Month-to-month list price for one user, before tax, compared against Bricks month-to-month plan prices.
- For each job a Bricks plan includes, we count the **market-leading tool agents actually use** for it (decision 2026-10-24). Each job is counted once: if one tool covers several jobs, it is counted once, and no job is counted twice.
- No add-ons are counted, on either side.
- Only jobs the Bricks plan actually includes are counted (see the feature matrix in `src/lib/plan-matrix.ts`, which mirrors the app's plan gates).
- USD prices are converted to CAD at the Bank of Canada daily rate of **1.3993 CAD per USD (2026-10-23)**, then rounded to the dollar per tool.
  Source: https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=5
- On the page: "Prices from public list pricing as of Oct 2026; may vary."
- A cheapest-tool comparison is kept in the appendix at the end, for reference only. It is not shown on the page.

## Tools counted (market leaders)

| Job | Tool and plan | List price (USD, monthly) | CAD at 1.3993 | Source | Checked |
| --- | --- | --- | --- | --- | --- |
| CRM | Follow Up Boss Grow (per user; $58 billed yearly) | $69 / user / mo | $97 | https://www.followupboss.com/pricing | 2026-10-24 |
| Transactions, e-sign and document templates | dotloop Premium ($28.67 billed yearly) | $34.99 / mo | $49 | https://www.dotloop.com/products/plans-pricing/ | 2026-10-24 |
| AI listing copy and document drafting | ChatGPT Plus | $20 / mo | $28 | https://chatgpt.com/pricing/ | 2026-10-24 |

dotloop's site blocks automated reads; the $34.99 monthly and $28.67 yearly prices were taken from its plans page as shown in search results on 2026-10-24.

## Totals per plan (CAD per month)

| Bricks plan | Jobs counted | Separate tools | Bricks | Difference |
| --- | --- | --- | --- | --- |
| Keystone | CRM; transactions and e-sign | $146 ($97 + $49) | $49 | $97 a month, $1,164 a year |
| Marble | Keystone jobs; forms are covered by dotloop's templates, so not counted again | $146 | $99 | $47 a month, $564 a year |
| Diamond | Marble jobs, plus AI listing copy and document drafting | $174 ($146 + $28) | $149 | $25 a month, $300 a year |
| Brokerage, per agent | The Diamond jobs, which every seat includes | $174 | $31 to $74 a seat | $100 to $143 less per agent a month |

Clay is free, so it is not compared. Follow Up Boss is priced per user, so for teams and brokerages the separate total grows with each agent; Bricks team plans are not charged per agent.

## Builders: one site, one mapped visit a month (CAD, no conversion)

Bricks Site Progress is a done-for-you service (pilot, flight, processing and one site file), so it is compared against the services a builder books today, not DIY drone software.

| Job | Service | List price (CAD) | Source | Checked |
| --- | --- | --- | --- | --- |
| Drone mapping, with a progress report and share link | Buildmode Aerial Mapping, Progress Documentation (orthomosaic, elevation models, point cloud, PDF report, interactive map link) | $950 a recurring capture; $1,600 first capture with ground control | https://buildmodeaerial.ca/pricing | 2026-10-24 |
| Progress photos and video | Video Drone, Construction Monitoring (15 pictures, 1.5-minute edited video, up to 1 hour on site) | $325 a shoot | https://www.videodrone.ca/construction/ | 2026-10-24 |

| | Local vendors | Bricks mapped, monthly |
| --- | --- | --- |
| Per month | $950 mapping + $325 photos and video | $1,200 a site |
| One-time setup | $650 (Buildmode's first capture is $1,600, i.e. $650 over the $950 recurring rate) | $650 |

The page shows **no savings figure for builders**: vendor prices vary by city, site and package, and some Toronto-area firms charge less per visit. The prices above are shown as supporting detail only. The page leads with what Bricks adds beyond a file handoff ("One vendor, one portal, dated evidence for every draw"); every row of that list is backed by shipped code (see `src/lib/builder-edge.ts`).

Builder like-for-like notes:
- Buildmode's starting prices cover sites up to 20 ha within 45 km of London, Ontario; bigger sites and longer trips are quoted. Video Drone is in Toronto. Travel is not counted on either side.
- Bricks mapped captures include dated drone photos and video, an orthomosaic, a 3D model and a measurable map, filed in one site file. Survey-grade accuracy is quoted separately on both sides.
- Not counted: a platform to store and share progress media (OpenSpace quotes on request), and the time spent assembling lender and investor reports (no credible published figure; one vendor claims about 3 hours a month).
- The difference is one vendor, one portal and dated evidence for every draw, not the price.

## Like-for-like notes

- Follow Up Boss does more as a CRM (lead routing, dialer, automations). Bricks syncs contacts with Follow Up Boss both ways, so agents can keep it.
- E-sign: Bricks e-sign uses a signing checklist and shareable links. Placing fields on the PDF is coming soon, so dotloop does more here today.
- Diamond also includes an AI CMA. It is not counted: no like tool with a public list price was found (Cloud CMA's own pricing page asks you to qualify first).
- Trust accounting comes with every brokerage seat and is not counted.
- Listing sites and Virtual Visit are not counted: they come with a shoot or are quoted per job, not part of a plan.

## Checked but not counted

| Tool | Public price found | Why not counted |
| --- | --- | --- |
| DocuSign eSignature Personal | $11 / mo billed yearly (USD), 5 envelopes a month. https://www.docusign.com/products-and-pricing | Price shown is for yearly billing only; month-to-month basis used throughout |
| Cloud CMA | Not shown on the vendor's page | No public price |
| DroneDeploy Flight & Analysis | $4,188 / yr (USD), software only. https://www.dronedeploy.com/pricing | Not a competitor: DIY software you fly yourself. Bricks Site Progress is a done-for-you service, so builders are compared against services (above) |
| OpenSpace (progress-photo platform) | Not public: "Ready for a quote? Fill out our short form". https://www.openspace.ai/pricing/ | No public price |
| Ctrl single-flight missions | $1,950 recon, $2,950 full mission with orthomosaic, $4,500 survey grade (CAD). https://goctrl.ca/raas/single-flight | A lower-priced recurring mapping service (Buildmode) covers the same job |
| Progress Scan GTA | $400 a recurring visit, +$300 3D model (CAD), "typical GTA-area ranges". https://progressscangta.com/ | Posted as typical ranges; deliverables per visit less specific than Buildmode's |
| Grace Multimedia construction monitoring | From $349 a site visit (CAD). https://getgrace.ca/commercial-drone-services | Video Drone lists the same job lower |
| Island Drone Services 3D mapping | $799 for 10 acres (CAD, BC). https://islanddrone.ca/pricing/ | Vancouver Island only; not a GTA or Ontario option |
| JunoDrone progress monitoring | "$600 to $900 (depending on site size)" in a worked example; also says a site manager spends "3 hours per month" on photos and write-ups. https://junodrone.ca/progress-monitoring | An example, not a price list. The report time is a vendor claim, so it is not counted |
| Matterport and other tour hosting | Not checked | Virtual Visit is quoted per job, not part of a plan |
| Lofty, kvCORE / BoldTrail, SkySlope, Lone Wolf Transact | Not checked | Left out; Follow Up Boss and dotloop already stand for these jobs |
| Property websites | Not counted | Bricks listing sites come with each shoot, not with a plan |

## Appendix: cheapest tool for each job (reference only, not on the page)

The lowest-priced common tool that does each job, checked 2026-10-24. Kept here so the market-leader numbers can be sanity-checked; the page does not use them.

| Job | Tool and plan | List price (USD, monthly) | CAD at 1.3993 | Source |
| --- | --- | --- | --- | --- |
| CRM and transaction management | Wise Agent CRM (includes transaction management) | $49 / mo | $69 | https://wiseagent.com/pricing/ |
| E-sign | Dropbox Sign Essentials | $15 / mo | $21 | https://sign.dropbox.com/products/dropbox-sign/pricing |
| Online forms with PDF output | Jotform Bronze | $39 / mo | $55 | https://www.jotform.com/pricing/ |
| AI listing copy | ListingAI Essential | $19 / mo | $27 | https://www.listingai.co/pricing |

| Bricks plan | Cheapest separate tools | Bricks |
| --- | --- | --- |
| Keystone | $90 (Wise Agent + Dropbox Sign) | $49 |
| Marble | $145 (+ Jotform) | $99 |
| Diamond | $172 (+ ListingAI) | $149 |

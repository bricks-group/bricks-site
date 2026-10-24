# Savings comparison: sources

Used by the "One system, not a stack of subscriptions" section on https://www.brxs.ca/pricing.
Data lives in `src/lib/savings.ts`; `src/lib/savings.test.ts` checks that every price below matches it.

## Method

- Public list prices only, read from each vendor's own pricing page on 2026-10-24. If a vendor does not show a price publicly, the tool is left out.
- Month-to-month list price for one user, before tax, compared against Bricks month-to-month plan prices.
- For each job we use the lowest-priced common tool that does that job. One tool can cover more than one job; it is then counted once.
- Only jobs the Bricks plan actually includes are counted (see the feature matrix in `src/lib/plan-matrix.ts`, which mirrors the app's plan gates).
- USD prices are converted to CAD at the Bank of Canada daily rate of **1.3993 CAD per USD (2026-10-23)**, then rounded to the dollar per tool.
  Source: https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=5
- On the page: "Prices from public list pricing as of Oct 2026; may vary."

## Tools counted

| Job | Tool and plan | List price (USD, monthly) | CAD at 1.3993 | Source | Checked |
| --- | --- | --- | --- | --- | --- |
| CRM and transaction management | Wise Agent CRM (includes transaction management) | $49 / mo | $69 | https://wiseagent.com/pricing/ | 2026-10-24 |
| E-sign | Dropbox Sign Essentials | $15 / mo | $21 | https://sign.dropbox.com/products/dropbox-sign/pricing | 2026-10-24 |
| Online forms with PDF output | Jotform Bronze | $39 / mo | $55 | https://www.jotform.com/pricing/ | 2026-10-24 |
| AI listing copy | ListingAI Essential | $19 / mo | $27 | https://www.listingai.co/pricing | 2026-10-24 |

## Totals per plan (CAD per month)

| Bricks plan | Jobs counted | Separate tools | Bricks |
| --- | --- | --- | --- |
| Keystone | CRM and transactions, e-sign | $90 | $49 |
| Marble | Keystone jobs, plus forms | $145 | $99 |
| Diamond | Marble jobs, plus AI listing copy | $172 | $149 |

Clay is free, so it is not compared.

## Builders: one site, one mapped visit a month (CAD, no conversion)

Bricks Site Progress is a done-for-you service (pilot, flight, processing and one site file), so it is compared against the services a builder books today, not DIY drone software.

| Job | Service | List price (CAD) | Source | Checked |
| --- | --- | --- | --- | --- |
| Drone mapping, with a progress report and share link | Buildmode Aerial Mapping, Progress Documentation (orthomosaic, elevation models, point cloud, PDF report, interactive map link) | $950 a recurring capture; $1,600 first capture with ground control | https://buildmodeaerial.ca/pricing | 2026-10-24 |
| Progress photos and video | Video Drone, Construction Monitoring (15 pictures, 1.5-minute edited video, up to 1 hour on site) | $325 a shoot | https://www.videodrone.ca/construction/ | 2026-10-24 |

| | Separate services | Bricks mapped, monthly |
| --- | --- | --- |
| Per month | $1,275 ($950 + $325) | $1,200 |
| One-time setup | $650 (Buildmode's first capture is $1,600, i.e. $650 over the $950 recurring rate) | $650 |
| Difference | | Bricks ~$75 a month less, about $900 a year |

Builder like-for-like notes:
- Buildmode's starting prices cover sites up to 20 ha within 45 km of London, Ontario; bigger sites and longer trips are quoted. Video Drone is in Toronto. Travel is not counted on either side.
- Bricks mapped captures include dated drone photos and video, an orthomosaic, a 3D model and a measurable map, filed in one site file. Survey-grade accuracy is quoted separately on both sides.
- Not counted: a platform to store and share progress media (OpenSpace quotes on request), and the time spent assembling lender and investor reports (no credible published figure; one vendor claims about 3 hours a month).
- The result is a small saving. The bigger difference is one vendor, one portal and dated evidence for every draw.

## Like-for-like notes

- E-sign: Bricks e-sign uses a signing checklist and shareable links. Placing fields on the PDF is coming soon, so Dropbox Sign does more here today.
- Wise Agent also includes drip campaigns, texting add-ons and landing pages that Bricks CRM does not.
- Diamond also includes AI CMA and an AI document drafter. They are not counted: no like tool with a public list price was found (Cloud CMA's own pricing page asks you to qualify first).

## Checked but not counted

| Tool | Public price found | Why not counted |
| --- | --- | --- |
| Follow Up Boss Grow | $69 / user / mo (USD), $58 billed yearly. https://www.followupboss.com/pricing | A lower-priced CRM (Wise Agent) covers the same job |
| dotloop Premium | $34.99 / mo (USD), $28.67 billed yearly. https://www.dotloop.com/agents/ | Transaction management already counted in Wise Agent; e-sign counted at a lower price |
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
| Lofty, kvCORE / BoldTrail, SkySlope, Lone Wolf Transact | Not checked | Left out; the cheaper tools above already cover these jobs, or there is no Bricks plan equivalent |
| Property websites | Not counted | Bricks listing sites come with each shoot, not with a plan |

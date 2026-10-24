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
| DroneDeploy Flight & Analysis | $4,188 / yr (USD), software only. https://www.dronedeploy.com/pricing | Not like for like: Bricks Site Progress includes the flight; DroneDeploy is software you fly yourself. Shown to builders as context only (~$488 CAD a month at the rate above), never as a saving |
| Matterport and other tour hosting | Not checked | Virtual Visit is quoted per job, not part of a plan |
| Lofty, kvCORE / BoldTrail, SkySlope, Lone Wolf Transact, OpenSpace | Not checked | Left out; the cheaper tools above already cover these jobs, or there is no Bricks plan equivalent |
| Property websites | Not counted | Bricks listing sites come with each shoot, not with a plan |

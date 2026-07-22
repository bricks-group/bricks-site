# Bricks — Traffic Playbook (prelaunch)

Goal: get booked shoots. Three pillars — (1) own the brand domain, (2) a Google
Business Profile for local "real estate media / photographer" search, (3) direct
LinkedIn + Reel outreach to GTA agents. Two steps need your credentials/physical
presence (domain purchase, GBP video verification); everything else is ready to run.

---

## 1. DOMAIN — bricks.ag  (YOU: ~5 min + ~US$39/yr)

Status: **available** (verified via whois, "Domain not found").
Registrar: .ag is run by Nic AG. Easiest retail path: **101domain.com/ag.htm**
(US-based, takes cards, handles Nic AG). Alternative: register direct at nic.ag.

Steps:
1. Go to https://www.101domain.com/ag.htm — search `bricks.ag`.
2. Register `bricks.ag` (1 yr, ~US$39). Add domain privacy if offered.
3. In the registrar's DNS, set these records to point at Vercel:
   - Type A, name `@`, value `76.76.21.21`   (Vercel's apex IP)
   - Type CNAME, name `www`, value `cname.vercel-dns.com`
   (These are Vercel's standard values; confirm at
    https://vercel.com/docs/concepts/projects/domains if they ever change.)
4. In Vercel project `bricks-prelaunch`: Project → Settings → Domains →
   Add `bricks.ag` and `www.bricks.ag`. Vercel issues the SSL cert automatically.
5. Once live, update the canonical + og:url on the site from brxs.ca → bricks.ag
   (ask the assistant; one commit).

Note: brxs.ca can stay as a redirect or be dropped. Suggest keeping bricks.ag as
primary and 307-redirecting brxs.ca → bricks.ag for continuity.

## 2. GOOGLE BUSINESS PROFILE  (YOU: ~25 min setup + video verification)

Why: captures high-intent local searches ("real estate photographer GTA",
"drone photos for listings Toronto", "property media Mississauga").

Setup (business.google.com):
- Business name: **Bricks**
- Primary category: **"Commercial photographer"**  ← best fit for listing media.
  Secondary: **"Aerial photographer"** (drone is a differentiator), and
  **"Real estate agency"** is NOT right (you're media, not a brokerage) — skip it.
- Business type: **Service Area Business** (no public address — you shoot on-site).
  Service area: Greater Toronto Area — add Toronto, Mississauga, Brampton,
  Vaughan, Markham, Oakville, Etobicoke, Scarborough, North York (keep ≤15).
- Phone: 343-453-4578  (the site number)
- Website: https://brxs.ca  (switch to https://bricks.ag after domain step)
- Hours: your real booking hours (not 24h).
- Description (750 char max) — use the draft in `outreach/GBP-description.txt`.
- Photos: upload 8–10 — exterior shoots, a drone/aerial frame, a floor plan,
  and a headshot. Geotag by uploading from the phone at a shoot location.

Verification: choose **video verification** (fastest, 1–3 days). As a Service Area
Business with no storefront, the video must show: (a) street signs / landmarks
near your base address, (b) your work tools/equipment or branded apparel,
(c) a business document with the name "Bricks" (invoice, HST reg, or the booking
confirmation email). Record on the Google app, upload, wait for approval.

Compliance: this is a legit media business — fine for GBP. Keep NAP (name/address/
phone) identical to the site and any directory listings.

## 3. LINKEDIN + REEL OUTREACH  (YOU: send the drafts below)

CASL note: these go to your existing 1st-degree LinkedIn connections / people you
know in the industry — that's permission-adjacent and low risk. Do NOT mass-blast
cold unknown contacts. The Reel is posted publicly (not a DM) so it's fine.

- Connection targets: GTA realtors, team leads, brokerage admins. Lead with the
  Reel (proof), then the offer (book a shoot, founder rate).
- Post the Reel to LinkedIn with the caption in `outreach/reel-caption.txt`.
- DM script in `outreach/linkedin-dm.txt` — personalize the [bracketed] bits.
- Track replies in a simple list; convert to a booking via book.html.

---

## What the assistant can finish without you
- [x] Site restructure (done) — Hero→Trust→Work→FAQ→Book→What's coming.
- [x] Trust band (12 logos, accurate "agents & sales reps" framing).
- [ ] After you buy bricks.ag: repoint canonical/og:url + set redirect.
- [ ] After GBP is verified: nothing required on site, but can add a
      "Find us on Google" link if wanted.

## What ONLY you can do
- [ ] Purchase bricks.ag (payment).
- [ ] GBP video verification (needs your face/equipment/address).
- [ ] Send LinkedIn DMs / post the Reel (your account, your relationships).

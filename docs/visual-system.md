# Bricks visual system: tokens and rules (first pass, 2026-10-17)

Direction (Kam): a premium visual production company built around architecture, property intelligence and technology. Industrial minimalism meets editorial luxury: Leica restraint, instrument-panel precision, architectural drawing detail, field-equipment utility. The change is in how the interface communicates, not prettier icons.

Code: `src/app/visual-tokens.css` (CSS variables, `--vs-*`), `src/components/icons/` (icon set), `public/icons/bricks-*.svg`, sample at `/design/sample` (noindex).

## 1. Palette

| Token | Hex | Use | Contrast on off-white |
|---|---|---|---|
| `--vs-black` | `#14110E` | Text, linework, icons | 16.7:1 |
| `--vs-offwhite` | `#F4F1EB` | Page | — |
| `--vs-g-900` | `#24211E` | Dark surfaces | — |
| `--vs-g-800` | `#35322E` | | — |
| `--vs-g-700` | `#4A4642` | Secondary text (`--vs-fg-2`) | 8.3:1 |
| `--vs-g-600` | `#615D57` | Labels, captions (`--vs-fg-3`) | 5.8:1 |
| `--vs-g-500` | `#7A756E` | Large text / non-text only | 4.05:1 |
| `--vs-g-400` | `#97928A` | Idle state, secondary linework | 2.7:1 (non-text) |
| `--vs-g-300` | `#B7B2AA` | Strong rule | — |
| `--vs-g-200` | `#D6D2CA` | Hairline rule | — |
| `--vs-g-100` | `#E6E2DA` | Product-window surface (`--vs-tray`) | — |
| `--vs-g-50` | `#EEEAE3` | Linework tile surface | — |
| `--vs-accent` | `#D2542B` | **State only**: booked, in flight, delivered, live | 3.7:1 (fills, bars) |
| `--vs-accent-ink` | `#A8401F` | Accent as text on off-white | 5.45:1 |

The accent is the existing Bricks brick. It means state, so it never appears in illustrations, decoration, borders or hover tints. Dark mode swaps the semantic tokens (`--vs-bg`, `--vs-fg*`, `--vs-rule*`, `--vs-surface*`). The raw steps stay the same.

## 2. Type

- **Grotesque (headings + copy): General Sans** (self-hosted from /public/fonts, Fontshare ITF FFL). Display 34–56px, tracking −0.03em. Headings tracking −0.02em, weight 500. Body 16px/1.5.
- **Mono (figures only): JetBrains Mono** (already on the site, Google Fonts, OFL). Only for figures, IDs, timestamps, coordinates, status times and units. Use `font-variant-numeric: tabular-nums` (class `.vs-fig`). Size 12–13px.
- **Editorial serif (optional, open choice):** none is licensed on the site yet. The free candidate is **Newsreader** (Google Fonts, OFL), for pull quotes and long-form editorial moments only. It isn't loaded in this pass.
- **No mono eyebrows or spec lines in marketing copy** (Kam rejected lines like "EXACT CLOCK-TIME BOOKING · 24–48H TARGET"). Labels are sans, sentence case, graphite. No letter-spaced caps.

## 3. Space, grid and dividers

- 4px base: `--vs-1` 4, `--vs-2` 8, `--vs-3` 12, `--vs-4` 16, `--vs-6` 24, `--vs-8` 32, `--vs-12` 48, `--vs-16` 64, `--vs-24` 96.
- Layout and icon grid: 24px.
- Dividers: 1px hairline `--vs-rule` (g-200), 1px strong `--vs-rule-strong` (g-300). No double rules, no shadows for separation.
- Corners are square (`--vs-radius: 0`). Inputs may use 2px. Deliberate rounds stay: avatars, map pins, the logo's own corners.

## 4. Stroke and icon spec

- 24 × 24 grid, live area 2–22.
- Stroke 1.5px, non-scaling (`vector-effect: non-scaling-stroke` in React), so it is 1.5px at 16, 24 and 48.
- Square caps, mitred joins (miterlimit 10), **no fills**. Colour is `currentColor` (black or graphite).
- Square geometry first. Circles only where the object is round (lens, rotors).
- Icons sit bare on the page: no circles, bubbles, tinted squares or colour.
- 16px is the minimum. Every icon was checked at 16px on the specimen sheet.
- Icons support a label and never compete with headings. Max 24px next to body text, 48px only on specimen or empty states.
- Set (25 icons):
  - Services: `media`, `drone`, `film`, `tour-3d`, `floor-plan`, `site-progress`
  - Status: `booked`, `assigned`, `in-flight`, `uploading`, `qc`, `delivered`, `held`
  - Map tools: `survey-mark`, `coordinate`, `parcel`, `elevation`, `measure`, `layers`
  - Core: `deal`, `calendar`, `e-sign`, `mls`, `crm`, `integrations`

## 5. Annotation rules (architectural notation)

- Survey marks, coordinate crosses, elevation lines, parcel outlines and dimension ticks appear **only when they carry a real value**, such as a lot number, shoot GPS, drone altitude or a measured distance.
- Every mark has its value next to it in mono, with a unit. Unknown values are left out, never faked.
- Don't place a mark where it would mislead. Example: a drone's GPS fix is the aircraft's position, so it is not drawn as a point inside an oblique photo (see `/design/sample`).
- Annotation colour is black on light imagery or off-white on dark imagery, with no accent. Stroke matches icons (1.5px). Labels are sans 11px graphite, values are mono 12–13px.
- Never use annotations as ornament: no grid textures, crosshairs or blueprint lines behind marketing copy.

## 6. Instrumentation (status)

- The status rail is a single row of equal cells split by 1px dividers. Each cell has a bare 16px icon, a sans label, and a mono time or value.
- States:
  - done: black, 1px top rule
  - live: accent 2px top rule, accent-ink text and a 6px square accent indicator
  - next: g-400
  - held: g-700 with the `held` icon
- Precise numbers: fixed decimals (coordinates 5–6 decimal places, altitude 0.1 m), units always shown, tabular figures.

## 7. Photography: grading and crop

- **Grade (all service imagery):** saturation 78%. Black floor mapped to `#14110E`, white cap to `#F4F1EB`. A 15% graphite duotone blend on luminance, plus a slight warm balance (R ×1.01, B ×0.98). No vignettes, no glows, no sky replacement beyond the delivered edit. The script is `covers.py`.
- **Aspect:** tiles are 1:1; heroes 16:9 desktop and 4:3 mobile; plan headers 16:7. Within one row, every image has the same ratio.
- **Fixed crop logic per service:**
  - Listing media: the facade fills the centre, the roofline sits in the upper third, the horizon is level, and the driveway or approach leads in.
  - Drone: an oblique 30–45° over the property, with the parcel fully in frame.
  - Cinematic video: a 16:9 still from the film, never a play-button icon.
  - 3D tour / Virtual Visit: **always a walkthrough frame at eye level, or the plan view**, with viewer chrome cropped out.
  - Floor plan: the plan drawing on off-white, north-up, unrotated.
  - Site progress: construction anchored at the top (cranes or structure), or the top-down orthophoto. Crop out billboards, signage and third-party branding.
- Sources: only Kam's property, drone or construction work (www repo media, Drive "Development / Construction"). No stock.

## 8. Do and don't

**Do**
- Use real photography for visual services; it beats a camera, drone or play icon.
- Use technical linework (this spec) for software modules.
- Keep one accent, used for state.
- Use mono for figures only, and thin dividers.
- Put labels next to icons.

**Don't**
- Gradients (stepped data ramps with hard stops are allowed), glows, drop shadows on icons, colourful icon bubbles, cartoon or painterly illustration.
- Mono caps eyebrows.
- Accent on decoration or hover.
- Fake data in annotations, or ornamental crosshairs and grids.
- Rounded pills and tabs.

## 9. Open choices

1. **Accent.** The brick `#D2542B` is kept as the single accent. The site's CTAs (Book a shoot), links and the logo also use brick, which conflicts with "accent only for state". Options:
   - (a) Make CTAs black-on-off-white and keep brick for state plus the logo.
   - (b) Accept brick as brand + state.
   - (c) Move state to a new signal colour.
   This pass leaves CTAs unchanged.
2. **Serif.** Add Newsreader (free) for editorial moments, or stay sans-only.
3. **Painted trays.** The painterly backdrops behind product windows are replaced with flat `--vs-tray` graphite. Revert with one CSS rule if they should stay.
4. **Photographers tile.** No photographer-at-work or gear photo was found in the repo or Drive, so it uses a drone-over-property frame. Supply a real on-shoot shot to replace it.


## Product trays (v10, homepage restructure)
- Product frames (desk windows, phones) sit on **trays of real photography**, not paintings or flat fills: one recipe for every tray (`trays.py`): the cover grade, a 30% lift toward off-white (#F4F1EB), a Gaussian blur of r=3 at 1600w, and a fixed 16:10 crop. AVIF and WebP at 900 and 1600.
- Sources: desk = drone-cre-0439 (industrial waterfront), crm = res-living-1, book = res-ext-1 (brick house), disp = work/01 (street of brick homes).
- Rows are tonal panels (`--vs-surface`), 8px inner gutter, square corners. Titles are 22px/500 and lines 16px in `--vs-fg-2`, with one underlined text link per row. No eyebrows.
- The only large type is the hero H1 (30–42px) and the final CTA (44–76px).

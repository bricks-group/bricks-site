/**
 * Single source of truth for Bricks à-la-carte pricing *display* values.
 *
 * These mirror the authoritative rate tables in the Supabase `quote` edge
 * function (supabase/functions/quote/index.ts). Keep the two in lockstep:
 * when a rate changes in the engine, change it here too. Frontend copy must
 * never hardcode a price literal — import from this module instead.
 *
 * Bands map to footprint: [Small ≤1,200, Mid ≤2,500, Large ≤4,000, XL 4,000+] sq ft.
 * All values are CAD, pre-tax. HST (0.13) is applied at checkout in the engine.
 */

export const BAND_LABELS = ['Small', 'Mid', 'Large', 'XL'] as const;
export type FootprintBand = 0 | 1 | 2 | 3;

/** À la carte rates (CAD, pre-tax) by footprint band. */
export const PHOTO_RATE = [149, 199, 249, 299] as const;
export const DRONE_RATE = [99, 119, 139, 159] as const;
export const REEL_RATE = [199, 249, 299, 349] as const;
export const TWILIGHT_RATE = [150, 170, 185, 200] as const;
/** Virtual tour (path-confined walkthrough) — paid add-on. Not the virtual visit splat. */
export const TOUR_RATE = [149, 199, 249, 299] as const;
export const RUSH_FLAT = 75;
export const STAGING_PER_IMAGE = 35;
/** Standalone floor-plan capture (no HDR / no drone). Flat CAD pre-tax. */
export const FLOOR_PLAN_ONLY_RATE = 99;

/**
 * Virtual visit (Gaussian splat / SuperSplat) has no published dollar table.
 * Quoted by the same footprint bands as photo / reel / virtual tour.
 * Always a paid add-on. Never invent a VISIT_RATE. Never package it. Never
 * charge it in Stripe — booking collects the request + sqft, then we quote.
 */
export const FOOTPRINT_BANDS = 'Small ≤1,200 / Mid ≤2,500 / Large ≤4,000 / XL 4,000+'
export const VISIT_PRICE_LABEL = 'Quoted by sqft'

/** Format a rate band as a display range, e.g. [149,199,249,299] -> "$149–299". */
export function bandRange(rate: readonly number[]): string {
  const min = rate[0];
  const max = rate[rate.length - 1];
  return min === max ? `$${min}` : `$${min}–${max}`;
}

/** Format a flat fee, e.g. 75 -> "+$75". */
export function flat(amount: number): string {
  return `+$${amount}`;
}

/** Human-readable per-band table row, e.g. ["$149","$199","$249","$299"]. */
export function bandCells(rate: readonly number[]): string[] {
  return rate.map((n) => `$${n}`);
}

// Convenience display strings (used in FAQ / JSON-LD / inline labels).
export const TWILIGHT_RANGE = bandRange(TWILIGHT_RATE); // "$150–200"
export const REEL_RANGE = bandRange(REEL_RATE); // "$199–349"
export const TOUR_RANGE = bandRange(TOUR_RATE); // "$149–299"
export const PHOTO_RANGE = bandRange(PHOTO_RATE); // "$149–299"
export const DRONE_RANGE = bandRange(DRONE_RATE); // "$99–159"
export const FLOOR_PLAN_ONLY_LABEL = `$${FLOOR_PLAN_ONLY_RATE}` // "$99"

/** Package ladder “from” prices (Small footprint, CAD pre-tax). Mirror /book + homepage. */
export const CORE_FROM = PHOTO_RATE[0] + DRONE_RATE[0] // Essentials
export const STORY_FROM = CORE_FROM + REEL_RATE[0]
export const SHOWCASE_FROM = STORY_FROM + TOUR_RATE[0]
export const FULL_FROM = SHOWCASE_FROM + TWILIGHT_RATE[0]
export const PHOTO_ONLY_FROM = PHOTO_RATE[0]


/** Sellable media package IDs — shared charge identity with Companion booking-api. */
export const MEDIA_PACKAGE_IDS = [
  'photos_only',
  'essentials',
  'story',
  'showcase',
  'suite',
  'floor_plan_only',
] as const

/** Small-band “from” rack (CAD pre-tax) for the shared ladder. */
export const MEDIA_PACKAGE_FROM = {
  photos_only: PHOTO_ONLY_FROM,
  essentials: CORE_FROM,
  story: STORY_FROM,
  showcase: SHOWCASE_FROM,
  suite: FULL_FROM,
  floor_plan_only: FLOOR_PLAN_ONLY_RATE,
} as const

/**
 * Legacy Companion package IDs. Historical jobs / Dispatch enrichment only.
 * Never alias these onto www à-la-carte rates — that silently misprices.
 * Companion GET /packages no longer sells them.
 */
export const LEGACY_COMPANION_PACKAGE_IDS = ['standard', 'premium', 'luxury', 'estate'] as const

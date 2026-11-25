// Kept in lockstep with soldPackageId in src/lib/pricing.ts: checkout prices and
// writes this id into Stripe metadata, and stripe-webhook fulfills the same id.
export const SOLD_PACKAGE_IDS = ['photos_only', 'essentials', 'story', 'showcase', 'suite', 'floor_plan_only'] as const;
export const LEGACY_COMPANION_PACKAGE_IDS = ['standard', 'premium', 'luxury', 'estate'] as const;

const ALIASES: Record<string, string> = {
  full: 'suite',
  floorplan_only: 'floor_plan_only',
};

export function normPackageId(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const n = raw.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
  return ALIASES[n] || n;
}

/** '' when none was sent; null when it names nothing sold (legacy ids included). */
export function soldPackageId(raw: unknown): string | null {
  if (raw == null) return '';
  if (typeof raw !== 'string') return null;
  const id = normPackageId(raw);
  if (!id) return '';
  return (SOLD_PACKAGE_IDS as readonly string[]).includes(id) ? id : null;
}

/**
 * Package a paid session is fulfilled as. Only the checkout-written package_id
 * counts; package_interest is a display label and never upgrades the job.
 */
export function fulfilledPackageId(explicit: unknown): string {
  const id = normPackageId(explicit);
  if ((SOLD_PACKAGE_IDS as readonly string[]).includes(id)) return id;
  if ((LEGACY_COMPANION_PACKAGE_IDS as readonly string[]).includes(id)) return id;
  return 'essentials';
}

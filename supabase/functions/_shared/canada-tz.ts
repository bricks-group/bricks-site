/** Province/territory → IANA zone for checkout + webhook. Keep in lockstep with src/lib/schedule.ts. */

export const FALLBACK_TZ = 'America/Toronto';

export const PROVINCE_TZ: Record<string, string> = {
  BC: 'America/Vancouver',
  AB: 'America/Edmonton',
  SK: 'America/Regina',
  MB: 'America/Winnipeg',
  ON: 'America/Toronto',
  QC: 'America/Toronto',
  NB: 'America/Halifax',
  NS: 'America/Halifax',
  PE: 'America/Halifax',
  NL: 'America/St_Johns',
  YT: 'America/Whitehorse',
  NT: 'America/Yellowknife',
  NU: 'America/Iqaluit',
};

export const ZONE_ABBREV: Record<string, string> = {
  'America/Vancouver': 'PT',
  'America/Whitehorse': 'MT',
  'America/Edmonton': 'MT',
  'America/Yellowknife': 'MT',
  'America/Regina': 'CT',
  'America/Winnipeg': 'CT',
  'America/Toronto': 'ET',
  'America/Iqaluit': 'ET',
  'America/Halifax': 'AT',
  'America/St_Johns': 'NT',
};

const NAME_TO_CODE: Record<string, string> = {
  'british columbia': 'BC',
  'colombie-britannique': 'BC',
  'colombie britannique': 'BC',
  alberta: 'AB',
  saskatchewan: 'SK',
  manitoba: 'MB',
  ontario: 'ON',
  quebec: 'QC',
  'new brunswick': 'NB',
  'nouveau-brunswick': 'NB',
  'nouveau brunswick': 'NB',
  'nova scotia': 'NS',
  'nouvelle-ecosse': 'NS',
  'nouvelle ecosse': 'NS',
  'prince edward island': 'PE',
  pei: 'PE',
  'ile-du-prince-edouard': 'PE',
  'ile du prince edouard': 'PE',
  'newfoundland and labrador': 'NL',
  newfoundland: 'NL',
  'terre-neuve-et-labrador': 'NL',
  'terre-neuve': 'NL',
  'terre neuve': 'NL',
  yukon: 'YT',
  'northwest territories': 'NT',
  nwt: 'NT',
  'territoires du nord-ouest': 'NT',
  nunavut: 'NU',
};

const POSTAL_TO_PROVINCE: Record<string, string> = {
  A: 'NL', B: 'NS', C: 'PE', E: 'NB',
  G: 'QC', H: 'QC', J: 'QC',
  K: 'ON', L: 'ON', M: 'ON', N: 'ON', P: 'ON',
  R: 'MB', S: 'SK', T: 'AB', V: 'BC', Y: 'YT',
};

const BOOK_TIMEZONES = new Set<string>([...Object.values(PROVINCE_TZ), FALLBACK_TZ]);

function fold(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/['’]/g, '');
}

export function zoneAbbrev(tz: string): string {
  return ZONE_ABBREV[tz] || 'ET';
}

export function isBookTimezone(tz: string): boolean {
  return BOOK_TIMEZONES.has(tz);
}

export function normalizeProvince(raw?: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  if (upper.startsWith('CA-') && upper.length === 5) {
    const code = upper.slice(3);
    return code in PROVINCE_TZ ? code : null;
  }
  if (upper === 'PEI') return 'PE';
  if (upper === 'NWT') return 'NT';
  if (upper === 'YK') return 'YT';
  if (upper in PROVINCE_TZ) return upper;
  return NAME_TO_CODE[fold(trimmed)] || null;
}

export function provinceFromAddress(address?: string | null): string | null {
  if (!address) return null;
  const folded = fold(address);
  const names = Object.keys(NAME_TO_CODE).sort((a, b) => b.length - a.length);
  for (const name of names) {
    if (folded.includes(name)) return NAME_TO_CODE[name];
  }
  const codeRe = /(?:^|,\s*|\s+)(BC|AB|SK|MB|ON|QC|NB|NS|PE|NL|YT|NT|NU|PEI|NWT|YK)(?:\s*,|\s*$)/i;
  const m = address.match(codeRe);
  if (m) return normalizeProvince(m[1]);
  const postal = address.match(/\b([ABCEGHJKLMNPRSTVXY])\d[A-Z]\s?\d[A-Z]\d\b/i);
  if (postal) return POSTAL_TO_PROVINCE[postal[1].toUpperCase()] || null;
  return null;
}

export function resolvePropertyTimezone(input: {
  timezone?: string | null;
  province?: string | null;
  address?: string | null;
} = {}): { tz: string; province: string | null; source: string } {
  const fromProvince = normalizeProvince(input.province);
  if (fromProvince) return { tz: PROVINCE_TZ[fromProvince], province: fromProvince, source: 'province' };
  const fromAddress = provinceFromAddress(input.address);
  if (fromAddress) return { tz: PROVINCE_TZ[fromAddress], province: fromAddress, source: 'address' };
  const tz = (input.timezone || '').trim();
  if (tz && isBookTimezone(tz)) return { tz, province: null, source: 'timezone' };
  return { tz: FALLBACK_TZ, province: null, source: 'fallback' };
}

export function civilYmd(iso: string, tz: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: tz });
}

export function civilClockHm(iso: string | null, tz: string): string {
  if (!iso) return '10:00';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '10:00';
  const t = d.toLocaleTimeString('en-CA', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz,
  });
  return t === '24:00' ? '00:00' : (t || '10:00');
}

export function formatLocalWhen(iso: string, tz: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const day = d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: tz,
  });
  const clock = d.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: tz,
  }).replace(/[\u202f\u00a0]/g, ' ');
  return `${day} · ${clock} ${zoneAbbrev(tz)}`;
}

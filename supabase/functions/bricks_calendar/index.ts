// Supabase Edge Function: bricks-calendar
// Generates a subscribe-able iCal (.ics) feed of media-booking leads so the
// shoot schedule can be added to Apple Calendar / Google Calendar / Outlook via
// a single URL. No OAuth needed — the secret token is in the path, so only
// someone with the full URL can fetch it.
//
//   GET https://<project-ref>.supabase.co/functions/v1/bricks-calendar/<TOKEN>
//
// Deploy:  supabase functions deploy bricks_calendar
// Secret:  supabase secrets set CALENDAR_TOKEN=$(openssl rand -hex 16)
//
// Apple Calendar:  File > New Calendar Subscription > paste the URL.
// Google Calendar: Settings > Add calendar > From URL > paste the URL.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// 2-hour shoot block; window picks the start hour (Toronto local, floating time).
function windowStart(window: string | null): string {
  if (window === 'Afternoon') return '130000';
  return '090000'; // Morning or Either
}

function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

function icsDate(dateStr: string, hhmmss: string): string {
  // dateStr = YYYY-MM-DD ; hhmmss = HHMMSS ; floating local time (no Z).
  return dateStr.replace(/-/g, '') + 'T' + hhmmss;
}

// iCal text escaping: backslash, semicolon, comma, newline.
function esc(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

interface BookingRow {
  id: string;
  agent_name: string;
  brokerage: string | null;
  property_address: string;
  property_type: string;
  package_interest: string;
  tour_addon: boolean;
  preferred_date: string;
  preferred_window: string | null;
  notes: string | null;
  status: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  // Extract token from the path: /functions/v1/bricks-calendar/<TOKEN>
  const url = new URL(req.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const token = parts[parts.length - 1];

  const expected = Deno.env.get('CALENDAR_TOKEN');
  if (!expected || token !== expected) {
    return new Response('Not found', { status: 404 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) {
    return new Response('Server misconfigured', { status: 500 });
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/media_booking_leads?select=*&status=neq.cancelled&order=preferred_date.asc`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      return new Response('Upstream error', { status: 502 });
    }
    const rows: BookingRow[] = await res.json();

    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Bricks//Media Booking//EN',
      'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:Bricks listing shoots',
      'X-WR-TIMEZONE:America/Toronto',
    ];

    for (const r of rows) {
      const start = icsDate(r.preferred_date, windowStart(r.preferred_window));
      // +2h end
      const d = new Date(r.preferred_date + 'T' + windowStart(r.preferred_window).replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3'));
      d.setHours(d.getHours() + 2);
      const end = icsDate(
        d.toISOString().slice(0, 10),
        pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()),
      );

      const desc = [
        `Agent: ${r.agent_name}`,
        r.brokerage ? `Brokerage: ${r.brokerage}` : '',
        `Package: ${r.package_interest}`,
        `3D tour: ${r.tour_addon ? 'Yes' : 'No'}`,
        r.preferred_window ? `Window: ${r.preferred_window}` : '',
        r.notes ? `Notes: ${r.notes}` : '',
      ].filter(Boolean).map(esc).join('\\n');

      lines.push(
        'BEGIN:VEVENT',
        `UID:${r.id}@bricks-booking`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${esc('Bricks shoot — ' + r.property_type + ' · ' + r.package_interest)}`,
        `LOCATION:${esc(r.property_address)}`,
        `DESCRIPTION:${desc}`,
        'END:VEVENT',
      );
    }

    lines.push('END:VCALENDAR');

    const ics = lines.join('\r\n');
    return new Response(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="bricks-shoots.ics"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return new Response('Error: ' + String(e), { status: 500 });
  }
});

import './software.css'

type Step = { t: string; via: string }
type Count = { label: string; without: string; with: string }
type Flow = { without: readonly Step[]; with: readonly Step[]; counts: readonly Count[] }

/**
 * Example workflows, side by side. Counts are tallied from the steps listed here, not measured
 * from customers, and the page says so. Every "with Bricks" step is something the product does today.
 */
export const FLOWS: Record<'agent' | 'builder', Flow> = {
  agent: {
    without: [
      { t: 'Log the deal and its dates', via: 'Spreadsheet' },
      { t: 'Find a photographer who’s free', via: 'Texts and calls' },
      { t: 'Book drone and video separately', via: 'Two more vendors' },
      { t: 'Send lockbox and access notes to each vendor', via: 'Email, three times' },
      { t: 'Pay each vendor’s invoice', via: 'Three invoices' },
      { t: 'Download from each delivery link', via: 'File transfer, three times' },
      { t: 'Build a listing site', via: 'Website builder' },
      { t: 'Lay out the feature sheet', via: 'Design tool' },
      { t: 'Send the agreement for signature', via: 'E-sign tool' },
      { t: 'Send dates and documents to the lawyer, broker and inspector', via: 'Email, three threads' },
    ],
    with: [
      { t: 'Add the listing', via: 'Listing file' },
      { t: 'Book photos, drone, video and floor plan at one exact time, with access notes once', via: 'One booking' },
      { t: 'Pay once, with the photographer and travel already set', via: 'One checkout' },
      { t: 'Edited media lands on the listing', via: 'Delivered' },
      { t: 'Listing site, feature sheet, social pack and MLS® package, made from the listing', via: 'Launch kit' },
      { t: 'Send the agreement for signature from the deal', via: 'E-sign' },
      { t: 'Give the lawyer, broker and inspector their own deal room link', via: 'Deal room' },
    ],
    counts: [
      { label: 'Logins', without: '5', with: '1' },
      { label: 'Separate bookings', without: '3', with: '1' },
      { label: 'Payments', without: '3', with: '1' },
      { label: 'Things sent by hand', without: '6', with: '4' },
    ],
  },
  builder: {
    without: [
      { t: 'Find and book a drone pilot for the visit', via: 'Calls and email' },
      { t: 'Send site access and safety rules', via: 'Email' },
      { t: 'Wait for photos and maps', via: 'File transfer' },
      { t: 'Turn the flight into maps', via: 'Processing software' },
      { t: 'Copy images into the report and write what changed', via: 'Slides' },
      { t: 'Email the PDF to lenders and investors', via: 'Email' },
    ],
    with: [
      { t: 'Book the visit, or put the site on a monthly plan', via: 'One booking' },
      { t: 'Bricks assigns a vetted pilot', via: 'Dispatch' },
      { t: 'Photos, video and maps land on the project timeline, dated', via: 'Timeline' },
      { t: 'Pick a date range and Bricks drafts the report', via: 'Report' },
      { t: 'Share a PDF or a read-only link that expires', via: 'Share' },
    ],
    counts: [
      { label: 'Logins', without: '3', with: '1' },
      { label: 'Vendors to coordinate', without: '1 or more', with: 'Bricks assigns' },
      { label: 'Reports built from scratch', without: 'Every one', with: 'Drafted for you' },
    ],
  },
}

export default function WorkflowCompare({ variant = 'agent', compact = false }: { variant?: 'agent' | 'builder'; compact?: boolean }) {
  const f = FLOWS[variant]
  const who = variant === 'agent' ? 'one listing, from booking to closing' : 'one site visit, from booking to report'
  return (
    <div className={`wf${compact ? ' wf-compact' : ''}`}>
      <div className="wf-cols">
        <section className="wf-col" aria-label="Without Bricks">
          <h3>Without Bricks</h3>
          <ol>
            {f.without.map((s) => <li key={s.t}><span className="wf-t">{s.t}</span><span className="wf-via">{s.via}</span></li>)}
          </ol>
        </section>
        <section className="wf-col wf-with" aria-label="With Bricks">
          <h3>With Bricks</h3>
          <ol>
            {f.with.map((s) => <li key={s.t}><span className="wf-t">{s.t}</span><span className="wf-via">{s.via}</span></li>)}
          </ol>
        </section>
      </div>
      <table className="wf-counts">
        <caption>Counted from the example above: {who}</caption>
        <thead><tr><th scope="col"></th><th scope="col">Without</th><th scope="col">With Bricks</th></tr></thead>
        <tbody>
          {f.counts.map((c) => (
            <tr key={c.label}><th scope="row">{c.label}</th><td>{c.without}</td><td>{c.with}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="wf-fine">An example workflow, not a measurement. Your tools and steps will differ.</p>
    </div>
  )
}

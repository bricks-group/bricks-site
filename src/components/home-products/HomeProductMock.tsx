import BrandMark from '@/components/BrandMark'
import './home-products.css'

/** Marketing illustrations with sample data. Native-sized HTML, not scaled app frames.
 * The viewport crops detail, never the type; all surfaces inherit the site's theme. */
export function TransactionsMock({ chrome = true }: { chrome?: boolean }) {
  return (
    <div className={`pwin hpm-window${chrome ? '' : ' pwin-bare'}`} role="img" aria-label="Bricks Transactions, sample data: six open deals, $148K GCI in escrow, two closing this week">
      {chrome && <div className="pwin-bar"><div className="pwin-dots" aria-hidden="true"><i /><i /><i /></div></div>}
      <div className="hpm-desk">
        <aside className="hpm-sidebar" aria-hidden="true">
          <div className="hpm-brand"><BrandMark /> bricks</div>
          <small>WORKSPACE</small><strong>Ashfield</strong>
          <span>Overview</span><span>Contacts</span><span className="hpm-selected">Transactions</span><span>Shots</span><span>Photographers</span><span>Agents</span><span>Billing</span>
        </aside>
        <div className="hpm-work">
          <div className="hpm-meta">ASHFIELD · YOUR DESK</div>
          <h3>Transactions</h3>
          <p className="hpm-intro">One place for every deal.</p>
          <div className="hpm-stats"><div><small>OPEN DEALS</small><b>6</b></div><div><small>GCI IN ESCROW</small><b>$148K</b></div><div><small>CLOSING THIS WEEK</small><b>2</b></div></div>
          <div className="hpm-register">
            <div className="hpm-table-head"><span>Property</span><span>Stage</span><span>GCI</span></div>
            <div><strong>77 Rosedale Valley</strong><span>Conditional</span><span>$31,500</span></div>
            <div><strong>42 Danforth Ave</strong><span>Showing</span><span>$24,800</span></div>
            <div><strong>18 Queen St</strong><span>Offer</span><span>$22,400</span></div>
            <div><strong>6 King West</strong><span>Closing</span><span>$28,000</span></div>
          </div>
          <div className="hpm-footnote"><i /> All files up to date <span>Sample data</span></div>
        </div>
      </div>
    </div>
  )
}

export function BookingMock() {
  return (
    <div className="hpm-phone" role="img" aria-label="Bricks booking illustration, sample data: book a listing shoot, choose Essentials and a date">
      <div className="hpm-phone-status"><b>9:41</b><span>••• ▰</span></div>
      <div className="hpm-phone-nav"><BrandMark /><b>bricks</b><span>Log in ☰</span></div>
      <div className="hpm-book-step hpm-book-one">
        <small>1 / 4 · YOUR LISTING</small><h3>Book a listing shoot.</h3>
        <label>Brokerage</label><div className="hpm-input">Sample Realty</div>
        <label>Email</label><div className="hpm-input">agent@example.com</div>
        <label>Property address</label><div className="hpm-input">120 Sample Street</div>
        <label>Property type</label><div className="hpm-input">Detached <span>⌄</span></div>
        <div className="hpm-next">Next →</div>
      </div>
      <div className="hpm-book-step hpm-book-two" aria-hidden="true">
        <small>2 / 4 · YOUR PACKAGE</small><h3>Ready for the listing.</h3>
        <div className="hpm-package"><strong>Essentials</strong><p>HDR photos, drone and floor plan</p><b>From $248</b></div>
        <div className="hpm-package"><strong>Story</strong><p>Essentials + cinematic reel</p></div>
        <div className="hpm-next">Choose a time →</div>
      </div>
    </div>
  )
}

export function ProgressReportMock() {
  return (
    <div className="hpm-report" role="img" aria-label="Sample Bricks site report: Ashfield Meadows, Downsview Toronto, Q3 lender update with an orthomosaic">
      <header><h3>Ashfield Meadows</h3><p>Downsview, Toronto</p><small>Aug 20, 2026 to Oct 16, 2026</small><strong>Q3 lender update</strong></header>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/features/ashfield-orthomosaic.jpg" alt="" width="928" height="464" />
      <div className="hpm-report-key"><span>0 ━━━━━ 50 m</span><span>Orthomosaic · Visit 03</span></div>
      <p>Scale from the map file. Photo locations pinned to the capture.</p>
    </div>
  )
}

export function DealRoomMock() {
  return (
    <div className="hpm-deal" role="img" aria-label="Sample Bricks deal room for 77 Rosedale Valley Road: conditions, dates, documents and who shared the file">
      <div className="hpm-deal-nav"><span><BrandMark /> bricks</span><small>Private deal room · Sample data</small></div>
      <div className="hpm-deal-body"><p>For Priya Natarajan, buyer&apos;s lawyer</p><h3>77 Rosedale Valley Rd</h3><p>Toronto, ON</p>
        <div className="hpm-deal-cols"><div><h4>Conditions</h4><div className="hpm-deal-row"><span>Status certificate review</span><b>Fulfilled</b></div><div className="hpm-deal-row"><span>Financing</span><b>Open</b></div><h4>Key dates</h4><div className="hpm-deal-row"><span>Offer accepted</span><b>Oct 20, 2026</b></div><div className="hpm-deal-row"><span>Closing</span><b>Dec 15, 2026</b></div><h4>Documents</h4><div className="hpm-deal-row"><span>APS signed.pdf</span><b>Download ↓</b></div></div><aside><h4>Shared by</h4><strong>Daniel Russo</strong><p>daniel@sample-brokerage.ca</p><h4>About this page</h4><p>Only what Daniel chose to share. A private link for this deal.</p></aside></div>
      </div>
    </div>
  )
}

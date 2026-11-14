/** Plain, server-rendered service and price list above a client-side booking form, so the prices are in the HTML. */
export default function BookPriceList({ groups, note }: { groups: readonly { label: string; items: readonly { name: string; price: string }[] }[]; note: string }) {
  return (
    <section className="bk-prices" aria-label="Services and prices">
      {groups.map((g) => (
        <div className="bk-prices-g" key={g.label}>
          <h2>{g.label}</h2>
          <ul>
            {g.items.map((i) => (
              <li key={i.name}><span>{i.name}</span><span className="bk-prices-v">{i.price}</span></li>
            ))}
          </ul>
        </div>
      ))}
      <p className="bk-prices-n">{note}</p>
      <style>{`
        .bk-prices{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px 32px;margin:0 0 32px;padding:16px 0;border-top:var(--vs-hair,1px solid var(--hair));border-bottom:var(--vs-hair,1px solid var(--hair));}
        .bk-prices h2{font-size:13px;font-weight:500;color:var(--vs-fg-3,var(--inkMute));margin:0 0 6px;letter-spacing:0;}
        .bk-prices ul{list-style:none;margin:0;padding:0;}
        .bk-prices li{display:flex;justify-content:space-between;gap:12px;font-size:13.5px;line-height:1.5;padding:3px 0;color:var(--vs-fg-2,var(--inkSoft));}
        .bk-prices-v{font-family:var(--vs-mono,'JetBrains Mono',monospace);font-size:12.5px;color:var(--vs-fg,var(--ink));white-space:nowrap;font-variant-numeric:tabular-nums;}
        .bk-prices-n{grid-column:1 / -1;font-size:12.5px;color:var(--vs-fg-3,var(--inkMute));margin:0;}
      `}</style>
    </section>
  )
}

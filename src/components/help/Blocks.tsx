import type { Block } from '@/lib/help/types'
import { slugify, plain } from '@/lib/help'
import { DIAGRAMS, DIAGRAM_VIEWBOX } from '@/lib/help/diagrams/svgs'
import Inline from './Inline'

export default function Blocks({ body }: { body: Block[] }) {
  return (
    <>
      {body.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </>
  )
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'p':
      return <p><Inline text={b.x} /></p>
    case 'h2':
      return <h2 id={slugify(b.x)}><Inline text={b.x} /></h2>
    case 'ul':
      return <ul>{b.items.map((x, i) => <li key={i}><Inline text={x} /></li>)}</ul>
    case 'ol':
      return <ol className="hc-steps">{b.items.map((x, i) => <li key={i}><Inline text={x} /></li>)}</ol>
    case 'note':
      return <aside className="hc-note"><Inline text={b.x} /></aside>
    case 'code':
      return <pre className="hc-code"><code>{b.x}</code></pre>
    case 'table':
      return (
        <div className="hc-table" role="region" aria-label="Table" tabIndex={0}>
          <table>
            <thead><tr>{b.head.map((h, i) => <th key={i} scope="col"><Inline text={h} /></th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row"><Inline text={c} /></th> : <td key={j}><Inline text={c} /></td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'fig':
      return (
        <figure className="hc-fig">
          <svg
            viewBox={DIAGRAM_VIEWBOX}
            role="img"
            aria-label={plain(b.caption)}
            dangerouslySetInnerHTML={{ __html: DIAGRAMS[b.id] }}
          />
          <figcaption><Inline text={b.caption} /></figcaption>
        </figure>
      )
    case 'flow':
      return (
        <ol className="hc-flow">
          {b.steps.map((s, i) => (
            <li key={i}>
              <span className="hc-flow-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="hc-flow-k"><Inline text={s.k} /></span>
              <span className="hc-flow-v"><Inline text={s.v} /></span>
            </li>
          ))}
        </ol>
      )
    case 'qa':
      return (
        <dl className="hc-qa">
          {b.items.map((x, i) => (
            <div key={i}>
              <dt><Inline text={x.q} /></dt>
              <dd><Inline text={x.a} /></dd>
            </div>
          ))}
        </dl>
      )
  }
}

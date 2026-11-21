export const legalDocCss = `
  .legal-body{max-width:760px;margin:0 auto;padding:0 36px;}
  section.block{padding:48px 0;border-top:1px solid var(--hair);}
  section.block h2{font-weight:500;font-size:22px;letter-spacing:-0.4px;color:var(--ink);margin-bottom:14px;}
  section.block h3{font-weight:500;font-size:16px;color:var(--ink);margin:20px 0 8px;}
  section.block p{margin-bottom:12px;color:var(--inkSoft);}
  section.block ul{margin:0 0 12px 20px;color:var(--inkSoft);}
  section.block li{margin-bottom:6px;}
  section.block a{color:var(--brickDeep);}
  @media (max-width:680px){ .legal-body{padding:0 20px;} }
  table{width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;}
  th{text-align:left;padding:10px 12px;background:var(--paper);border:1px solid var(--hair);font-weight:500;color:var(--ink);}
  td{padding:10px 12px;border:1px solid var(--hair);color:var(--inkSoft);line-height:1.55;vertical-align:top;}
  .inshort{background:var(--paper);border:1px solid var(--hair);border-left:3px solid var(--brick);padding:12px 16px;margin-bottom:16px;border-radius:0;color:var(--ink);}
  section.block details{margin:4px 0 0;}
  section.block summary{cursor:pointer;color:var(--brickDeep);font-size:14px;padding:6px 0;margin-bottom:8px;list-style:none;}
  section.block summary::-webkit-details-marker{display:none;}
  section.block summary::before{content:'+ ';}
  section.block details[open] summary::before{content:'− ';}
  .legal-notice{background:var(--paper);border:1px solid var(--hair);border-left:3px solid var(--brick);padding:16px 20px;margin-bottom:24px;border-radius:2px;}
  .legal-notice p{font-size:13px;color:var(--inkSoft);margin:0;}
`

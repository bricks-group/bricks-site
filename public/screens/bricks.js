// bricks.js — Bricks production component library
// Auto-generated from Bricks Full Frontend.html
// All components available on window. Use mountBricks('containerId', <Component/>) to render.
(function(global){
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "stageBg": "#E4DED2",
  "accent": "#D2542B",
  "font": "Söhne",
  "density": "comfy"
}/*EDITMODE-END*/;

// Real Bricks listing photos, reused as sample thumbnails in mockups.
const SB_IMG = 'https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/';

// Shared primitives — used by all screen files. Lean tokens + helpers.
const T = {
  paper:'#F4F1EB', paperSoft:'#EDE8DF', paperDeep:'#E4DED2',
  hair:'#1411100F', hairStrong:'#14111020', hairMid:'#14111018',
  ink:'#14110E', inkSoft:'#3B332A', inkMute:'#6B6054', inkFaint:'#A39684',
  night:'#141210', nightSoft:'#1C1A17', nightDeep:'#23201C',
  nightHair:'#F4F1EB14', nightHairS:'#F4F1EB26',
  moon:'#F4F1EB', moonSoft:'#D6CFC2', moonMute:'#8F8678', moonFaint:'#5E574C',
  brick:'#D2542B', brickDeep:'#A8401F', brickSoft:'#F4D9CC', brickTint:'#FBEFE8',
  ok:'#4A6B3C', okTint:'#E6ECDD',
  warn:'#B8741F', warnTint:'#F6E8D1',
  bad:'#8C2F24', badTint:'#F1DAD4',
};
const F = {
  display:'"General Sans","Söhne",ui-sans-serif,-apple-system,BlinkMacSystemFont,sans-serif',
  mono:'"JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace',
};

// Theme helper — returns dark or light palette set
function useTheme(dark) {
  return {
    bg:   dark ? T.night     : T.paper,
    surf: dark ? T.nightSoft : '#FFFFFF',
    surf2:dark ? T.nightDeep : T.paperSoft,
    hair: dark ? T.nightHair : T.hair,
    hairS:dark ? T.nightHairS: T.hairStrong,
    ink:  dark ? T.moon      : T.ink,
    ink2: dark ? T.moonSoft  : T.inkSoft,
    ink3: dark ? T.moonMute  : T.inkMute,
    ink4: dark ? T.moonFaint : T.inkFaint,
  };
}

function BrickMark({ size=20, color=T.brick, style={} }) {
  // Exact Bricks logo: top brick upper-LEFT, bottom-left small square under it,
  // bottom-right wide rectangle extending past. Silhouette reads as lowercase "b".
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <rect x="4"  y="5"    width="11" height="7" rx="1.2" fill={color}/>
      <rect x="4"  y="13"   width="6"  height="7" rx="1.2" fill={color}/>
      <rect x="11" y="13"   width="10" height="7" rx="1.2" fill={color}/>
    </svg>
  );
}
function Wordmark({ size=18, color, style={} }) {
  const c = color || T.ink;
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:size*0.5, ...style }}>
      <BrickMark size={Math.round(size*1.2)} color={T.brick}/>
      <span style={{
        fontFamily:F.display, fontSize:size, fontWeight:500,
        letterSpacing:-size*0.035, color:c, lineHeight:1,
      }}>bricks</span>
    </div>
  );
}
function Over({ children, color, style={} }) {
  return <span style={{
    fontFamily:F.mono, fontSize:10.5, fontWeight:500,
    letterSpacing:'0.18em', textTransform:'uppercase',
    color: color || T.inkMute, ...style,
  }}>{children}</span>;
}
function Img({ w='100%', h=160, label, dark=false, style={}, r=2 }) {
  const bg = dark ? T.nightSoft : T.paperDeep;
  const stripe = dark ? T.nightHair : T.hair;
  const fg = dark ? T.moonMute : T.inkMute;
  return (
    <div style={{
      width:w, height:h, background:bg,
      backgroundImage:`repeating-linear-gradient(135deg, transparent 0 10px, ${stripe} 10px 11px)`,
      borderRadius:r, display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:F.mono, fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
      color:fg, ...style,
    }}>{label}</div>
  );
}
function I({ name, size=18, color='currentColor', sw=1.5, style={} }) {
  const p = {
    home:<><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11h5v-6h4v6h5V9"/></>,
    cal:<><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    job:<><rect x="3" y="6" width="18" height="14" rx="1"/><path d="M8 6V4h8v2M3 12h18"/></>,
    cam:<><path d="M4 7h3l2-2h6l2 2h3v13H4z"/><circle cx="12" cy="13" r="4"/></>,
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></>,
    up:<><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></>,
    map:<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></>,
    pin:<><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></>,
    arr:<path d="M5 12h14M13 6l6 6-6 6"/>,
    arrU:<path d="M12 19V5M6 11l6-6 6 6"/>,
    arrD:<path d="M12 5v14M18 13l-6 6-6-6"/>,
    arrL:<path d="M19 12H5M11 6l-6 6 6 6"/>,
    chk:<path d="M4 12l5 5L20 6"/>,
    plus:<><path d="M12 5v14M5 12h14"/></>,
    cog:<><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></>,
    srch:<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    bell:<><path d="M6 17V11a6 6 0 0 1 12 0v6M4 17h16M10 21h4"/></>,
    dol:<><path d="M12 3v18"/><path d="M17 7H9.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 1 0 5H6"/></>,
    dots:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    clk:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    trend:<><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    cR:<path d="m9 6 6 6-6 6"/>,
    cD:<path d="m6 9 6 6 6-6"/>,
    cU:<path d="m6 15 6-6 6 6"/>,
    grid:<><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></>,
    users:<><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 21c0-3-1.8-5.2-5-6"/></>,
    play:<path d="M7 4v16l13-8z"/>,
    nav:<path d="M3 11l19-9-9 19-2-8-8-2z"/>,
    mail:<><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></>,
    lock:<><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    eye:<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    heart:<path d="M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z"/>,
    bolt:<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>,
    x:<><path d="m6 6 12 12M18 6 6 18"/></>,
    cards:<><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18"/></>,
    file:<><path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4"/></>,
    star:<path d="m12 3 2.8 6.2 6.7.7-5 4.6 1.5 6.6L12 17.7 5.9 21l1.5-6.6-5-4.6 6.7-.7z"/>,
    zap:<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>,
    sliders:<><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="7" cy="18" r="2"/></>,
    menu:<><path d="M4 6h16M4 12h16M4 18h16"/></>,
    phone:<path d="M5 3h4l2 5-2 2a12 12 0 0 0 5 5l2-2 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z"/>,
    dl:<><path d="M12 4v12M6 10l6 6 6-6"/><path d="M4 20h16"/></>,
    logout:<><path d="M9 21H5V3h4"/><path d="M16 16l5-4-5-4M9 12h12"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" style={style}>
      {p[name]||null}
    </svg>
  );
}

// Phone frame — mobile screens wrap in this
function Phone({ dark=false, children }) {
  const th = useTheme(dark);
  return (
    <div style={{
      width:390, height:844, background:th.bg, color:th.ink,
      fontFamily:F.display, display:'flex', flexDirection:'column',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ height:44, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 22px', fontSize:15, fontWeight:600 }}>
        <span>9:41</span>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <div style={{ width:16, height:10, borderRadius:1, background:th.ink }}/>
          <div style={{ width:22, height:11, borderRadius:2, border:`1.2px solid ${th.ink}`, position:'relative' }}>
            <div style={{ position:'absolute', inset:1.5, width:14, background:th.ink, borderRadius:1 }}/>
          </div>
        </div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>{children}</div>
      <div style={{ position:'absolute', bottom:6, left:'50%', transform:'translateX(-50%)', width:134, height:4, background:th.ink, borderRadius:4, opacity:0.85 }}/>
    </div>
  );
}

// Demo nav context — parent DemoBook/DemoDisp install tab state so TabBar clicks switch screens.
const DemoNav = React.createContext(null);

// Bottom tab bar (mobile, configurable)
function TabBar({ dark=false, tabs, active, accent=T.brick, onSelect }) {
  const th = useTheme(dark);
  const nav = React.useContext(DemoNav);
  const select = onSelect || (nav && nav.setTab);
  const cur = (nav && typeof nav.tab === 'number') ? nav.tab : active;
  return (
    <div style={{
      borderTop:`1px solid ${th.hair}`, background:th.bg,
      padding:'8px 12px 28px',
      display:'grid', gridTemplateColumns:`repeat(${tabs.length},1fr)`, gap:2,
    }}>
      {tabs.map((t,i) => {
        const on = i === cur;
        return (
          <div key={t.label} onClick={select ? () => select(i) : undefined} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:4,
            padding:'8px 0', position:'relative',
            color: on ? th.ink : th.ink4,
            cursor:'pointer',
          }}>
            {on && <div style={{ position:'absolute', top:0, width:24, height:2, background:accent }}/>}
            <I name={t.icon} size={19} color={on ? th.ink : th.ink4} sw={on ? 1.75 : 1.5}/>
            <span style={{ fontSize:10, fontFamily:F.mono, letterSpacing:'0.12em', textTransform:'uppercase' }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Pill/badge
function Pill({ children, tone='neutral', dark=false }) {
  const th = useTheme(dark);
  const map = {
    brick:   { bg: dark ? '#F4D9CC22' : T.brickTint, fg: dark ? T.brickSoft : T.brickDeep },
    ok:      { bg: dark ? '#E6ECDD22' : T.okTint,    fg: dark ? '#B8CC9E' : T.ok },
    warn:    { bg: dark ? '#F6E8D122' : T.warnTint,  fg: dark ? '#E6B477' : T.warn },
    neutral: { bg: th.surf2, fg: th.ink2 },
    ink:     { bg: th.ink, fg: th.bg },
  };
  const c = map[tone];
  return (
    <span style={{
      padding:'5px 9px', background:c.bg, color:c.fg,
      fontFamily:F.mono, fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
      borderRadius:2, whiteSpace:'nowrap',
    }}>{children}</span>
  );
}

// Button
function Btn({ children, variant='primary', dark=false, full=false, icon, style={} }) {
  const th = useTheme(dark);
  const styles = {
    primary: { background: T.ink, color: T.paper, border: 'none' },
    accent:  { background: T.brick, color: '#fff', border: 'none' },
    ghost:   { background: 'transparent', color: th.ink, border: `1px solid ${th.hairS}` },
    secondary:{ background: th.surf2, color: th.ink, border: `1px solid ${th.hair}` },
  };
  return (
    <button style={{
      ...styles[variant],
      padding:'13px 20px', borderRadius:2,
      fontFamily:F.display, fontSize:14, fontWeight:500, letterSpacing:-0.1,
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
      width: full ? '100%' : 'auto', cursor:'pointer',
      ...style,
    }}>
      {children}{icon && <I name={icon} size={14} color="currentColor"/>}
    </button>
  );
}



// ─── Role-aware console config (brokerage / team / solo) ───
const BROK_ROLES = {
  brokerage: {
    wsNm:'Studio North', wsMeta:'47 agents', ini:'EA', who:'Elena Asare', role:'Operations',
    nav:[
      { group:null,        items:[['grid','Overview','overview']] },
      { group:'Deal flow', items:[['users','CRM','crm'],['cards','Transactions','transactions'],['up','MLS submission','mls'],['file','Forms & e-sign','forms']] },
      { group:'Media',     items:[['job','Jobs','jobs'],['cam','Vendors','vendors']] },
      { group:'Finance',   items:[['dol','Accounting','accounting'],['user','Agents','agents']] },
      { group:null,        items:[['cog','Settings','settings']] },
    ],
  },
  team: {
    wsNm:'Ortega Group', wsMeta:'6 agents · team', ini:'MO', who:'Marisol Ortega', role:'Team lead',
    nav:[
      { group:null,        items:[['grid','Overview','overview']] },
      { group:'Deal flow', items:[['users','CRM','crm'],['cards','Transactions','transactions'],['up','MLS submission','mls'],['file','Forms & e-sign','forms']] },
      { group:'Media',     items:[['job','Jobs','jobs']] },
      { group:'Finance',   items:[['dol','Accounting','accounting'],['user','Team','agents']] },
      { group:null,        items:[['cog','Settings','settings']] },
    ],
  },
  solo: {
    wsNm:'Marisol Ortega', wsMeta:'Solo agent', ini:'MO', who:'Marisol Ortega', role:'RE·482901',
    nav:[
      { group:null,        items:[['grid','Overview','overview']] },
      { group:'Deal flow', items:[['users','CRM','crm'],['cards','Transactions','transactions'],['up','MLS submission','mls'],['file','Forms & e-sign','forms']] },
      { group:'Business',  items:[['job','Bookings','jobs'],['dol','Income','accounting']] },
      { group:null,        items:[['cog','Settings','settings']] },
    ],
  },
};

// Each role gets a different default dashboard — greeting, KPIs and widgets tuned to what
// that operator wants to see first. All of it is user-customizable (see customize state).
const DASHBOARDS = {
  brokerage: {
    eyebrow:'Thursday · Week 16', hi:'Good morning, Elena.', cta:'New job',
    sub:(th)=><>Six shoots on the books today. <span style={{color:th.ink}}>Two deals need signatures.</span></>,
    kpis:[
      {l:'Jobs this month',v:'184',d:'+12.4%',s:'vs 164 prev.'},
      {l:'GCI · April',v:'$182K',d:'+9.4%',s:'gross commission'},
      {l:'Company dollar',v:'$47.3K',d:'+6.0%',s:'after splits'},
      {l:'Active agents',v:'47',d:'+3',s:'onboarded · 30d'},
    ],
    widgets:[['volume',4],['today',2],['pipeline',2],['leaderboard',2],['trust',2]],
  },
  team: {
    eyebrow:'Ortega Group · Week 16', hi:'Morning, Marisol.', cta:'New job',
    sub:(th)=><>Your team has <span style={{color:th.ink}}>5 deals closing</span> this month. Two need docs signed.</>,
    kpis:[
      {l:'Team GCI · MTD',v:'$58.2K',d:'+14%',s:'6 agents'},
      {l:'Active listings',v:'12',d:'+2',s:'on market'},
      {l:'Closing ≤ 30d',v:'5',s:'$4.1M volume'},
      {l:'Team pipeline',v:'$6.4M',d:'+7%',s:'32 deals'},
    ],
    widgets:[['volume',4],['closings',2],['leaderboard',3],['pipeline',3]],
  },
  solo: {
    eyebrow:'Thursday · Apr 18', hi:'Hi, Marisol.', cta:'Book a shoot',
    sub:(th)=><>One shoot today, one deal firming up. You’re on pace for a <span style={{color:th.ink}}>record quarter.</span></>,
    kpis:[
      {l:'My GCI · YTD',v:'$214K',d:'+18%',s:'vs last year'},
      {l:'Active listings',v:'4',s:'2 in offer'},
      {l:'Deals in progress',v:'3',s:'1 firm'},
      {l:'Next payout',v:'$27.2K',s:'May 1 · Riverbend'},
    ],
    widgets:[['nextshoot',2],['income',2],['followups',2],['listings',4],['closings',2]],
  },
};
const WTITLE = {
  volume:'Job volume · 24 days', today:'Today · 6 shoots', pipeline:'Pipeline by stage',
  leaderboard:'Top performers · 30d', trust:'Trust & reconciliation', closings:'Upcoming closings',
  listings:'Listings & media', income:'Income · YTD', nextshoot:'Next shoot', followups:'Follow-ups due',
};

function DashRole({ th, dark, role, customize }) {
  const D = DASHBOARDS[role] || DASHBOARDS.brokerage;
  return (
    <>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          {customize
            ? <><Over color={T.brick}>Editing dashboard</Over>
                <div style={{ fontSize:30, fontWeight:500, letterSpacing:-1, marginTop:8 }}>Customize your overview</div>
                <div style={{ fontSize:13, color:th.ink2, marginTop:6 }}>Drag to reorder · remove what you don’t need · add from the library below.</div></>
            : <><Over color={th.ink4}>{D.eyebrow}</Over>
                <div style={{ fontSize:34, fontWeight:500, letterSpacing:-1.1, marginTop:8 }}>{D.hi}</div>
                <div style={{ fontSize:14, color:th.ink2, marginTop:6 }}>{D.sub(th)}</div></>}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {customize
            ? <><Btn variant="ghost" dark={dark} icon="plus">Add widget</Btn><Btn variant="primary" dark={dark} icon="chk">Done</Btn></>
            : <><Btn variant="ghost" dark={dark} icon="sliders">Customize</Btn><Btn variant="primary" dark={dark} icon="plus">{D.cta}</Btn></>}
        </div>
      </div>
      <KpiRow th={th} items={D.kpis}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:20 }}>
        {D.widgets.map(([key,span],i)=>(
          <DashWidget key={key+i} th={th} dark={dark} span={span} title={WTITLE[key]} customize={customize}>
            {renderWidget(key, th, dark)}
          </DashWidget>
        ))}
        {customize && (
          <div style={{ gridColumn:'span 2', border:`1px dashed ${th.hairS}`, borderRadius:2, minHeight:140, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, color:th.ink3 }}>
            <div style={{ width:34, height:34, borderRadius:2, border:`1px solid ${th.hairS}`, display:'flex', alignItems:'center', justifyContent:'center' }}><I name="plus" size={18} color={th.ink3}/></div>
            <span style={{ fontSize:13 }}>Add widget</span>
            <span style={{ fontFamily:F.mono, fontSize:10, letterSpacing:'0.12em', color:th.ink4 }}>14 AVAILABLE</span>
          </div>
        )}
      </div>
      {customize && (
        <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:'18px 24px' }}>
          <Over color={th.ink3}>Widget library</Over>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:14 }}>
            {['Pipeline value','Team leaderboard','Upcoming closings','Income tracker','Trust & reconciliation','Next shoot','Follow-ups','Media in flight','MLS status','Lead sources','Goal tracker','Recent signings'].map(w=>(
              <div key={w} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 12px', border:`1px solid ${th.hair}`, borderRadius:2, fontSize:12.5, color:th.ink2 }}>
                <I name="plus" size={12} color={th.ink3}/>{w}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function DashWidget({ th, dark, title, span=2, customize, children }) {
  return (
    <div style={{ gridColumn:`span ${span}`, position:'relative', background:th.bg, border:`1px ${customize?'dashed':'solid'} ${customize?th.hairS:th.hair}`, borderRadius:2, padding:24 }}>
      {customize && <>
        <div style={{ position:'absolute', top:13, left:12, display:'grid', gridTemplateColumns:'repeat(2,3px)', gap:3, cursor:'grab' }}>
          {[0,1,2,3,4,5].map(i=><div key={i} style={{ width:3, height:3, borderRadius:999, background:th.ink4 }}/>)}
        </div>
        <div style={{ position:'absolute', top:10, right:10, width:22, height:22, borderRadius:2, border:`1px solid ${th.hair}`, display:'flex', alignItems:'center', justifyContent:'center' }}><I name="x" size={12} color={th.ink3}/></div>
      </>}
      <Over color={th.ink3} style={customize?{ marginLeft:16 }:{}}>{title}</Over>
      <div style={{ marginTop:16 }}>{children}</div>
    </div>
  );
}

function renderWidget(key, th, dark){
  switch(key){
    case 'volume':      return wVolume(th);
    case 'today':       return wToday(th);
    case 'pipeline':    return wPipeline(th);
    case 'leaderboard': return wLeaderboard(th);
    case 'trust':       return wTrust(th);
    case 'closings':    return wClosings(th, dark);
    case 'listings':    return wListings(th, dark);
    case 'income':      return wIncome(th);
    case 'nextshoot':   return wNextShoot(th);
    case 'followups':   return wFollowups(th);
    default:            return null;
  }
}

function wVolume(th){
  const spark=[3,5,4,7,6,9,8,11,10,13,12,15,14,17,18,16,20,22,24,22,26,28,30,32];
  const m=Math.max(...spark);
  const path=spark.map((v,i)=>`${i===0?'M':'L'}${(i/(spark.length-1))*560},${72-(v/m)*64}`).join(' ');
  return (<>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
      <div style={{ fontFamily:F.mono, fontSize:24, letterSpacing:-0.5 }}>184 <span style={{ color:th.ink3, fontSize:13 }}>jobs</span></div>
      <div style={{ display:'flex', gap:4 }}>{['7d','30d','90d'].map(p=><div key={p} style={{ padding:'4px 9px', fontSize:11, fontFamily:F.mono, color:p==='30d'?th.ink:th.ink3, background:p==='30d'?th.surf2:'transparent', border:`1px solid ${p==='30d'?th.hairS:'transparent'}`, borderRadius:2 }}>{p}</div>)}</div>
    </div>
    <svg viewBox="0 0 560 92" style={{ width:'100%', height:104, marginTop:14, display:'block' }}>
      <path d={path+' L560,92 L0,92 Z'} fill={T.brick} opacity="0.08"/>
      <path d={path} stroke={T.brick} strokeWidth="1.5" fill="none"/>
      <circle cx={560} cy={72-(32/m)*64} r="3" fill={T.brick}/>
    </svg>
    <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontFamily:F.mono, fontSize:10, color:th.ink4 }}><span>MAR 26</span><span>APR 02</span><span>APR 09</span><span>APR 16</span></div>
  </>);
}
function wToday(th){
  const rows=[['09:00','Pine Rd, 1902','A. Lindgren','ok'],['11:30','Mercer Loop, 30','J. Reyes','ok'],['14:30','Linden St, 214','J. Reyes','brick'],['16:00','Alder Ave, 77','S. Okafor · auto','ok']];
  return (<div style={{ display:'flex', flexDirection:'column' }}>
    {rows.map(([t,addr,v,tone])=>(
      <div key={t} style={{ display:'flex', alignItems:'baseline', gap:12, padding:'9px 0', borderBottom:`1px solid ${th.hair}` }}>
        <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink, width:42 }}>{t}</div>
        <div style={{ flex:1 }}><div style={{ fontSize:12.5 }}>{addr}</div><div style={{ fontSize:10.5, color: tone==='warn'?T.brickDeep:th.ink3, marginTop:2 }}>{v}</div></div>
        <div style={{ width:6, height:6, borderRadius:1, background: tone==='brick'?T.brick : tone==='warn'?T.warn : T.ok }}/>
      </div>
    ))}
  </div>);
}
function wPipeline(th){
  // Clean list — no bars. Stage, deal count, and value. Plus total for context.
  const rows=[['New',12,3.1],['Contacted',9,2.6],['Showing',6,1.9],['Offer',4,2.2],['Won · 30d',7,1.6]];
  const total=rows.reduce((a,r)=>a+r[2],0);
  return (<div style={{ display:'flex', flexDirection:'column' }}>
    {rows.map(([n,c,v])=>(
      <div key={n} style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${th.hair}` }}>
        <span style={{ fontSize:13 }}>{n}</span>
        <span style={{ display:'flex', alignItems:'baseline', gap:16 }}>
          <span style={{ fontFamily:F.mono, fontSize:11, color:th.ink4, width:56, textAlign:'right' }}>{c} deals</span>
          <span style={{ fontFamily:F.mono, fontSize:13, color:th.ink, width:52, textAlign:'right' }}>${v.toFixed(1)}M</span>
        </span>
      </div>
    ))}
    <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'12px 0 0' }}>
      <span style={{ fontSize:12, color:th.ink3 }}>Total pipeline</span>
      <span style={{ fontFamily:F.mono, fontSize:14, color:th.ink }}>${total.toFixed(1)}M</span>
    </div>
  </div>);
}
function wLeaderboard(th){
  // Clean list — no bars. Rank, agent, deal count, revenue.
  const rows=[['M. Ortega',34,16.2],['L. Park',28,13.5],['K. Haddad',21,10.2],['T. Winters',19,9.1]];
  return (<div style={{ display:'flex', flexDirection:'column' }}>
    {rows.map(([n,j,rev],i)=>(
      <div key={n} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom: i===rows.length-1?'none':`1px solid ${th.hair}` }}>
        <span style={{ fontFamily:F.mono, fontSize:11, color:th.ink4, width:12 }}>{i+1}</span>
        <div style={{ width:26, height:26, borderRadius:2, background:T.brickSoft, color:T.brickDeep, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600 }}>{n.split(' ').map(x=>x[0]).join('')}</div>
        <span style={{ flex:1, fontSize:12.5, fontWeight:500 }}>{n}</span>
        <span style={{ fontFamily:F.mono, fontSize:11, color:th.ink4, width:54, textAlign:'right' }}>{j} deals</span>
        <span style={{ fontFamily:F.mono, fontSize:13, width:56, textAlign:'right' }}>${rev.toFixed(1)}K</span>
      </div>
    ))}
  </div>);
}
function wTrust(th){
  return (<>
    <div style={{ fontFamily:F.mono, fontSize:30, letterSpacing:-0.8 }}>$96,500</div>
    <div style={{ fontSize:12, color:th.ink3, marginTop:4 }}>12 deposits held in trust</div>
    <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:th.surf2, borderRadius:2 }}>
      <div style={{ width:24, height:24, borderRadius:999, background:T.okTint, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><I name="chk" size={13} color={T.ok} sw={2.4}/></div>
      <span style={{ fontSize:12.5, color:th.ink2 }}>April reconciled · 0 exceptions</span>
    </div>
  </>);
}
function wClosings(th, dark){
  const rows=[['8 Riverbend','Apr 26','$1.28M','Firm','ok'],['201 Oak Dr','Apr 29','$910K','Financing','warn'],['55 Birch Way','May 02','$690K','Firm','ok']];
  return (<div style={{ display:'flex', flexDirection:'column' }}>
    {rows.map(([a,d,v,s,tone],i)=>(
      <div key={a} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom: i===rows.length-1?'none':`1px solid ${th.hair}` }}>
        <div style={{ fontFamily:F.mono, fontSize:11, color:th.ink3, width:46 }}>{d}</div>
        <div style={{ flex:1, fontSize:12.5, fontWeight:500 }}>{a}</div>
        <span style={{ fontFamily:F.mono, fontSize:12, marginRight:8 }}>{v}</span>
        <Pill tone={tone} dark={dark}>{s}</Pill>
      </div>
    ))}
  </div>);
}
function wListings(th, dark){
  const rows=[['214 Linden St','Media in edit','$1.15M','warn'],['77 Alder Ave','Shoot today · 16:00','$740K','brick'],['8 Riverbend','Delivered','$1.28M','ok'],['201 Oak Dr','Live on MLS','$910K','ok']];
  return (<div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
    {rows.map(([a,s,v,tone])=>(
      <div key={a} style={{ display:'flex', gap:12, alignItems:'center', padding:12, border:`1px solid ${th.hair}`, borderRadius:2 }}>
        <Img w={44} h={44} label="" dark={dark}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12.5, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a}</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8, gap:8 }}>
            <Pill tone={tone} dark={dark}>{s}</Pill>
            <span style={{ fontFamily:F.mono, fontSize:11.5 }}>{v}</span>
          </div>
        </div>
      </div>
    ))}
  </div>);
}
function wIncome(th){
  const bars=[0.5,0.62,0.55,0.7,0.82,0.9];
  return (<>
    <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
      <div style={{ fontFamily:F.mono, fontSize:30, letterSpacing:-0.8 }}>$214K</div>
      <div style={{ fontFamily:F.mono, fontSize:11, color:T.ok }}>82% to goal</div>
    </div>
    <div style={{ height:5, background:th.surf2, borderRadius:2, marginTop:12, overflow:'hidden' }}><div style={{ width:'82%', height:'100%', background:T.brick }}/></div>
    <div style={{ fontSize:11, color:th.ink4, marginTop:6, fontFamily:F.mono, letterSpacing:'0.1em' }}>GOAL $260K · YEAR-END</div>
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, marginTop:16, height:48 }}>
      {bars.map((b,i)=><div key={i} style={{ flex:1, height:`${b*100}%`, background: i===bars.length-1?T.brick:th.surf2, borderRadius:1 }}/>)}
    </div>
    <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontFamily:F.mono, fontSize:9, color:th.ink4 }}><span>NOV</span><span>APR</span></div>
  </>);
}
function wNextShoot(th){
  return (<div style={{ padding:16, background:T.ink, color:T.paper, borderRadius:2, position:'relative', overflow:'hidden' }}>
    <Over color="#F4D9CC">In 3 hours</Over>
    <div style={{ fontSize:18, fontWeight:500, marginTop:8, letterSpacing:-0.3 }}>214 Linden St</div>
    <div style={{ fontSize:11.5, color:'#C8BFB0', marginTop:4 }}>Today · 14:30 · J. Reyes</div>
    <div style={{ display:'flex', gap:8, marginTop:14 }}>
      <div style={{ padding:'7px 10px', border:'1px solid #F4F1EB26', borderRadius:2, fontSize:10.5, fontFamily:F.mono, letterSpacing:'0.1em' }}>VIEW JOB</div>
      <div style={{ padding:'7px 10px', border:'1px solid #F4F1EB26', borderRadius:2, fontSize:10.5, fontFamily:F.mono, letterSpacing:'0.1em' }}>MESSAGE</div>
    </div>
    <BrickMark size={72} color="#F4D9CC0F" style={{ position:'absolute', right:-8, top:-8 }}/>
  </div>);
}
function wFollowups(th){
  const t=[['Call J. Delgado — showing feedback',false],['Send APS · 8 Riverbend',false],['Upload staging photos · 77 Alder',true],['Confirm inspection · 201 Oak',false]];
  return (<div style={{ display:'flex', flexDirection:'column', gap:2 }}>
    {t.map(([l,done])=>(
      <div key={l} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:`1px solid ${th.hair}` }}>
        <div style={{ width:18, height:18, borderRadius:2, border:`1.5px solid ${done?T.brick:th.hairS}`, background:done?T.brick:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{done&&<I name="chk" size={11} color="#fff" sw={2.5}/>}</div>
        <span style={{ fontSize:12.5, color:done?th.ink3:th.ink, textDecoration:done?'line-through':'none' }}>{l}</span>
      </div>
    ))}
  </div>);
}

// Brokerage — web shell with all screens. dark toggle support.
function BrokShell({ dark=false, screen='overview', role='brokerage', customize=false, locked=false }) {
  const th = useTheme(dark);
  const [cur, setCur] = React.useState(screen);
  const RC = BROK_ROLES[role] || BROK_ROLES.brokerage;
  const NAV = RC.nav;
  return (
    <div style={{ width:1440, height:920, background:th.bg, color:th.ink, fontFamily:F.display, display:'flex', overflow:'hidden' }}>
      <aside style={{ width:232, borderRight:`1px solid ${th.hair}`, padding:'24px 0', display:'flex', flexDirection:'column', background:th.bg }}>
        <div style={{ padding:'4px 24px 28px' }}><Wordmark size={17} color={th.ink}/></div>
        <div style={{ padding:'0 16px 10px' }}>
          <Over color={th.ink4}>Workspace</Over>
          <div style={{ marginTop:10, padding:'12px 14px', border:`1px solid ${th.hair}`, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>{RC.wsNm}</div>
              <div style={{ fontSize:11, color:th.ink3, marginTop:2 }}>{RC.wsMeta}</div>
            </div>
            <I name="cD" size={14} color={th.ink3}/>
          </div>
        </div>
        <div style={{ padding:'14px 12px', display:'flex', flexDirection:'column', gap:1 }}>
          {NAV.map((grp, gi) => (
            <React.Fragment key={gi}>
              {grp.group && <div style={{ padding:'16px 14px 6px' }}><Over color={th.ink4} style={{ fontSize:9.5 }}>{grp.group}</Over></div>}
              {grp.items.map(([ic,lb,k]) => {
                const on = k === cur;
                return (
                  <div key={k} role={locked ? undefined : "button"} tabIndex={locked ? undefined : 0} onClick={locked ? undefined : () => setCur(k)} onKeyDown={locked ? undefined : (e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); setCur(k); } }} style={{
                    display:'flex', alignItems:'center', gap:12, padding:'9px 14px', borderRadius:2,
                    background: on ? th.surf2 : 'transparent',
                    color: on ? th.ink : th.ink3,
                    fontSize:13.5, fontWeight: on ? 500 : 400, position:'relative',
                    cursor: locked ? 'default' : 'pointer',
                  }}>
                    {on && <div style={{ position:'absolute', left:0, top:9, bottom:9, width:2, background:T.brick }}/>}
                    <I name={ic} size={16} color={on ? th.ink : th.ink3}/>{lb}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop:'auto', padding:'16px 20px', borderTop:`1px solid ${th.hair}`, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:2, background:T.brickSoft, color:T.brickDeep, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600 }}>{RC.ini}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:500 }}>{RC.who}</div>
            <div style={{ fontSize:11, color:th.ink3 }}>{RC.role}</div>
          </div>
          <div onClick={locked ? undefined : () => setCur('settings')} style={{ cursor: locked ? 'default' : 'pointer', display:'flex' }}><I name="cog" size={15} color={th.ink3}/></div>
        </div>
      </aside>
      <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'auto' }}>
        <TopBar th={th} screen={cur}/>
        <div style={{ padding:'32px 36px', display:'flex', flexDirection:'column', gap:28 }}>
          {cur === 'overview'    && <OverviewContent     th={th} dark={dark} role={role} customize={customize}/>}
          {cur === 'crm'         && <CRMContent          th={th} dark={dark}/>}
          {cur === 'transactions'&& <TransactionsContent th={th} dark={dark}/>}
          {cur === 'mls'         && <MLSContent          th={th} dark={dark}/>}
          {cur === 'forms'       && <FormsContent        th={th} dark={dark}/>}
          {cur === 'jobs'        && <JobsContent         th={th} dark={dark}/>}
          {cur === 'jobdetail'   && <JobDetailContent    th={th} dark={dark}/>}
          {cur === 'vendors'     && <VendorsContent      th={th} dark={dark}/>}
          {cur === 'accounting'  && <AccountingContent   th={th} dark={dark}/>}
          {cur === 'billing'     && <BillingContent      th={th} dark={dark}/>}
          {cur === 'agents'      && <AgentsContent       th={th} dark={dark}/>}
          {cur === 'settings'    && <SettingsContent     th={th} dark={dark}/>}
        </div>
      </main>
    </div>
  );
}

function TopBar({ th, screen }) {
  const titles = { overview:'Overview', crm:'CRM', transactions:'Transactions', mls:'MLS submission', forms:'Forms & e-signatures', jobs:'Jobs', jobdetail:'Job · #08412', agents:'Agents', vendors:'Vendors', accounting:'Accounting', billing:'Billing', settings:'Settings' };
  return (
    <div style={{ height:64, borderBottom:`1px solid ${th.hair}`, display:'flex', alignItems:'center', padding:'0 36px', gap:16 }}>
      <Over color={th.ink4}>{titles[screen]}</Over>
      <div style={{ width:1, height:16, background:th.hair }}/>
      <div style={{ fontSize:13, color:th.ink2 }}>April 1 — 18, 2026</div>
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 12px', border:`1px solid ${th.hair}`, borderRadius:2, fontSize:12, color:th.ink3, width:220 }}>
          <I name="srch" size={14} color={th.ink3}/><span>Search jobs, agents…</span>
          <span style={{ marginLeft:'auto', fontFamily:F.mono, fontSize:10, color:th.ink4 }}>⌘K</span>
        </div>
        <I name="bell" size={17} color={th.ink3}/>
      </div>
    </div>
  );
}

// ─── OVERVIEW ───
function OverviewContent({ th, dark, role='brokerage', customize=false }) {
  // Every role — brokerage, team, solo — renders the same customizable widget dashboard.
  return <DashRole th={th} dark={dark} role={role} customize={customize}/>;
}

function JobsTable({ th, dark, jobs }) {
  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'100px 1.6fr 1fr 1fr 1fr 140px 120px', padding:'10px 24px', borderBottom:`1px solid ${th.hair}`, fontFamily:F.mono, fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:th.ink4 }}>
        <div>Job</div><div>Property</div><div>Agent</div><div>Vendor</div><div>When</div><div>Status</div><div style={{ textAlign:'right' }}>Amount</div>
      </div>
      {jobs.map((j,i)=>(
        <div key={j.id} style={{ display:'grid', gridTemplateColumns:'100px 1.6fr 1fr 1fr 1fr 140px 120px', padding:'16px 24px', borderBottom: i===jobs.length-1?'none':`1px solid ${th.hair}`, fontSize:13, color:th.ink, alignItems:'center' }}>
          <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink3 }}>#{j.id}</div>
          <div><div>{j.addr}</div><div style={{ fontSize:11, color:th.ink3, marginTop:2 }}>{j.type}</div></div>
          <div style={{ color:th.ink2 }}>{j.agent}</div>
          <div style={{ color:th.ink2 }}>{j.vendor}</div>
          <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink2 }}>{j.when}</div>
          <div><Pill tone={j.tone} dark={dark}>{j.status}</Pill></div>
          <div style={{ textAlign:'right', fontFamily:F.mono, fontSize:13 }}>{j.amt}</div>
        </div>
      ))}
    </>
  );
}



// Brokerage — remaining screens (Jobs, Job Detail, Agents, Vendors, Billing, Settings, Login)

function JobsContent({ th, dark }) {
  const jobs = [
    { id:'08412', addr:'214 Linden St', type:'House',      agent:'M. Ortega',  vendor:'J. Reyes',    when:'Today · 14:30', status:'In progress', tone:'brick',   amt:'$749' },
    { id:'08411', addr:'77 Alder Ave',  type:'Condo',      agent:'L. Park',    vendor:'S. Okafor',   when:'Today · 16:00', status:'Scheduled',   tone:'neutral', amt:'$379' },
    { id:'08410', addr:'1902 Pine Rd',  type:'House',      agent:'K. Haddad',  vendor:'A. Lindgren', when:'Today · 09:00', status:'Editing',     tone:'warn',    amt:'$599' },
    { id:'08409', addr:'30 Mercer Loop',type:'Townhouse',  agent:'T. Winters', vendor:'J. Reyes',    when:'Yesterday',     status:'Delivered',   tone:'ok',      amt:'$749' },
    { id:'08408', addr:'8 Riverbend',   type:'House',      agent:'N. Obayemi', vendor:'A. Lindgren', when:'Yesterday',     status:'Delivered',   tone:'ok',      amt:'$1,199' },
    { id:'08407', addr:'55 Birch Way',  type:'Condo',      agent:'M. Ortega',  vendor:'S. Okafor',   when:'2 days ago',    status:'Delivered',   tone:'ok',      amt:'$379' },
    { id:'08406', addr:'112 Ash Ct',    type:'House',      agent:'L. Park',    vendor:'A. Lindgren', when:'Apr 14',        status:'Delivered',   tone:'ok',      amt:'$599' },
    { id:'08405', addr:'9 Harbor Way',  type:'Condo',      agent:'T. Winters', vendor:'S. Okafor',   when:'Apr 14',        status:'Delivered',   tone:'ok',      amt:'$379' },
    { id:'08404', addr:'201 Oak Dr',    type:'House',      agent:'K. Haddad',  vendor:'J. Reyes',    when:'Apr 13',        status:'Delivered',   tone:'ok',      amt:'$749' },
  ];
  return (
    <>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:30, fontWeight:500, letterSpacing:-1 }}>Jobs</div>
          <div style={{ fontSize:13, color:th.ink2, marginTop:4 }}>184 this month · 12 today</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn variant="ghost" dark={dark} icon="sliders">Filter</Btn>
          <Btn variant="primary" dark={dark} icon="plus">New job</Btn>
        </div>
      </div>
      <div style={{ display:'flex', gap:4, borderBottom:`1px solid ${th.hair}` }}>
        {['All (184)','Scheduled (23)','In progress (8)','Editing (14)','Delivered (139)'].map((x,i) => (
          <div key={x} style={{ padding:'12px 14px', fontSize:13, color:i===0?th.ink:th.ink3, borderBottom:`2px solid ${i===0?T.brick:'transparent'}`, marginBottom:-1 }}>{x}</div>
        ))}
      </div>
      <div style={{ border:`1px solid ${th.hair}`, borderRadius:2 }}>
        <JobsTable th={th} dark={dark} jobs={jobs}/>
      </div>
    </>
  );
}

function JobDetailContent({ th, dark }) {
  return (
    <>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
            <Over color={th.ink4}>Jobs → #08412</Over>
            <Pill tone="brick" dark={dark}>In progress</Pill>
          </div>
          <div style={{ fontSize:30, fontWeight:500, letterSpacing:-1 }}>214 Linden St</div>
          <div style={{ fontSize:13, color:th.ink2, marginTop:4 }}>Toronto, ON · House · 2,140 sqft</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Btn variant="ghost" dark={dark} icon="dl">Download assets</Btn>
          <Btn variant="primary" dark={dark}>Message vendor</Btn>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:28 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:1, background:th.hair, border:`1px solid ${th.hair}`, borderRadius:2 }}>
          <div style={{ background:th.bg, padding:0 }}>
            <Img w="100%" h={320} label="PROPERTY HERO — LINDEN ST" dark={dark} r={0}/>
          </div>
          <div style={{ background:th.bg, padding:28 }}>
            <Over color={th.ink3}>Timeline</Over>
            <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:0 }}>
              {[
                ['Booked', 'Apr 16 · 10:04', 'M. Ortega booked Premium package', true],
                ['Scheduled', 'Apr 17 · 09:12', 'J. Reyes assigned · 14:30 arrival', true],
                ['Shooting', 'Apr 18 · 14:30', 'Vendor on site', true],
                ['Editing', '—', 'Queued for 24h turnaround', false],
                ['Delivered', '—', '—', false],
              ].map(([t, when, detail, done], i) => (
                <div key={t} style={{ display:'flex', gap:16, paddingBottom:20, position:'relative' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ width:10, height:10, borderRadius:999, background: done ? T.brick : th.surf2, border:`1.5px solid ${done ? T.brick : th.hairS}` }}/>
                    {i < 4 && <div style={{ width:1, flex:1, background:th.hair, marginTop:4 }}/>}
                  </div>
                  <div style={{ paddingBottom:4 }}>
                    <div style={{ fontSize:14, fontWeight:500, color: done ? th.ink : th.ink3 }}>{t}</div>
                    <div style={{ fontFamily:F.mono, fontSize:11, color:th.ink4, marginTop:2 }}>{when}</div>
                    <div style={{ fontSize:13, color:th.ink2, marginTop:6 }}>{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24 }}>
            <Over color={th.ink3}>Package</Over>
            <div style={{ fontSize:20, fontWeight:500, marginTop:10, letterSpacing:-0.3 }}>Premium · $749</div>
            <div style={{ fontSize:12, color:th.ink3, marginTop:6 }}>40 photos · Drone · 60-sec reel · Floor plan</div>
          </div>
          <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24 }}>
            <Over color={th.ink3}>People</Over>
            <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:14 }}>
              {[
                ['M. Ortega', 'Agent', 'EA'],
                ['J. Reyes',  'Vendor', 'JR'],
                ['Studio North', 'Brokerage', 'HR'],
              ].map(([n,r,in2]) => (
                <div key={n} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:2, background:T.brickSoft, color:T.brickDeep, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>{in2}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{n}</div>
                    <div style={{ fontSize:11, color:th.ink3 }}>{r}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24 }}>
            <Over color={th.ink3}>Deliverables</Over>
            <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:10 }}>
              {[['Photos', '0 / 40', false],['Drone', '0 / 5', false],['Reel', 'Pending', false],['Floor plan', 'Pending', false]].map(([n,v,done]) => (
                <div key={n} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${th.hair}` }}>
                  <span style={{ fontSize:13 }}>{n}</span>
                  <span style={{ fontFamily:F.mono, fontSize:12, color:th.ink3 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AgentsContent({ th, dark }) {
  const agents = [
    ['M. Ortega',   'ortega@harbor.co',     34, '$16,240', 'Active'],
    ['L. Park',     'park@harbor.co',       28, '$13,480', 'Active'],
    ['K. Haddad',   'haddad@harbor.co',     21, '$10,240', 'Active'],
    ['T. Winters',  'winters@harbor.co',    19, '$9,120',  'Active'],
    ['N. Obayemi',  'obayemi@harbor.co',    17, '$8,400',  'Active'],
    ['R. Shimizu',  'shimizu@harbor.co',    14, '$6,720',  'Active'],
    ['P. Alvarez',  'alvarez@harbor.co',    9,  '$4,320',  'Paused'],
  ];
  return (
    <>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div><div style={{ fontSize:30, fontWeight:500, letterSpacing:-1 }}>Agents</div><div style={{ fontSize:13, color:th.ink2, marginTop:4 }}>47 active · 3 invited</div></div>
        <div style={{ display:'flex', gap:10 }}><Btn variant="ghost" dark={dark}>Invite link</Btn><Btn variant="primary" dark={dark} icon="plus">Add agent</Btn></div>
      </div>
      <div style={{ border:`1px solid ${th.hair}`, borderRadius:2 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 140px 60px', padding:'10px 24px', borderBottom:`1px solid ${th.hair}`, fontFamily:F.mono, fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:th.ink4 }}>
          <div>Name</div><div>Email</div><div>Jobs · 30d</div><div>Revenue</div><div>Status</div><div/>
        </div>
        {agents.map(([n,e,j,r,s],i) => (
          <div key={n} style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 140px 60px', padding:'16px 24px', borderBottom: i===agents.length-1?'none':`1px solid ${th.hair}`, fontSize:13, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:28, height:28, borderRadius:2, background:T.brickSoft, color:T.brickDeep, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600 }}>{n.split(' ').map(x=>x[0]).join('')}</div>
              <span style={{ fontWeight:500 }}>{n}</span>
            </div>
            <div style={{ color:th.ink3, fontFamily:F.mono, fontSize:12 }}>{e}</div>
            <div style={{ fontFamily:F.mono, fontSize:13 }}>{j}</div>
            <div style={{ fontFamily:F.mono, fontSize:13 }}>{r}</div>
            <div><Pill tone={s==='Active'?'ok':'neutral'} dark={dark}>{s}</Pill></div>
            <div style={{ textAlign:'right' }}><I name="dots" size={16} color={th.ink3}/></div>
          </div>
        ))}
      </div>
    </>
  );
}

function VendorsContent({ th, dark }) {
  const vendors = [
    ['J. Reyes',     'Photography + drone',  64, 4.9, '$28,400'],
    ['A. Lindgren',  'Photography + reel',   48, 4.8, '$21,600'],
    ['S. Okafor',    'Photography',          41, 4.9, '$16,400'],
    ['D. Cheng',     'Drone specialist',     22, 4.7, '$8,800'],
    ['M. Weston',    'Reel + editing',       18, 4.8, '$7,200'],
  ];
  return (
    <>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div><div style={{ fontSize:30, fontWeight:500, letterSpacing:-1 }}>Vendors</div><div style={{ fontSize:13, color:th.ink2, marginTop:4 }}>5 active vendors</div></div>
        <Btn variant="primary" dark={dark} icon="plus">Invite vendor</Btn>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:20 }}>
        {vendors.map(([n,role,j,r,rev]) => (
          <div key={n} style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24, display:'flex', gap:18 }}>
            <div style={{ width:52, height:52, borderRadius:2, background:T.brickSoft, color:T.brickDeep, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:600 }}>{n.split(' ').map(x=>x[0]).join('')}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:500 }}>{n}</div>
              <div style={{ fontSize:12, color:th.ink3, marginTop:2 }}>{role}</div>
              <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:th.hair, border:`1px solid ${th.hair}`, borderRadius:2 }}>
                {[['JOBS · 30d', j],['RATING', r.toString()],['REVENUE', rev]].map(([l,v]) => (
                  <div key={l} style={{ background:th.bg, padding:'10px 12px' }}>
                    <div style={{ fontFamily:F.mono, fontSize:9, letterSpacing:'0.14em', color:th.ink4 }}>{l}</div>
                    <div style={{ fontFamily:F.mono, fontSize:15, marginTop:4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function BillingContent({ th, dark }) {
  const invoices = [
    ['INV–1042', 'Apr 15, 2026', '$12,480', 'Paid',    'ok'],
    ['INV–1041', 'Apr 08, 2026', '$9,320',  'Paid',    'ok'],
    ['INV–1040', 'Apr 01, 2026', '$14,120', 'Paid',    'ok'],
    ['INV–1039', 'Mar 24, 2026', '$11,600', 'Pending', 'warn'],
    ['INV–1038', 'Mar 17, 2026', '$8,240',  'Paid',    'ok'],
  ];
  return (
    <>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div><div style={{ fontSize:30, fontWeight:500, letterSpacing:-1 }}>Billing</div><div style={{ fontSize:13, color:th.ink2, marginTop:4 }}>April cycle · closes Apr 30</div></div>
        <Btn variant="ghost" dark={dark} icon="dl">Export statement</Btn>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:th.hair, border:`1px solid ${th.hair}`, borderRadius:2 }}>
        {[['CURRENT BALANCE','$11,600'],['PAID · APRIL','$35,920'],['NEXT CHARGE','Apr 30']].map(([l,v]) => (
          <div key={l} style={{ background:th.bg, padding:'24px 24px 22px' }}>
            <Over color={th.ink3}>{l}</Over>
            <div style={{ fontFamily:F.mono, fontSize:32, letterSpacing:-0.8, marginTop:14, color:th.ink, lineHeight:1 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:28 }}>
        <div style={{ border:`1px solid ${th.hair}`, borderRadius:2 }}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid ${th.hair}` }}>
            <Over color={th.ink3}>Invoices</Over>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 120px 60px', padding:'10px 24px', borderBottom:`1px solid ${th.hair}`, fontFamily:F.mono, fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:th.ink4 }}>
            <div>Invoice</div><div>Date</div><div style={{ textAlign:'right' }}>Amount</div><div>Status</div><div/>
          </div>
          {invoices.map(([id,d,a,s,tone],i) => (
            <div key={id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 120px 60px', padding:'14px 24px', borderBottom: i===invoices.length-1?'none':`1px solid ${th.hair}`, fontSize:13, alignItems:'center' }}>
              <div style={{ fontFamily:F.mono }}>{id}</div>
              <div style={{ color:th.ink3 }}>{d}</div>
              <div style={{ textAlign:'right', fontFamily:F.mono }}>{a}</div>
              <div><Pill tone={tone} dark={dark}>{s}</Pill></div>
              <div style={{ textAlign:'right' }}><I name="dl" size={14} color={th.ink3}/></div>
            </div>
          ))}
        </div>
        <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24 }}>
          <Over color={th.ink3}>Payment method</Over>
          <div style={{ marginTop:14, padding:18, background:th.surf2, borderRadius:2 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <I name="cards" size={18} color={th.ink2}/>
              <span style={{ fontFamily:F.mono, fontSize:13 }}>•••• 4242</span>
            </div>
            <div style={{ fontSize:11, color:th.ink3, marginTop:6 }}>Expires 08 / 28 · Visa</div>
          </div>
          <Btn variant="ghost" dark={dark} full style={{ marginTop:14 }}>Update card</Btn>
        </div>
      </div>
    </>
  );
}

function SettingsContent({ th, dark }) {
  const sections = [
    ['Brokerage', [['Name','Studio North'],['Domain','harbor.co'],['Time zone','America / Toronto']]],
    ['Defaults',  [['Default package','Standard · $379'],['Turnaround SLA','24 hours'],['Auto-assign vendor','On · nearest']]],
    ['Notifications', [['New booking','Email + push'],['Delivery ready','Email'],['Weekly digest','Monday 8:00']]],
  ];
  return (
    <>
      <div><div style={{ fontSize:30, fontWeight:500, letterSpacing:-1 }}>Settings</div><div style={{ fontSize:13, color:th.ink2, marginTop:4 }}>Brokerage · team · preferences</div></div>
      {sections.map(([title, rows]) => (
        <div key={title} style={{ border:`1px solid ${th.hair}`, borderRadius:2 }}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid ${th.hair}` }}>
            <Over color={th.ink3}>{title}</Over>
          </div>
          {rows.map(([l,v],i) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'18px 24px', borderBottom: i===rows.length-1?'none':`1px solid ${th.hair}`, alignItems:'center' }}>
              <span style={{ fontSize:14 }}>{l}</span>
              <span style={{ display:'flex', alignItems:'center', gap:10, color:th.ink2, fontSize:13 }}>{v} <I name="cR" size={14} color={th.ink3}/></span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// ─── SHARED · KPI strip for OS modules ───
function KpiRow({ th, items }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${items.length},1fr)`, gap:1, background:th.hair, border:`1px solid ${th.hair}`, borderRadius:2 }}>
      {items.map((k,i)=>(
        <div key={i} style={{ background:th.bg, padding:'22px 24px 20px' }}>
          <Over color={th.ink3}>{k.l}</Over>
          <div style={{ fontFamily:F.mono, fontSize:32, letterSpacing:-0.9, marginTop:12, color:th.ink, lineHeight:1 }}>{k.v}</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12 }}>
            {k.d && <span style={{ fontSize:12, color: k.down?T.bad:T.ok, fontFamily:F.mono, display:'inline-flex', alignItems:'center', gap:4 }}>
              <I name={k.down?'arrD':'arrU'} size={11} color={k.down?T.bad:T.ok}/>{k.d}
            </span>}
            <span style={{ fontSize:11, color:th.ink4 }}>{k.s}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
function ModHead({ th, dark, title, sub, actions }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
      <div>
        <div style={{ fontSize:30, fontWeight:500, letterSpacing:-1 }}>{title}</div>
        <div style={{ fontSize:13, color:th.ink2, marginTop:4 }}>{sub}</div>
      </div>
      {actions && <div style={{ display:'flex', gap:10 }}>{actions}</div>}
    </div>
  );
}

// ─── CRM · pipeline board ───
function CRMContent({ th, dark }) {
  const kpis = [
    { l:'New leads · 30d', v:'38',     d:'+9',    s:'vs 29 prev.' },
    { l:'Pipeline value',  v:'$14.2M', d:'+6.1%', s:'48 active deals' },
    { l:'Win rate',        v:'32%',    d:'+3pt',  s:'last 90 days' },
    { l:'Days to close',   v:'41',     d:'−5',    s:'offer → firm' },
  ];
  const cols = [
    { name:'New',        dot:th.ink4,   count:3, sum:'$2.8M', cards:[
      ['Priya Nair','92 Rowan Cres','$1.24M','2d','New lead','brick'],
      ['The Okonkwos','15 Cedar Pt','$860K','1d','Web form','neutral'],
      ['D. Michaux','410 Queen W','$720K','4h','Referral','neutral'],
    ]},
    { name:'Contacted',  dot:T.warn,    count:2, sum:'$2.6M', cards:[
      ['R. & S. Bhatt','88 Maple Grove','$1.60M','5d','Call booked','warn'],
      ['Lena Poirier','7 Birchway','$980K','3d','Nurture','neutral'],
    ]},
    { name:'Showing',    dot:T.brick,   count:2, sum:'$1.9M', cards:[
      ['J. Delgado','214 Linden St','$1.15M','6d','2nd showing','brick'],
      ['A. Fournier','30 Mercer Loop','$740K','2d','Booked Sat','neutral'],
    ]},
    { name:'Offer',      dot:'#3E6DA6', count:2, sum:'$2.2M', cards:[
      ['M. Ortega','8 Riverbend','$1.28M','1d','Reviewing','warn'],
      ['K. Haddad','201 Oak Dr','$910K','3d','Countered','warn'],
    ]},
    { name:'Won · 30d',  dot:T.ok,      count:2, sum:'$1.6M', cards:[
      ['T. Winters','55 Birch Way','$690K','—','Firm','ok'],
      ['N. Obayemi','112 Ash Ct','$905K','—','Closed','ok'],
    ]},
  ];
  return (
    <>
      <ModHead th={th} dark={dark} title="CRM" sub="312 contacts · 48 active deals · 9 follow-ups due today"
        actions={<><Btn variant="ghost" dark={dark} icon="sliders">Segment</Btn><Btn variant="primary" dark={dark} icon="plus">Add contact</Btn></>}/>
      <KpiRow th={th} items={kpis}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:1, background:th.hair, border:`1px solid ${th.hair}`, borderRadius:2 }}>
        {cols.map(col => (
          <div key={col.name} style={{ background:th.bg, padding:'16px 14px', display:'flex', flexDirection:'column', gap:12, minHeight:420 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:7, height:7, borderRadius:1, background:col.dot }}/>
                <span style={{ fontSize:12.5, fontWeight:500 }}>{col.name}</span>
                <span style={{ fontFamily:F.mono, fontSize:11, color:th.ink4 }}>{col.count}</span>
              </div>
              <span style={{ fontFamily:F.mono, fontSize:11, color:th.ink3 }}>{col.sum}</span>
            </div>
            {col.cards.map(([n,addr,val,age,tag,tone]) => (
              <div key={n+addr} style={{ padding:14, border:`1px solid ${th.hair}`, borderRadius:2, background:th.bg }}>
                <div style={{ fontSize:13, fontWeight:500 }}>{n}</div>
                <div style={{ fontSize:11.5, color:th.ink3, marginTop:3 }}>{addr}</div>
                <div style={{ fontFamily:F.mono, fontSize:14, marginTop:10, color:th.ink }}>{val}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12 }}>
                  <Pill tone={tone} dark={dark}>{tag}</Pill>
                  <span style={{ fontFamily:F.mono, fontSize:10, color:th.ink4, display:'inline-flex', alignItems:'center', gap:4 }}><I name="clk" size={10} color={th.ink4}/>{age}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── TRANSACTIONS · deal register + milestone rail ───
function TransactionsContent({ th, dark }) {
  const kpis = [
    { l:'Closing this week', v:'6',      d:null,   s:'$5.9M volume' },
    { l:'GCI in escrow',     v:'$214K',  d:'+8.2%',s:'across 48 deals' },
    { l:'Conditions pending',v:'12',     d:null,   s:'4 due ≤ 48h', down:true },
    { l:'Docs to sign',      v:'9',      d:null,   s:'3 buyers waiting' },
  ];
  const deals = [
    ['214 Linden St','J. Delgado','Listing','$1.15M','Apr 24','2 pending','Conditional','warn'],
    ['8 Riverbend','M. Ortega','Buyer','$1.28M','Apr 26','Firm','Firm','ok'],
    ['201 Oak Dr','K. Haddad','Listing','$910K','Apr 29','Financing','Conditional','warn'],
    ['55 Birch Way','T. Winters','Buyer','$690K','May 02','Firm','Firm','ok'],
    ['30 Mercer Loop','A. Fournier','Listing','$740K','May 06','Inspection','Conditional','warn'],
    ['112 Ash Ct','N. Obayemi','Buyer','$905K','May 09','—','Closed','ok'],
  ];
  const timeline = [
    ['Listed','Apr 02','Live on TRREB · MLS #C7841902', true],
    ['Offer accepted','Apr 17','$1.15M · 3 conditions', true],
    ['Conditions','Apr 24','Financing + inspection pending', 'now'],
    ['Firm & binding','—','All conditions waived', false],
    ['Close','May 24','Keys + funds released', false],
  ];
  return (
    <>
      <ModHead th={th} dark={dark} title="Transactions" sub="48 open · 6 closing this week · listing to close in one timeline"
        actions={<><Btn variant="ghost" dark={dark} icon="sliders">Filter</Btn><Btn variant="primary" dark={dark} icon="plus">New deal</Btn></>}/>
      <KpiRow th={th} items={kpis}/>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:28 }}>
        <div style={{ border:`1px solid ${th.hair}`, borderRadius:2 }}>
          <div style={{ padding:'16px 24px', borderBottom:`1px solid ${th.hair}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Over color={th.ink3}>Open deals</Over>
            <div style={{ display:'flex', gap:2 }}>
              {['All','Conditional','Firm','Closed'].map((x,i)=>(
                <div key={x} style={{ padding:'6px 12px', fontSize:12, color:i===0?th.ink:th.ink3, background:i===0?th.surf2:'transparent', borderRadius:2 }}>{x}</div>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 0.8fr 1fr 0.8fr 130px', padding:'10px 24px', borderBottom:`1px solid ${th.hair}`, fontFamily:F.mono, fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:th.ink4 }}>
            <div>Property</div><div>Client</div><div>Side</div><div>Price</div><div>Close</div><div>Status</div>
          </div>
          {deals.map((d,i)=>(
            <div key={d[0]} style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 0.8fr 1fr 0.8fr 130px', padding:'15px 24px', borderBottom: i===deals.length-1?'none':`1px solid ${th.hair}`, fontSize:13, alignItems:'center' }}>
              <div><div style={{ fontWeight:500 }}>{d[0]}</div><div style={{ fontSize:11, color:th.ink4, marginTop:2 }}>{d[5]}</div></div>
              <div style={{ color:th.ink2 }}>{d[1]}</div>
              <div style={{ color:th.ink3, fontFamily:F.mono, fontSize:11 }}>{d[2]}</div>
              <div style={{ fontFamily:F.mono, fontSize:13 }}>{d[3]}</div>
              <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink2 }}>{d[4]}</div>
              <div><Pill tone={d[7]} dark={dark}>{d[6]}</Pill></div>
            </div>
          ))}
        </div>
        <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24, alignSelf:'start' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Over color={th.ink3}>214 Linden St</Over>
            <Pill tone="warn" dark={dark}>Conditional</Pill>
          </div>
          <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink4, marginTop:8 }}>MLS #C7841902 · $1.15M</div>
          <div style={{ marginTop:20 }}>
            {timeline.map(([t,when,detail,state],i)=>{
              const done = state===true, now = state==='now';
              return (
                <div key={t} style={{ display:'flex', gap:14, paddingBottom: i===timeline.length-1?0:18 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ width:11, height:11, borderRadius:999, background: done?T.brick : now?T.paper : th.surf2, border:`1.5px solid ${done||now?T.brick:th.hairS}`, boxShadow: now?`0 0 0 3px ${T.brickTint}`:'none' }}/>
                    {i<timeline.length-1 && <div style={{ width:1, flex:1, minHeight:24, background: done?T.brick:th.hair, marginTop:3 }}/>}
                  </div>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:500, color: done||now?th.ink:th.ink3 }}>{t}</div>
                    <div style={{ fontFamily:F.mono, fontSize:10.5, color:th.ink4, marginTop:2 }}>{when}</div>
                    <div style={{ fontSize:12, color:th.ink2, marginTop:5 }}>{detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Btn variant="ghost" dark={dark} full icon="arr" style={{ marginTop:20 }}>Open deal</Btn>
        </div>
      </div>
    </>
  );
}

// ─── MLS SUBMISSION · queue + validation ───
function MLSContent({ th, dark }) {
  const kpis = [
    { l:'Submitted · 30d', v:'52',  d:'+11', s:'zero re-keying' },
    { l:'Live listings',   v:'34',  d:null,  s:'across 3 boards' },
    { l:'Validation errors',v:'1',  d:null,  s:'needs a fix', down:true },
    { l:'Avg. time to live',v:'26m', d:'−12m',s:'submit → active' },
  ];
  const queue = [
    ['214 Linden St','TRREB','C7841902','28 / 28','Live','ok'],
    ['8 Riverbend','TRREB','C7841880','28 / 28','Submitted','brick'],
    ['201 Oak Dr','Pillar 9','A2094117','27 / 28','Validated','neutral'],
    ['30 Mercer Loop','TRREB','—','25 / 28','Draft','warn'],
    ['9 Harbor Way','CREA DDF','X8820431','28 / 28','Live','ok'],
  ];
  const checks = [
    ['Address & PIN','Matched to GeoWarehouse', true],
    ['Room dimensions','12 rooms measured', true],
    ['Photos ≥ 6','40 attached', true],
    ['Commission to co-op','2.5% specified', true],
    ['Inclusions text','Missing — add before submit', false],
  ];
  return (
    <>
      <ModHead th={th} dark={dark} title="MLS submission" sub="TRREB · Pillar 9 · CREA DDF — board-ready packages from the data you already entered"
        actions={<><Btn variant="ghost" dark={dark}>Board settings</Btn><Btn variant="primary" dark={dark} icon="up">New submission</Btn></>}/>
      <KpiRow th={th} items={kpis}/>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:28 }}>
        <div style={{ border:`1px solid ${th.hair}`, borderRadius:2 }}>
          <div style={{ padding:'16px 24px', borderBottom:`1px solid ${th.hair}` }}><Over color={th.ink3}>Submission queue</Over></div>
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 0.9fr 130px', padding:'10px 24px', borderBottom:`1px solid ${th.hair}`, fontFamily:F.mono, fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:th.ink4 }}>
            <div>Property</div><div>Board</div><div>MLS #</div><div>Fields</div><div>Status</div>
          </div>
          {queue.map((q,i)=>(
            <div key={q[0]} style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 0.9fr 130px', padding:'15px 24px', borderBottom: i===queue.length-1?'none':`1px solid ${th.hair}`, fontSize:13, alignItems:'center' }}>
              <div style={{ fontWeight:500 }}>{q[0]}</div>
              <div style={{ color:th.ink2 }}>{q[1]}</div>
              <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink3 }}>{q[2]}</div>
              <div style={{ fontFamily:F.mono, fontSize:12, color: q[3].startsWith('28')?th.ink2:T.warn }}>{q[3]}</div>
              <div><Pill tone={q[5]} dark={dark}>{q[4]}</Pill></div>
            </div>
          ))}
        </div>
        <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24, alignSelf:'start' }}>
          <Over color={th.ink3}>Validation · 30 Mercer Loop</Over>
          <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink4, marginTop:8 }}>TRREB · 27 of 28 fields ready</div>
          <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:2 }}>
            {checks.map(([l,d,ok])=>(
              <div key={l} style={{ display:'flex', gap:12, padding:'11px 0', borderBottom:`1px solid ${th.hair}` }}>
                <div style={{ width:18, height:18, borderRadius:999, flexShrink:0, background: ok?T.okTint:T.warnTint, display:'flex', alignItems:'center', justifyContent:'center', marginTop:1 }}>
                  <I name={ok?'chk':'x'} size={11} color={ok?T.ok:T.warn} sw={2.4}/>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color: ok?th.ink:T.warn }}>{l}</div>
                  <div style={{ fontSize:11.5, color:th.ink3, marginTop:2 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
          <Btn variant="ghost" dark={dark} full style={{ marginTop:18 }}>Fix &amp; submit to TRREB</Btn>
        </div>
      </div>
    </>
  );
}

// ─── FORMS & E-SIGN ───
function FormsContent({ th, dark }) {
  const kpis = [
    { l:'Out for signature', v:'9',   d:null,  s:'3 buyers waiting' },
    { l:'Completed · 30d',   v:'64',  d:'+15', s:'signed in-system' },
    { l:'Avg. turnaround',   v:'3.4h',d:'−1.1h',s:'sent → completed' },
    { l:'Form templates',    v:'38',  d:null,  s:'OREA + TRREB' },
  ];
  const docs = [
    ['Agreement of Purchase & Sale','Form 100','214 Linden St','Buyer, Seller, 2 agents',2,3,'Partially signed','warn'],
    ['Confirmation of Cooperation','Form 320','8 Riverbend','Both brokerages',2,2,'Completed','ok'],
    ['Listing Agreement','Form 200','201 Oak Dr','Seller, Listing agent',1,2,'Sent','neutral'],
    ['FINTRAC Individual ID','IIR','30 Mercer Loop','Buyer',0,1,'Draft','neutral'],
    ['Working with a Realtor','RECO','55 Birch Way','Buyer',1,1,'Completed','ok'],
  ];
  return (
    <>
      <ModHead th={th} dark={dark} title="Forms & e-signatures" sub="Provincial board forms — pre-filled from the deal, signed in-system. No DocuSign round-trips."
        actions={<><Btn variant="ghost" dark={dark} icon="file">Templates</Btn><Btn variant="primary" dark={dark} icon="plus">New document</Btn></>}/>
      <KpiRow th={th} items={kpis}/>
      <div style={{ border:`1px solid ${th.hair}`, borderRadius:2 }}>
        <div style={{ padding:'16px 24px', borderBottom:`1px solid ${th.hair}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Over color={th.ink3}>Documents</Over>
          <div style={{ display:'flex', gap:2 }}>
            {['All','Awaiting','Completed'].map((x,i)=>(
              <div key={x} style={{ padding:'6px 12px', fontSize:12, color:i===0?th.ink:th.ink3, background:i===0?th.surf2:'transparent', borderRadius:2 }}>{x}</div>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.1fr 1.4fr 1fr 150px', padding:'10px 24px', borderBottom:`1px solid ${th.hair}`, fontFamily:F.mono, fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:th.ink4 }}>
          <div>Document</div><div>Deal</div><div>Parties</div><div>Signatures</div><div>Status</div>
        </div>
        {docs.map((d,i)=>(
          <div key={d[0]+d[2]} style={{ display:'grid', gridTemplateColumns:'2fr 1.1fr 1.4fr 1fr 150px', padding:'15px 24px', borderBottom: i===docs.length-1?'none':`1px solid ${th.hair}`, fontSize:13, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <I name="file" size={17} color={th.ink3}/>
              <div><div style={{ fontWeight:500 }}>{d[0]}</div><div style={{ fontFamily:F.mono, fontSize:10.5, color:th.ink4, marginTop:2 }}>{d[1]}</div></div>
            </div>
            <div style={{ color:th.ink2 }}>{d[2]}</div>
            <div style={{ color:th.ink3, fontSize:12 }}>{d[3]}</div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ display:'flex', gap:3 }}>
                {Array.from({length:d[5]}).map((_,j)=>(
                  <div key={j} style={{ width:8, height:8, borderRadius:999, background: j<d[4]?T.brick:th.hairS }}/>
                ))}
              </div>
              <span style={{ fontFamily:F.mono, fontSize:11, color:th.ink3 }}>{d[4]}/{d[5]}</span>
            </div>
            <div><Pill tone={d[7]} dark={dark}>{d[6]}</Pill></div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── ACCOUNTING · commissions, trust, agent billing ───
function AccountingContent({ th, dark }) {
  const kpis = [
    { l:'GCI · April',     v:'$182K', d:'+9.4%', s:'gross commission' },
    { l:'Company dollar',  v:'$47.3K',d:'+6.0%', s:'after agent splits' },
    { l:'Trust balance',   v:'$96.5K',d:null,    s:'12 deposits held' },
    { l:'Agent payables',  v:'$134K', d:null,    s:'pays out May 1' },
  ];
  const comm = [
    ['8 Riverbend','M. Ortega','$1.28M','$32,000','85 / 15','$4,800','$27,200','Ready','ok'],
    ['112 Ash Ct','N. Obayemi','$905K','$22,625','80 / 20','$4,525','$18,100','Ready','ok'],
    ['55 Birch Way','T. Winters','$690K','$17,250','80 / 20','$3,450','$13,800','Pending','warn'],
    ['201 Oak Dr','K. Haddad','$910K','$22,750','85 / 15','$3,413','$19,338','Escrow','neutral'],
  ];
  const ledger = [
    ['Deposit received','8 Riverbend','+$64,000','in'],
    ['Deposit received','201 Oak Dr','+$45,500','in'],
    ['Release to close','112 Ash Ct','−$45,250','out'],
    ['Commission paid','55 Birch Way','−$17,250','out'],
  ];
  return (
    <>
      <ModHead th={th} dark={dark} title="Accounting" sub="Commissions, trust ledger and agent billing — reconciled against every closed deal"
        actions={<><Btn variant="ghost" dark={dark} icon="dl">Export ledger</Btn><Btn variant="primary" dark={dark}>Run payouts</Btn></>}/>
      <KpiRow th={th} items={kpis}/>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:28 }}>
        <div style={{ border:`1px solid ${th.hair}`, borderRadius:2 }}>
          <div style={{ padding:'16px 24px', borderBottom:`1px solid ${th.hair}` }}><Over color={th.ink3}>Commission runs · April</Over></div>
          <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr 1fr 0.9fr 1fr 110px', padding:'10px 24px', borderBottom:`1px solid ${th.hair}`, fontFamily:F.mono, fontSize:9.5, letterSpacing:'0.14em', textTransform:'uppercase', color:th.ink4 }}>
            <div>Deal</div><div>Agent</div><div>GCI</div><div>Split</div><div style={{ textAlign:'right' }}>Agent net</div><div>Status</div>
          </div>
          {comm.map((c,i)=>(
            <div key={c[0]} style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr 1fr 0.9fr 1fr 110px', padding:'15px 24px', borderBottom: i===comm.length-1?'none':`1px solid ${th.hair}`, fontSize:13, alignItems:'center' }}>
              <div><div style={{ fontWeight:500 }}>{c[0]}</div><div style={{ fontFamily:F.mono, fontSize:10.5, color:th.ink4, marginTop:2 }}>{c[2]}</div></div>
              <div style={{ color:th.ink2 }}>{c[1]}</div>
              <div style={{ fontFamily:F.mono, fontSize:13 }}>{c[3]}</div>
              <div style={{ fontFamily:F.mono, fontSize:11, color:th.ink3 }}>{c[4]}</div>
              <div style={{ textAlign:'right', fontFamily:F.mono, fontSize:13 }}>{c[6]}</div>
              <div><Pill tone={c[8]} dark={dark}>{c[7]}</Pill></div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <Over color={th.ink3}>Trust ledger</Over>
              <span style={{ fontFamily:F.mono, fontSize:13, color:th.ink }}>$96,500</span>
            </div>
            <div style={{ marginTop:14, display:'flex', flexDirection:'column' }}>
              {ledger.map(([l,d,amt,dir],i)=>(
                <div key={l+d} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom: i===ledger.length-1?'none':`1px solid ${th.hair}` }}>
                  <div style={{ width:26, height:26, borderRadius:2, background: dir==='in'?T.okTint:th.surf2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <I name={dir==='in'?'arrD':'arrU'} size={13} color={dir==='in'?T.ok:th.ink3}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12.5, fontWeight:500 }}>{l}</div>
                    <div style={{ fontSize:11, color:th.ink4, marginTop:1 }}>{d}</div>
                  </div>
                  <span style={{ fontFamily:F.mono, fontSize:12.5, color: dir==='in'?T.ok:th.ink2 }}>{amt}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border:`1px solid ${th.hair}`, borderRadius:2, padding:24 }}>
            <Over color={th.ink3}>Reconciliation</Over>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12 }}>
              <div style={{ width:26, height:26, borderRadius:999, background:T.okTint, display:'flex', alignItems:'center', justifyContent:'center' }}><I name="chk" size={14} color={T.ok} sw={2.4}/></div>
              <div style={{ fontSize:13, color:th.ink2 }}>April trust reconciled to the penny · 0 exceptions</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Login — split screen
function BrokLogin({ dark=false }) {
  const th = useTheme(dark);
  return (
    <div style={{ width:1440, height:920, background:th.bg, color:th.ink, fontFamily:F.display, display:'flex' }}>
      <div style={{ flex:1, borderRight:`1px solid ${th.hair}`, padding:'48px 56px', display:'flex', flexDirection:'column' }}>
        <Wordmark size={19} color={th.ink}/>
        <div style={{ marginTop:'auto', maxWidth:440 }}>
          <Over color={th.ink4}>Sign in</Over>
          <div style={{ fontSize:44, fontWeight:500, letterSpacing:-1.4, marginTop:12, lineHeight:1.05 }}>
            Welcome back,<br/><span style={{ color:th.ink3 }}>one less tab.</span>
          </div>
          <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <Over color={th.ink3}>Email</Over>
              <div style={{ marginTop:8, padding:'14px 16px', border:`1px solid ${th.hairS}`, borderRadius:2, fontSize:15 }}>elena@harbor.co</div>
            </div>
            <div>
              <Over color={th.ink3}>Password</Over>
              <div style={{ marginTop:8, padding:'14px 16px', border:`1px solid ${th.hair}`, borderRadius:2, fontSize:15, color:th.ink3, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:F.mono, letterSpacing:4 }}>••••••••••</span>
                <I name="eye" size={16} color={th.ink3}/>
              </div>
            </div>
            <Btn variant="primary" dark={dark} full style={{ marginTop:8 }} icon="arr">Sign in</Btn>
            <div style={{ fontSize:12, color:th.ink3, marginTop:4 }}>Forgot password? <span style={{ color:T.brickDeep }}>Reset</span></div>
          </div>
        </div>
        <div style={{ marginTop:'auto', fontSize:11, color:th.ink4, fontFamily:F.mono, letterSpacing:'0.14em' }}>BRICKS · BROKERAGE</div>
      </div>
      <div style={{ flex:1, position:'relative' }}>
        <Img w="100%" h="100%" label="ARCHITECTURAL COMPOSITION — WARM STONE" dark={dark} r={0}/>
        <div style={{ position:'absolute', bottom:48, left:48, color:th.ink, maxWidth:360 }}>
          <Over color={th.ink3}>Why teams pick Bricks</Over>
          <div style={{ fontSize:20, fontWeight:500, marginTop:10, letterSpacing:-0.4, lineHeight:1.3 }}>
            One place for bookings, vendors and billing. Your agents already know how to use it.
          </div>
        </div>
      </div>
    </div>
  );
}



// Booking app (mobile, consumer-facing — agents/owners book shoots)

// 1) ONBOARDING — 3 slides
function BookOnboarding({ dark=false, slide=0 }) {
  const th = useTheme(dark);
  const slides = [
    { eye:'FOR AGENTS', head:'Book a shoot in a minute.', body:'Pick a package, pick a time. We handle the vendor, the weather, the edits.', img:'AGENT AT KITCHEN COUNTER' },
    { eye:'SMART SCHEDULING', head:'The right vendor, automatically.', body:'Bricks picks the nearest top-rated vendor for your slot — no phone tag.', img:'MAP WITH VENDOR PINS' },
    { eye:'TURN AROUND', head:'Photos in 24 hours.', body:'Edited, branded, MLS-sized. Dropped straight to your inbox and Dropbox.', img:'GALLERY GRID' },
  ];
  const s = slides[slide];
  return (
    <Phone dark={dark}>
      <div style={{ padding:'0 22px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Wordmark size={15} color={th.ink}/>
        <span style={{ fontSize:12, color:th.ink3 }}>Skip</span>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'12px 22px 0' }}>
        <Img w="100%" h={360} label={s.img} dark={dark}/>
        <div style={{ marginTop:32 }}>
          <Over color={T.brick}>{s.eye}</Over>
          <div style={{ fontSize:28, fontWeight:500, letterSpacing:-0.8, marginTop:10, lineHeight:1.15 }}>{s.head}</div>
          <div style={{ fontSize:14, color:th.ink2, marginTop:10, lineHeight:1.5 }}>{s.body}</div>
        </div>
        <div style={{ marginTop:'auto', paddingBottom:24 }}>
          <div style={{ display:'flex', gap:6, marginBottom:20 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ height:2, flex: i===slide?2:1, background: i===slide?T.brick:th.hairS }}/>
            ))}
          </div>
          <Btn variant="primary" dark={dark} full icon="arr">{slide===2?'Get started':'Next'}</Btn>
        </div>
      </div>
    </Phone>
  );
}

// 2) LOGIN
function BookLogin({ dark=false }) {
  const th = useTheme(dark);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'16px 22px 8px' }}>
        <Wordmark size={15} color={th.ink}/>
      </div>
      <div style={{ flex:1, padding:'28px 22px', display:'flex', flexDirection:'column' }}>
        <Over color={th.ink4}>Sign in</Over>
        <div style={{ fontSize:28, fontWeight:500, letterSpacing:-0.8, marginTop:10 }}>Welcome back.</div>
        <div style={{ fontSize:13, color:th.ink2, marginTop:6 }}>Book a shoot, track deliveries.</div>
        <div style={{ marginTop:28, display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <Over color={th.ink3}>Email</Over>
            <div style={{ marginTop:8, padding:'14px 14px', border:`1px solid ${th.hairS}`, borderRadius:2, fontSize:14 }}>mortega@harbor.co</div>
          </div>
          <div>
            <Over color={th.ink3}>Password</Over>
            <div style={{ marginTop:8, padding:'14px 14px', border:`1px solid ${th.hair}`, borderRadius:2, fontSize:14, color:th.ink3, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontFamily:F.mono, letterSpacing:3 }}>••••••••</span>
              <I name="eye" size={15} color={th.ink3}/>
            </div>
          </div>
          <Btn variant="primary" dark={dark} full icon="arr" style={{ marginTop:6 }}>Sign in</Btn>
          <div style={{ fontSize:12, color:th.ink3, textAlign:'center', marginTop:4 }}>Forgot password?</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'20px 0 8px' }}>
            <div style={{ flex:1, height:1, background:th.hair }}/>
            <span style={{ fontFamily:F.mono, fontSize:10, color:th.ink4, letterSpacing:'0.14em' }}>OR</span>
            <div style={{ flex:1, height:1, background:th.hair }}/>
          </div>
          <Btn variant="ghost" dark={dark} full>Continue with Google</Btn>
        </div>
        <div style={{ marginTop:'auto', fontSize:12, color:th.ink3, textAlign:'center' }}>
          New to Bricks? <span style={{ color:T.brickDeep }}>Create account</span>
        </div>
      </div>
    </Phone>
  );
}

// 3) REGISTER
function BookRegister({ dark=false }) {
  const th = useTheme(dark);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'16px 22px 8px', display:'flex', alignItems:'center', gap:10 }}>
        <I name="arrL" size={18} color={th.ink}/>
        <Wordmark size={15} color={th.ink}/>
      </div>
      <div style={{ flex:1, padding:'28px 22px', display:'flex', flexDirection:'column', overflow:'auto' }}>
        <Over color={th.ink4}>Create account</Over>
        <div style={{ fontSize:28, fontWeight:500, letterSpacing:-0.8, marginTop:10 }}>A few details.</div>
        <div style={{ marginTop:24, display:'flex', flexDirection:'column', gap:14 }}>
          {[['Full name','Marisol Ortega'],['Work email','mortega@harbor.co'],['Brokerage','Studio North'],['License #','RE·482901']].map(([l,v])=>(
            <div key={l}>
              <Over color={th.ink3}>{l}</Over>
              <div style={{ marginTop:8, padding:'14px 14px', border:`1px solid ${th.hair}`, borderRadius:2, fontSize:14 }}>{v}</div>
            </div>
          ))}
          <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginTop:10 }}>
            <div style={{ width:18, height:18, border:`1.5px solid ${T.brick}`, background:T.brick, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
              <I name="chk" size={11} color="#fff" sw={2.5}/>
            </div>
            <div style={{ fontSize:12, color:th.ink2, lineHeight:1.5 }}>I agree to the <span style={{ color:T.brickDeep }}>Terms</span> and <span style={{ color:T.brickDeep }}>Privacy Policy</span>.</div>
          </div>
        </div>
        <div style={{ marginTop:'auto', paddingTop:24 }}>
          <Btn variant="primary" dark={dark} full icon="arr">Create account</Btn>
        </div>
      </div>
    </Phone>
  );
}

// 4) HOME
function BookHome({ dark=false }) {
  const th = useTheme(dark);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'8px 22px 0', flex:1, overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:6 }}>
          <div>
            <Over color={th.ink4}>Thursday</Over>
            <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5, marginTop:4 }}>Hi, Marisol.</div>
          </div>
          <div style={{ width:36, height:36, borderRadius:2, background:T.brickSoft, color:T.brickDeep, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600 }}>MO</div>
        </div>

        <div style={{ marginTop:20, padding:18, background:T.ink, color:T.paper, borderRadius:2, position:'relative', overflow:'hidden' }}>
          <Over color="#F4D9CC">Next shoot · in 3 hours</Over>
          <div style={{ fontSize:19, fontWeight:500, marginTop:8, letterSpacing:-0.4 }}>214 Linden St</div>
          <div style={{ fontSize:12, color:'#C8BFB0', marginTop:4 }}>Today · 14:30 · J. Reyes</div>
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <div style={{ padding:'7px 10px', border:`1px solid #F4F1EB26`, borderRadius:2, fontSize:11, fontFamily:F.mono, letterSpacing:'0.1em' }}>VIEW JOB</div>
            <div style={{ padding:'7px 10px', border:`1px solid #F4F1EB26`, borderRadius:2, fontSize:11, fontFamily:F.mono, letterSpacing:'0.1em' }}>MESSAGE</div>
          </div>
          <BrickMark size={80} color="#F4D9CC0F" style={{ position:'absolute', right:-10, top:-10 }}/>
        </div>

        <div style={{ marginTop:22 }}>
          <Btn variant="accent" full icon="plus">Book a shoot</Btn>
        </div>

        <div style={{ marginTop:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <Over color={th.ink3}>Your listings</Over>
            <span style={{ fontSize:12, color:th.ink3 }}>All · 14</span>
          </div>
          <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:10 }}>
            {[
              ['214 Linden St', 'Shoot today · 14:30', 'brick',   'In progress', SB_IMG + '74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
              ['77 Alder Ave',  'Shoot today · 16:00', 'neutral', 'Scheduled',   SB_IMG + '8F382591-AA45-4B74-AD75-08717CFB63D4.PNG'],
              ['8 Riverbend',   'Delivered yesterday', 'ok',      'Delivered',   SB_IMG + '2153E4F6-D200-4DE8-BDCE-15799C873D44.PNG'],
              ['201 Oak Dr',    'Delivered Apr 13',    'ok',      'Delivered',   SB_IMG + '74E774C6-1524-4287-B115-25CA213E4BBD.PNG'],
            ].map(([a,b,tone,s,photo]) => (
              <div key={a} style={{ padding:14, border:`1px solid ${th.hair}`, borderRadius:2, display:'flex', gap:12, alignItems:'center' }}>
                <img src={photo} alt="" style={{ width:48, height:48, borderRadius:2, objectFit:'cover', flex:'none' }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{a}</div>
                  <div style={{ fontSize:11, color:th.ink3, marginTop:2 }}>{b}</div>
                </div>
                <Pill tone={tone} dark={dark}>{s}</Pill>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:20 }}/>
      </div>
      <TabBar dark={dark} active={0} tabs={[
        { icon:'home',label:'Home' },{ icon:'cal',label:'Jobs' },{ icon:'plus',label:'Book' },{ icon:'bell',label:'Inbox' },{ icon:'user',label:'Me' },
      ]}/>
    </Phone>
  );
}

// 5) BOOK FLOW — one screen showing the composed flow
function BookFlow({ dark=false }) {
  const th = useTheme(dark);
  const nav = React.useContext(DemoNav);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'12px 22px 0', display:'flex', alignItems:'center', gap:10 }}>
        <I name="arrL" size={18} color={th.ink}/>
        <div style={{ flex:1, textAlign:'center' }}><Over color={th.ink3}>New booking · step 2 / 4</Over></div>
        <span style={{ fontSize:12, color:th.ink3 }}>Save</span>
      </div>
      <div style={{ padding:'0 22px 8px' }}>
        <div style={{ height:2, background:th.hair, marginTop:12, display:'flex' }}>
          <div style={{ width:'50%', background:T.brick, height:'100%' }}/>
        </div>
      </div>
      <div style={{ flex:1, padding:'18px 22px 0', overflow:'auto' }}>
        <Over color={T.brick}>Package</Over>
        <div style={{ fontSize:24, fontWeight:500, letterSpacing:-0.6, marginTop:8 }}>How much coverage?</div>
        <div style={{ fontSize:13, color:th.ink2, marginTop:6 }}>214 Linden St · House · 2,140 sqft</div>

        <div style={{ marginTop:22, display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { n:'Standard', p:'$379', d:'24 HDR photos · Drone aerials · 24h delivery', sel:false },
            { n:'Premium',  p:'$749', d:'40 photos · Drone · 60-sec reel · Floor plan · 24h', sel:true  },
            { n:'Luxury',   p:'$1,199', d:'60 photos · Drone · Reel · 3D tour · 12h rush', sel:false },
            { n:'Estate',   p:'$2,499', d:'Estate-tier · Unlimited shots · 12h rush · Custom site', sel:false },
          ].map(pk => (
            <div key={pk.n} style={{
              padding:18, border:`${pk.sel?2:1}px solid ${pk.sel?T.brick:th.hair}`,
              borderRadius:2, background: pk.sel ? (dark?'#D2542B14':T.brickTint) : 'transparent',
              position:'relative',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <div style={{ fontSize:17, fontWeight:500 }}>{pk.n}</div>
                <div style={{ fontFamily:F.mono, fontSize:17 }}>{pk.p}</div>
              </div>
              <div style={{ fontSize:12, color:th.ink2, marginTop:6, lineHeight:1.5 }}>{pk.d}</div>
              {pk.sel && (
                <div style={{ position:'absolute', top:14, right:14, width:18, height:18, borderRadius:999, background:T.brick, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <I name="chk" size={11} color="#fff" sw={2.5}/>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop:24 }}>
          <Over color={th.ink3}>Earliest available</Over>
          <div style={{ marginTop:10, padding:16, border:`1px solid ${th.hair}`, borderRadius:2, display:'flex', alignItems:'center', gap:12 }}>
            <I name="bolt" size={20} color={T.brick}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500 }}>Today · 14:30</div>
              <div style={{ fontSize:11, color:th.ink3, marginTop:2 }}>J. Reyes · 4.9 ★ · 2.1 mi away</div>
            </div>
            <span style={{ fontSize:12, color:T.brickDeep }}>Change</span>
          </div>
        </div>
        <div style={{ height:100 }}/>
      </div>
      <div style={{ padding:'14px 22px 28px', borderTop:`1px solid ${th.hair}`, display:'flex', alignItems:'center', gap:14, background:th.bg }}>
        <div>
          <div style={{ fontSize:11, color:th.ink3, fontFamily:F.mono, letterSpacing:'0.1em' }}>TOTAL</div>
          <div style={{ fontFamily:F.mono, fontSize:22, marginTop:2 }}>$749</div>
        </div>
        <Btn variant="primary" dark={dark} style={{ marginLeft:'auto' }} icon="arr">Continue</Btn>
      </div>
      {nav && <TabBar dark={dark} active={2} tabs={[
        { icon:'home',label:'Home' },{ icon:'cal',label:'Jobs' },{ icon:'plus',label:'Book' },{ icon:'bell',label:'Inbox' },{ icon:'user',label:'Me' },
      ]}/>}
    </Phone>
  );
}

// 6) JOBS
function BookJobs({ dark=false }) {
  const th = useTheme(dark);
  const jobs = [
    ['214 Linden St', 'Today · 14:30', 'In progress', 'brick'],
    ['77 Alder Ave',  'Today · 16:00', 'Scheduled',   'neutral'],
    ['1902 Pine Rd',  'Editing',       'Editing',     'warn'],
    ['8 Riverbend',   'Delivered yesterday', 'Delivered', 'ok'],
    ['201 Oak Dr',    'Delivered Apr 13',     'Delivered', 'ok'],
    ['112 Ash Ct',    'Delivered Apr 11',     'Delivered', 'ok'],
  ];
  return (
    <Phone dark={dark}>
      <div style={{ padding:'8px 22px 14px' }}>
        <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5, paddingTop:8 }}>Jobs</div>
        <div style={{ marginTop:12, display:'flex', gap:4, borderBottom:`1px solid ${th.hair}` }}>
          {['All (14)','Upcoming (4)','Done (10)'].map((t,i) => (
            <div key={t} style={{ padding:'10px 10px', fontSize:12, color:i===0?th.ink:th.ink3, borderBottom:`2px solid ${i===0?T.brick:'transparent'}`, marginBottom:-1 }}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{ flex:1, padding:'0 22px 12px', overflow:'auto', display:'flex', flexDirection:'column', gap:10 }}>
        {jobs.map(([a,when,s,tone]) => (
          <div key={a} style={{ padding:14, border:`1px solid ${th.hair}`, borderRadius:2, display:'flex', gap:12, alignItems:'center' }}>
            <Img w={56} h={56} label="" dark={dark}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500 }}>{a}</div>
              <div style={{ fontFamily:F.mono, fontSize:11, color:th.ink3, marginTop:3 }}>{when}</div>
            </div>
            <Pill tone={tone} dark={dark}>{s}</Pill>
          </div>
        ))}
      </div>
      <TabBar dark={dark} active={1} tabs={[
        { icon:'home',label:'Home' },{ icon:'cal',label:'Jobs' },{ icon:'plus',label:'Book' },{ icon:'bell',label:'Inbox' },{ icon:'user',label:'Me' },
      ]}/>
    </Phone>
  );
}

// 7) PROFILE
function BookProfile({ dark=false }) {
  const th = useTheme(dark);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'8px 22px 0', flex:1, overflow:'auto' }}>
        <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5, paddingTop:8 }}>Profile</div>
        <div style={{ marginTop:20, display:'flex', alignItems:'center', gap:14, padding:'14px 0' }}>
          <div style={{ width:56, height:56, borderRadius:2, background:T.brickSoft, color:T.brickDeep, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:600 }}>MO</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:17, fontWeight:500 }}>Marisol Ortega</div>
            <div style={{ fontSize:12, color:th.ink3, marginTop:2 }}>Studio North · Agent</div>
          </div>
          <I name="cR" size={16} color={th.ink3}/>
        </div>
        <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:th.hair, border:`1px solid ${th.hair}`, borderRadius:2 }}>
          {[['JOBS',34],['THIS MO.',6],['RATING','4.9']].map(([l,v]) => (
            <div key={l} style={{ background:th.bg, padding:'14px 12px', textAlign:'center' }}>
              <div style={{ fontFamily:F.mono, fontSize:20 }}>{v}</div>
              <div style={{ fontFamily:F.mono, fontSize:9, letterSpacing:'0.14em', color:th.ink4, marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:22 }}>
          <Over color={th.ink3}>Account</Over>
          <div style={{ marginTop:10, border:`1px solid ${th.hair}`, borderRadius:2 }}>
            {[
              ['user','Edit profile'],
              ['cards','Payment methods'],
              ['bell','Notifications'],
              ['file','Tax documents'],
            ].map(([ic,l],i)=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderBottom: i===3?'none':`1px solid ${th.hair}` }}>
                <I name={ic} size={17} color={th.ink2}/>
                <span style={{ flex:1, fontSize:14 }}>{l}</span>
                <I name="cR" size={14} color={th.ink3}/>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop:22 }}>
          <Over color={th.ink3}>Support</Over>
          <div style={{ marginTop:10, border:`1px solid ${th.hair}`, borderRadius:2 }}>
            {[['phone','Contact support'],['file','Terms & privacy'],['logout','Sign out']].map(([ic,l],i)=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderBottom: i===2?'none':`1px solid ${th.hair}`, color: l==='Sign out'?T.brickDeep:th.ink }}>
                <I name={ic} size={17} color={l==='Sign out'?T.brickDeep:th.ink2}/>
                <span style={{ flex:1, fontSize:14 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:20 }}/>
      </div>
      <TabBar dark={dark} active={4} tabs={[
        { icon:'home',label:'Home' },{ icon:'cal',label:'Jobs' },{ icon:'plus',label:'Book' },{ icon:'bell',label:'Inbox' },{ icon:'user',label:'Me' },
      ]}/>
    </Phone>
  );
}



// Dispatch app (mobile, for vendors — dark by default)

function DispOnboarding({ dark=true, slide=0 }) {
  const th = useTheme(dark);
  const slides = [
    { eye:'FOR SHOOTERS', head:'Your day, queued up.', body:'Every job on the books — addresses, gate codes, packages, contact.', img:'VENDOR LOADING VAN' },
    { eye:'NAVIGATE',     head:'Drive time baked in.', body:'Bricks only books jobs you can actually make. Tap for directions.',  img:'DASHBOARD MAP' },
    { eye:'UPLOAD',        head:'Shoot. Upload. Done.', body:'Drag the SD card in. Brokerage gets notified when editing starts.',  img:'SD CARD + LAPTOP' },
  ];
  const s = slides[slide];
  return (
    <Phone dark={dark}>
      <div style={{ padding:'0 22px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Wordmark size={15} color={th.ink}/>
        <span style={{ fontSize:12, color:th.ink3 }}>Skip</span>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'12px 22px 0' }}>
        <Img w="100%" h={360} label={s.img} dark={dark}/>
        <div style={{ marginTop:32 }}>
          <Over color={T.brick}>{s.eye}</Over>
          <div style={{ fontSize:28, fontWeight:500, letterSpacing:-0.8, marginTop:10, lineHeight:1.15, color:th.ink }}>{s.head}</div>
          <div style={{ fontSize:14, color:th.ink2, marginTop:10, lineHeight:1.5 }}>{s.body}</div>
        </div>
        <div style={{ marginTop:'auto', paddingBottom:24 }}>
          <div style={{ display:'flex', gap:6, marginBottom:20 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ height:2, flex: i===slide?2:1, background: i===slide?T.brick:th.hairS }}/>
            ))}
          </div>
          <Btn variant="accent" full icon="arr">{slide===2?'Get started':'Next'}</Btn>
        </div>
      </div>
    </Phone>
  );
}

// TODAY — hero next job + rail
function DispToday({ dark=true }) {
  const th = useTheme(dark);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'8px 22px 0', flex:1, overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:6 }}>
          <div>
            <Over color={th.ink4}>Thursday · Apr 18</Over>
            <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5, marginTop:4 }}>4 shoots.</div>
          </div>
          <div style={{ width:36, height:36, borderRadius:2, background:'#D2542B33', color:T.brick, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600 }}>JR</div>
        </div>

        <div style={{ marginTop:20 }}>
          <Over color={T.brick}>Next up · in 42 min</Over>
          <div style={{ marginTop:10, padding:18, border:`1px solid ${th.hairS}`, borderRadius:2, background:th.surf }}>
            <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5 }}>214 Linden St</div>
            <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink3, marginTop:4 }}>TORONTO · HOUSE · 2,140 SQFT</div>
            <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:th.hairS, border:`1px solid ${th.hairS}`, borderRadius:2 }}>
              {[['ARRIVE','14:30'],['DRIVE','22 min'],['PACKAGE','Premium']].map(([l,v])=>(
                <div key={l} style={{ background:th.surf, padding:'10px 12px' }}>
                  <div style={{ fontFamily:F.mono, fontSize:9, letterSpacing:'0.14em', color:th.ink4 }}>{l}</div>
                  <div style={{ fontFamily:F.mono, fontSize:14, marginTop:4, color:th.ink }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, marginTop:14 }}>
              <Btn variant="accent" style={{ flex:1 }} icon="nav">Navigate</Btn>
              <Btn variant="ghost" dark={dark} icon="phone" style={{ paddingLeft:14, paddingRight:14 }}>{' '}</Btn>
            </div>
          </div>
        </div>

        <div style={{ marginTop:24 }}>
          <Over color={th.ink3}>Pre-shoot checklist</Over>
          <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:2 }}>
            {[
              ['Agent confirmed · M. Ortega', true],
              ['Lockbox code · 4812#',        true],
              ['Drone approved for area',     true],
              ['Upload last shoot (#08410)',  false],
            ].map(([l,done]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:`1px solid ${th.hair}` }}>
                <div style={{ width:18, height:18, borderRadius:2, border:`1.5px solid ${done?T.brick:th.hairS}`, background:done?T.brick:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {done && <I name="chk" size={11} color="#fff" sw={2.5}/>}
                </div>
                <span style={{ fontSize:13, color: done?th.ink3:th.ink, textDecoration: done?'line-through':'none' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:24 }}>
          <Over color={th.ink3}>Later today</Over>
          <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:10 }}>
            {[
              ['16:00','30 Mercer Loop','Condo','$749'],
              ['17:45','55 Birch Way','Condo','$379'],
              ['19:00','9 Harbor Way','Condo · twilight','$554'],
            ].map(([t,a,type,amt]) => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:14, padding:14, border:`1px solid ${th.hair}`, borderRadius:2 }}>
                <div style={{ fontFamily:F.mono, fontSize:13, color:th.ink, width:48 }}>{t}</div>
                <div style={{ width:1, height:28, background:th.hair }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{a}</div>
                  <div style={{ fontSize:11, color:th.ink3, marginTop:2 }}>{type}</div>
                </div>
                <div style={{ fontFamily:F.mono, fontSize:13, color:th.ink }}>{amt}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:20 }}/>
      </div>
      <TabBar dark={dark} active={0} tabs={[
        { icon:'home',label:'Today' },{ icon:'cal',label:'Week' },{ icon:'up',label:'Upload' },{ icon:'dol',label:'Pay' },{ icon:'user',label:'Me' },
      ]}/>
    </Phone>
  );
}

// SCHEDULE — week view
function DispSchedule({ dark=true }) {
  const th = useTheme(dark);
  const days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  return (
    <Phone dark={dark}>
      <div style={{ padding:'8px 22px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:6 }}>
          <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5 }}>Week 16</div>
          <div style={{ display:'flex', gap:4 }}>
            <div style={{ padding:'6px 10px', border:`1px solid ${th.hair}`, borderRadius:2 }}><I name="cU" size={13} color={th.ink2} style={{ transform:'rotate(-90deg)' }}/></div>
            <div style={{ padding:'6px 10px', border:`1px solid ${th.hair}`, borderRadius:2 }}><I name="cD" size={13} color={th.ink2} style={{ transform:'rotate(-90deg)' }}/></div>
          </div>
        </div>
        <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {days.map((d,i) => {
            const on = i === 3;
            const load = [2,3,1,4,3,2,0][i];
            return (
              <div key={d} style={{ padding:'8px 0', textAlign:'center', background: on?T.ink:'transparent', color: on?T.paper:th.ink, border:`1px solid ${on?T.ink:th.hair}`, borderRadius:2 }}>
                <div style={{ fontFamily:F.mono, fontSize:9, letterSpacing:'0.12em', opacity:on?0.7:0.6 }}>{d}</div>
                <div style={{ fontFamily:F.mono, fontSize:15, marginTop:3 }}>{13+i}</div>
                <div style={{ display:'flex', gap:2, justifyContent:'center', marginTop:5 }}>
                  {Array.from({length:load}).map((_,j) => <div key={j} style={{ width:3, height:3, background: on?T.paper:T.brick, borderRadius:999 }}/>)}
                  {load===0 && <div style={{ height:3 }}/>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ flex:1, padding:'20px 22px 0', overflow:'auto' }}>
        <Over color={th.ink3}>Thursday, Apr 18 · 4 shoots</Over>
        <div style={{ marginTop:12, display:'flex', flexDirection:'column' }}>
          {[
            ['09:00','1902 Pine Rd','House · Standard', 'Delivered','ok'],
            ['14:30','214 Linden St','House · Premium','Next','brick'],
            ['16:00','30 Mercer Loop','Commercial',      'Scheduled','neutral'],
            ['17:45','55 Birch Way','Condo',             'Scheduled','neutral'],
            ['19:00','9 Harbor Way','Condo · twilight',  'Scheduled','neutral'],
          ].map(([t,a,ty,s,tone],i) => (
            <div key={t} style={{ display:'flex', gap:14, padding:'14px 0', borderBottom:`1px solid ${th.hair}` }}>
              <div style={{ fontFamily:F.mono, fontSize:12, color:th.ink3, width:44 }}>{t}</div>
              <div style={{ width:1, background:th.hair, position:'relative' }}>
                <div style={{ position:'absolute', left:-3, top:4, width:7, height:7, borderRadius:999, background: tone==='brick'?T.brick: tone==='ok'?T.ok: th.ink4 }}/>
              </div>
              <div style={{ flex:1, paddingLeft:8 }}>
                <div style={{ fontSize:14, fontWeight:500 }}>{a}</div>
                <div style={{ fontSize:11, color:th.ink3, marginTop:2 }}>{ty}</div>
                <div style={{ marginTop:8 }}><Pill tone={tone} dark={dark}>{s}</Pill></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height:20 }}/>
      </div>
      <TabBar dark={dark} active={1} tabs={[
        { icon:'home',label:'Today' },{ icon:'cal',label:'Week' },{ icon:'up',label:'Upload' },{ icon:'dol',label:'Pay' },{ icon:'user',label:'Me' },
      ]}/>
    </Phone>
  );
}

// JOB DETAIL
function DispJobDetail({ dark=true }) {
  const th = useTheme(dark);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'12px 22px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <I name="arrL" size={18} color={th.ink}/>
        <div style={{ flex:1, fontFamily:F.mono, fontSize:11, color:th.ink3, letterSpacing:'0.14em' }}>#08412</div>
        <I name="dots" size={18} color={th.ink}/>
      </div>
      <div style={{ flex:1, overflow:'auto' }}>
        <Img w="100%" h={200} label="214 LINDEN ST · STREET VIEW" dark={dark} r={0}/>
        <div style={{ padding:'18px 22px 0' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:14 }}>
            <div>
              <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5 }}>214 Linden St</div>
              <div style={{ fontSize:12, color:th.ink3, marginTop:4 }}>Toronto, ON · House · 2,140 sqft</div>
            </div>
            <Pill tone="brick" dark={dark}>Next up</Pill>
          </div>
          <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:1, background:th.hairS, border:`1px solid ${th.hairS}`, borderRadius:2 }}>
            {[['ARRIVE','Today · 14:30'],['PACKAGE','Premium'],['DRIVE','22 min · 9.4 mi'],['PAYOUT','$337']].map(([l,v])=>(
              <div key={l} style={{ background:th.surf, padding:'12px 14px' }}>
                <div style={{ fontFamily:F.mono, fontSize:9, letterSpacing:'0.14em', color:th.ink4 }}>{l}</div>
                <div style={{ fontFamily:F.mono, fontSize:14, marginTop:4 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20 }}>
            <Over color={th.ink3}>Contact</Over>
            <div style={{ marginTop:10, padding:14, border:`1px solid ${th.hair}`, borderRadius:2, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:2, background:T.brickSoft, color:T.brickDeep, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>MO</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500 }}>M. Ortega</div>
                <div style={{ fontSize:11, color:th.ink3 }}>Studio North · Agent</div>
              </div>
              <I name="phone" size={17} color={th.ink2}/>
            </div>
          </div>
          <div style={{ marginTop:20 }}>
            <Over color={th.ink3}>Access</Over>
            <div style={{ marginTop:10, padding:14, border:`1px solid ${th.hair}`, borderRadius:2 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13 }}>Lockbox code</span>
                <span style={{ fontFamily:F.mono, fontSize:16, letterSpacing:2 }}>4812#</span>
              </div>
              <div style={{ height:1, background:th.hair, margin:'12px -14px' }}/>
              <div style={{ fontSize:12, color:th.ink2, lineHeight:1.5 }}>
                Park on Linden. Dog in back yard. Agent on site 14:15.
              </div>
            </div>
          </div>
          <div style={{ marginTop:20 }}>
            <Over color={th.ink3}>Shot list</Over>
            <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:2 }}>
              {['40 interior photos','5 drone aerials','60-second walkthrough reel','Floor plan — each level'].map(s => (
                <div key={s} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:`1px solid ${th.hair}` }}>
                  <I name="cam" size={15} color={th.ink3}/>
                  <span style={{ fontSize:13 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height:120 }}/>
        </div>
      </div>
      <div style={{ padding:'14px 22px 28px', borderTop:`1px solid ${th.hair}`, display:'flex', gap:10, background:th.bg }}>
        <Btn variant="ghost" dark={dark} icon="phone" style={{ paddingLeft:14, paddingRight:14 }}>{' '}</Btn>
        <Btn variant="accent" style={{ flex:1 }} icon="nav">Navigate</Btn>
      </div>
    </Phone>
  );
}

// UPLOADS
function DispUploads({ dark=true }) {
  const th = useTheme(dark);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'8px 22px 0', flex:1, overflow:'auto' }}>
        <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5, paddingTop:8 }}>Upload</div>
        <div style={{ fontSize:12, color:th.ink3, marginTop:4 }}>Drop the card — we auto-sort by job.</div>

        <div style={{ marginTop:20, padding:'32px 20px', border:`1.5px dashed ${th.hairS}`, borderRadius:2, textAlign:'center' }}>
          <I name="up" size={28} color={T.brick}/>
          <div style={{ fontSize:15, fontWeight:500, marginTop:12 }}>Drag files or tap to select</div>
          <div style={{ fontSize:11, color:th.ink3, marginTop:6 }}>RAW, JPEG, MP4 · up to 20 GB per job</div>
          <Btn variant="accent" style={{ marginTop:14 }} icon="plus">Choose files</Btn>
        </div>

        <div style={{ marginTop:24 }}>
          <Over color={th.ink3}>In progress</Over>
          <div style={{ marginTop:10, padding:16, border:`1px solid ${th.hairS}`, borderRadius:2 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div>
                <div style={{ fontSize:14, fontWeight:500 }}>1902 Pine Rd · #08410</div>
                <div style={{ fontSize:11, color:th.ink3, marginTop:2, fontFamily:F.mono }}>127 / 240 FILES · 4.2 GB</div>
              </div>
              <span style={{ fontFamily:F.mono, fontSize:16, color:T.brick }}>53%</span>
            </div>
            <div style={{ height:3, background:th.hair, marginTop:12, borderRadius:2, overflow:'hidden' }}>
              <div style={{ width:'53%', background:T.brick, height:'100%' }}/>
            </div>
            <div style={{ fontFamily:F.mono, fontSize:10, color:th.ink4, marginTop:8, letterSpacing:'0.1em' }}>~ 4 MIN REMAINING</div>
          </div>
        </div>

        <div style={{ marginTop:24 }}>
          <Over color={th.ink3}>Recent uploads</Over>
          <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:10 }}>
            {[
              ['30 Mercer Loop · #08409', '183 files · 3.1 GB', 'Editing', 'warn'],
              ['8 Riverbend · #08408',    '240 files · 5.2 GB', 'Delivered', 'ok'],
              ['55 Birch Way · #08407',   '151 files · 2.8 GB', 'Delivered', 'ok'],
              ['112 Ash Ct · #08406',     '202 files · 4.0 GB', 'Delivered', 'ok'],
            ].map(([a,meta,s,tone]) => (
              <div key={a} style={{ padding:14, border:`1px solid ${th.hair}`, borderRadius:2, display:'flex', gap:12, alignItems:'center' }}>
                <I name="file" size={18} color={th.ink3}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500 }}>{a}</div>
                  <div style={{ fontFamily:F.mono, fontSize:11, color:th.ink3, marginTop:2 }}>{meta}</div>
                </div>
                <Pill tone={tone} dark={dark}>{s}</Pill>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:20 }}/>
      </div>
      <TabBar dark={dark} active={2} tabs={[
        { icon:'home',label:'Today' },{ icon:'cal',label:'Week' },{ icon:'up',label:'Upload' },{ icon:'dol',label:'Pay' },{ icon:'user',label:'Me' },
      ]}/>
    </Phone>
  );
}

// VENDOR PAY / PROFILE
function DispProfile({ dark=true }) {
  const th = useTheme(dark);
  return (
    <Phone dark={dark}>
      <div style={{ padding:'8px 22px 0', flex:1, overflow:'auto' }}>
        <div style={{ fontSize:22, fontWeight:500, letterSpacing:-0.5, paddingTop:8 }}>Payouts</div>
        <div style={{ marginTop:16, padding:20, border:`1px solid ${th.hairS}`, borderRadius:2, background:th.surf }}>
          <Over color={th.ink3}>This week</Over>
          <div style={{ fontFamily:F.mono, fontSize:36, marginTop:10, letterSpacing:-0.8 }}>$2,124</div>
          <div style={{ fontSize:11, color:th.ink3, marginTop:4 }}>Pays out Monday · 7 jobs</div>
          <div style={{ height:3, background:th.hair, marginTop:16, borderRadius:2, overflow:'hidden', display:'flex' }}>
            <div style={{ width:'68%', background:T.brick }}/>
            <div style={{ width:'32%', background:th.ink4 }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontFamily:F.mono, fontSize:10, color:th.ink3 }}>
            <span>PAID $1,450</span><span>PENDING $674</span>
          </div>
        </div>

        <div style={{ marginTop:22 }}>
          <Over color={th.ink3}>Recent jobs</Over>
          <div style={{ marginTop:10, border:`1px solid ${th.hair}`, borderRadius:2 }}>
            {[
              ['214 Linden St','Today','$337','Pending'],
              ['30 Mercer Loop','Today','$337','Pending'],
              ['1902 Pine Rd','Yesterday','$171','Paid'],
              ['8 Riverbend','Apr 16','$450','Paid'],
              ['55 Birch Way','Apr 15','$249','Paid'],
            ].map(([a,d,v,s],i)=>(
              <div key={a+i} style={{ display:'flex', gap:10, padding:14, borderBottom: i===4?'none':`1px solid ${th.hair}`, alignItems:'center' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500 }}>{a}</div>
                  <div style={{ fontFamily:F.mono, fontSize:11, color:th.ink3, marginTop:2 }}>{d}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:F.mono, fontSize:13 }}>{v}</div>
                  <div style={{ fontFamily:F.mono, fontSize:10, color: s==='Paid'?T.ok:T.warn, marginTop:2 }}>{s.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:22 }}>
          <Over color={th.ink3}>Account</Over>
          <div style={{ marginTop:10, border:`1px solid ${th.hair}`, borderRadius:2 }}>
            {[['user','Edit profile'],['cards','Payout method · •••• 9012'],['file','Tax documents'],['cog','Settings'],['logout','Sign out']].map(([ic,l],i)=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderBottom: i===4?'none':`1px solid ${th.hair}`, color: l==='Sign out'?T.brick:th.ink }}>
                <I name={ic} size={17} color={l==='Sign out'?T.brick:th.ink2}/>
                <span style={{ flex:1, fontSize:14 }}>{l}</span>
                {l!=='Sign out' && <I name="cR" size={14} color={th.ink3}/>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:20 }}/>
      </div>
      <TabBar dark={dark} active={3} tabs={[
        { icon:'home',label:'Today' },{ icon:'cal',label:'Week' },{ icon:'up',label:'Upload' },{ icon:'dol',label:'Pay' },{ icon:'user',label:'Me' },
      ]}/>
    </Phone>
  );
}



// ── Mount screens ──

// Expose every top-level component
const BOOK_SCREENS = [BookHome, BookJobs, BookFlow, BookHome, BookProfile];
const DISP_SCREENS = [DispToday, DispSchedule, DispUploads, DispProfile, DispProfile];

function DemoOS({ dark=false, screen='overview', locked=false }) {
  return <BrokShell dark={dark} screen={screen} locked={locked} />;
}

function DemoBook({ dark=false }) {
  const [tab, setTab] = React.useState(0);
  const Screen = BOOK_SCREENS[tab] || BookHome;
  return (
    <DemoNav.Provider value={{ tab, setTab }}>
      <Screen dark={dark} />
    </DemoNav.Provider>
  );
}

function DemoDisp({ dark=false }) {
  const [tab, setTab] = React.useState(0);
  const Screen = DISP_SCREENS[tab] || DispToday;
  return (
    <DemoNav.Provider value={{ tab, setTab }}>
      <Screen dark={dark} />
    </DemoNav.Provider>
  );
}

Object.assign(global, {
  T, F, useTheme, BrickMark, Wordmark, Over, Img, I, Phone, TabBar, Pill, Btn,
  BrokShell, BrokLogin,
  BookOnboarding, BookLogin, BookRegister, BookHome, BookFlow, BookJobs, BookProfile,
  DispOnboarding, DispToday, DispSchedule, DispJobDetail, DispUploads, DispProfile,
  DemoOS, DemoBook, DemoDisp,
});

global.mountBricks = function(id, element) {
  const root = document.getElementById(id);
  if (!root) throw new Error('mountBricks: no element #' + id);
  ReactDOM.createRoot(root).render(element);
};
})(window);

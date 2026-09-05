// bricks.js — Bricks production component library
// Auto-generated from Bricks Full Frontend.html
// All components available on window. Use mountBricks('containerId', <Component/>) to render.
// Rebuild runtime: npm run compile:os  (scripts/compile-os.js → bricks.compiled.js)
(function (global) {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "stageBg": "#E4DED2",
    "accent": "#D2542B",
    "font": "Söhne",
    "density": "comfy"
  } /*EDITMODE-END*/;

  // Real Bricks listing photos, reused as sample thumbnails in mockups.
  const SB_IMG = 'https://ctqwxwrcxwruaqojohpf.supabase.co/storage/v1/object/public/BRX%20Images/';

  // Shared primitives — used by all screen files. Lean tokens + helpers.
  const T = {
    paper: '#F4F1EB',
    paperSoft: '#EDE8DF',
    paperDeep: '#E4DED2',
    hair: '#1411100F',
    hairStrong: '#14111020',
    hairMid: '#14111018',
    ink: '#14110E',
    inkSoft: '#3B332A',
    inkMute: '#6B6054',
    inkFaint: '#A39684',
    night: '#141210',
    nightSoft: '#1C1A17',
    nightDeep: '#23201C',
    nightHair: '#F4F1EB14',
    nightHairS: '#F4F1EB26',
    moon: '#F4F1EB',
    moonSoft: '#D6CFC2',
    moonMute: '#8F8678',
    moonFaint: '#5E574C',
    brick: '#D2542B',
    brickDeep: '#A8401F',
    brickSoft: '#F4D9CC',
    brickTint: '#FBEFE8',
    ok: '#4A6B3C',
    okTint: '#E6ECDD',
    warn: '#B8741F',
    warnTint: '#F6E8D1',
    bad: '#8C2F24',
    badTint: '#F1DAD4'
  };
  const F = {
    display: '"General Sans","Söhne",ui-sans-serif,-apple-system,BlinkMacSystemFont,sans-serif',
    mono: '"JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace'
  };

  // Theme helper — returns dark or light palette set
  function useTheme(dark) {
    return {
      bg: dark ? T.night : T.paper,
      surf: dark ? T.nightSoft : '#FFFFFF',
      surf2: dark ? T.nightDeep : T.paperSoft,
      hair: dark ? T.nightHair : T.hair,
      hairS: dark ? T.nightHairS : T.hairStrong,
      ink: dark ? T.moon : T.ink,
      ink2: dark ? T.moonSoft : T.inkSoft,
      ink3: dark ? T.moonMute : T.inkMute,
      ink4: dark ? T.moonFaint : T.inkFaint
    };
  }
  function BrickMark({
    size = 20,
    color = T.brick,
    style = {}
  }) {
    // Exact Bricks logo: top brick upper-LEFT, bottom-left small square under it,
    // bottom-right wide rectangle extending past. Silhouette reads as lowercase "b".
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      style: style
    }, /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "5",
      width: "11",
      height: "7",
      rx: "1.2",
      fill: color
    }), /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "13",
      width: "6",
      height: "7",
      rx: "1.2",
      fill: color
    }), /*#__PURE__*/React.createElement("rect", {
      x: "11",
      y: "13",
      width: "10",
      height: "7",
      rx: "1.2",
      fill: color
    }));
  }
  function Wordmark({
    size = 18,
    color,
    style = {}
  }) {
    const c = color || T.ink;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.5,
        ...style
      }
    }, /*#__PURE__*/React.createElement(BrickMark, {
      size: Math.round(size * 1.2),
      color: T.brick
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.display,
        fontSize: size,
        fontWeight: 500,
        letterSpacing: -size * 0.035,
        color: c,
        lineHeight: 1
      }
    }, "bricks"));
  }
  function Over({
    children,
    color,
    style = {}
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 10.5,
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: color || T.inkMute,
        ...style
      }
    }, children);
  }
  function Img({
    w = '100%',
    h = 160,
    label,
    dark = false,
    style = {},
    r = 2
  }) {
    const bg = dark ? T.nightSoft : T.paperDeep;
    const stripe = dark ? T.nightHair : T.hair;
    const fg = dark ? T.moonMute : T.inkMute;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        background: bg,
        backgroundImage: `repeating-linear-gradient(135deg, transparent 0 10px, ${stripe} 10px 11px)`,
        borderRadius: r,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: fg,
        ...style
      }
    }, label);
  }
  function I({
    name,
    size = 18,
    color = 'currentColor',
    sw = 1.5,
    style = {}
  }) {
    const p = {
      home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M3 10.5 12 3l9 7.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 9v11h5v-6h4v6h5V9"
      })),
      cal: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "5",
        width: "18",
        height: "16",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 10h18M8 3v4M16 3v4"
      })),
      job: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "6",
        width: "18",
        height: "14",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 6V4h8v2M3 12h18"
      })),
      cam: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M4 7h3l2-2h6l2 2h3v13H4z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "13",
        r: "4"
      })),
      user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "8",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"
      })),
      up: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M12 16V4M6 10l6-6 6 6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 20h16"
      })),
      map: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 4v14M15 6v14"
      })),
      pin: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "9",
        r: "2.5"
      })),
      arr: /*#__PURE__*/React.createElement("path", {
        d: "M5 12h14M13 6l6 6-6 6"
      }),
      arrU: /*#__PURE__*/React.createElement("path", {
        d: "M12 19V5M6 11l6-6 6 6"
      }),
      arrD: /*#__PURE__*/React.createElement("path", {
        d: "M12 5v14M18 13l-6 6-6-6"
      }),
      arrL: /*#__PURE__*/React.createElement("path", {
        d: "M19 12H5M11 6l-6 6 6 6"
      }),
      chk: /*#__PURE__*/React.createElement("path", {
        d: "M4 12l5 5L20 6"
      }),
      plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M12 5v14M5 12h14"
      })),
      cog: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
      })),
      srch: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m20 20-3.5-3.5"
      })),
      bell: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M6 17V11a6 6 0 0 1 12 0v6M4 17h16M10 21h4"
      })),
      dol: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M12 3v18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 7H9.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 1 0 5H6"
      })),
      dots: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
        cx: "5",
        cy: "12",
        r: "1"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "1"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "19",
        cy: "12",
        r: "1"
      })),
      clk: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 7v5l3 2"
      })),
      trend: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M3 17l6-6 4 4 8-8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 7h7v7"
      })),
      cR: /*#__PURE__*/React.createElement("path", {
        d: "m9 6 6 6-6 6"
      }),
      cD: /*#__PURE__*/React.createElement("path", {
        d: "m6 9 6 6 6-6"
      }),
      cU: /*#__PURE__*/React.createElement("path", {
        d: "m6 15 6-6 6 6"
      }),
      grid: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "8",
        height: "8"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "13",
        y: "3",
        width: "8",
        height: "8"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "13",
        width: "8",
        height: "8"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "13",
        y: "13",
        width: "8",
        height: "8"
      })),
      users: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "8",
        r: "3.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 21c0-3.5 3-6 7-6s7 2.5 7 6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 4.5a3.5 3.5 0 0 1 0 7M22 21c0-3-1.8-5.2-5-6"
      })),
      play: /*#__PURE__*/React.createElement("path", {
        d: "M7 4v16l13-8z"
      }),
      nav: /*#__PURE__*/React.createElement("path", {
        d: "M3 11l19-9-9 19-2-8-8-2z"
      }),
      mail: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "5",
        width: "18",
        height: "14",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m3 6 9 7 9-7"
      })),
      lock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: "5",
        y: "11",
        width: "14",
        height: "10",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 11V8a4 4 0 0 1 8 0v3"
      })),
      eye: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      })),
      heart: /*#__PURE__*/React.createElement("path", {
        d: "M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z"
      }),
      bolt: /*#__PURE__*/React.createElement("path", {
        d: "M13 2 3 14h7l-1 8 10-12h-7z"
      }),
      x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "m6 6 12 12M18 6 6 18"
      })),
      cards: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "5",
        width: "18",
        height: "14",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 10h18"
      })),
      file: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M5 3h10l4 4v14H5z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M15 3v4h4"
      })),
      star: /*#__PURE__*/React.createElement("path", {
        d: "m12 3 2.8 6.2 6.7.7-5 4.6 1.5 6.6L12 17.7 5.9 21l1.5-6.6-5-4.6 6.7-.7z"
      }),
      zap: /*#__PURE__*/React.createElement("path", {
        d: "M13 2 3 14h7l-1 8 10-12h-7z"
      }),
      sliders: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M4 6h16M4 12h16M4 18h16"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "6",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "7",
        cy: "18",
        r: "2"
      })),
      menu: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M4 6h16M4 12h16M4 18h16"
      })),
      phone: /*#__PURE__*/React.createElement("path", {
        d: "M5 3h4l2 5-2 2a12 12 0 0 0 5 5l2-2 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z"
      }),
      dl: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M12 4v12M6 10l6 6 6-6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 20h16"
      })),
      logout: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
        d: "M9 21H5V3h4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 16l5-4-5-4M9 12h12"
      }))
    };
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: sw,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: style
    }, p[name] || null);
  }

  // Phone frame — mobile screens wrap in this
  function Phone({
    dark = false,
    children
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 390,
        height: 844,
        background: th.bg,
        color: th.ink,
        fontFamily: F.display,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 22px',
        fontSize: 15,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 16,
        height: 10,
        borderRadius: 1,
        background: th.ink
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 22,
        height: 11,
        borderRadius: 2,
        border: `1.2px solid ${th.ink}`,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 1.5,
        width: 14,
        background: th.ink,
        borderRadius: 1
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }
    }, children), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 134,
        height: 4,
        background: th.ink,
        borderRadius: 4,
        opacity: 0.85
      }
    }));
  }

  // Demo nav context — parent DemoBook/DemoDisp install tab state so TabBar clicks switch screens.
  const DemoNav = React.createContext(null);

  // Bottom tab bar (mobile, configurable)
  function TabBar({
    dark = false,
    tabs,
    active,
    accent = T.brick,
    onSelect
  }) {
    const th = useTheme(dark);
    const nav = React.useContext(DemoNav);
    const locked = !!(nav && nav.locked);
    const select = locked ? undefined : onSelect || nav && nav.setTab;
    const cur = nav && typeof nav.tab === 'number' ? nav.tab : active;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: `1px solid ${th.hair}`,
        background: th.bg,
        padding: '8px 12px 28px',
        display: 'grid',
        gridTemplateColumns: `repeat(${tabs.length},1fr)`,
        gap: 2
      }
    }, tabs.map((t, i) => {
      const on = i === cur;
      return /*#__PURE__*/React.createElement("div", {
        key: t.label,
        onClick: select ? () => select(i) : undefined,
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: '8px 0',
          position: 'relative',
          color: on ? th.ink : th.ink4,
          cursor: select ? 'pointer' : 'default'
        }
      }, on && /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: 0,
          width: 24,
          height: 2,
          background: accent
        }
      }), /*#__PURE__*/React.createElement(I, {
        name: t.icon,
        size: 19,
        color: on ? th.ink : th.ink4,
        sw: on ? 1.75 : 1.5
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontFamily: F.mono,
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }
      }, t.label));
    }));
  }

  // Pill/badge
  function Pill({
    children,
    tone = 'neutral',
    dark = false
  }) {
    const th = useTheme(dark);
    const map = {
      brick: {
        bg: dark ? '#F4D9CC22' : T.brickTint,
        fg: dark ? T.brickSoft : T.brickDeep
      },
      ok: {
        bg: dark ? '#E6ECDD22' : T.okTint,
        fg: dark ? '#B8CC9E' : T.ok
      },
      warn: {
        bg: dark ? '#F6E8D122' : T.warnTint,
        fg: dark ? '#E6B477' : T.warn
      },
      neutral: {
        bg: th.surf2,
        fg: th.ink2
      },
      ink: {
        bg: th.ink,
        fg: th.bg
      }
    };
    const c = map[tone];
    return /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '5px 9px',
        background: c.bg,
        color: c.fg,
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        borderRadius: 2,
        whiteSpace: 'nowrap'
      }
    }, children);
  }

  // Button
  function Btn({
    children,
    variant = 'primary',
    dark = false,
    full = false,
    icon,
    style = {}
  }) {
    const th = useTheme(dark);
    const styles = {
      primary: {
        background: T.ink,
        color: T.paper,
        border: 'none'
      },
      accent: {
        background: T.brick,
        color: '#fff',
        border: 'none'
      },
      ghost: {
        background: 'transparent',
        color: th.ink,
        border: `1px solid ${th.hairS}`
      },
      secondary: {
        background: th.surf2,
        color: th.ink,
        border: `1px solid ${th.hair}`
      }
    };
    return /*#__PURE__*/React.createElement("button", {
      style: {
        ...styles[variant],
        padding: '13px 20px',
        borderRadius: 2,
        fontFamily: F.display,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: -0.1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: full ? '100%' : 'auto',
        cursor: 'pointer',
        ...style
      }
    }, children, icon && /*#__PURE__*/React.createElement(I, {
      name: icon,
      size: 14,
      color: "currentColor"
    }));
  }

  // ─── Role-aware console config (brokerage / team / solo) ───
  const BROK_ROLES = {
    office: {
      wsNm: 'Ashfield',
      wsMeta: '47 agents',
      ini: 'EA',
      who: 'Elena Asare',
      role: 'Operations',
      nav: [{
        group: null,
        items: [['grid', 'Overview', 'overview']]
      }, {
        group: 'Deal flow',
        items: [['users', 'CRM', 'crm'], ['cards', 'Transactions', 'transactions'], ['up', 'MLS submission', 'mls'], ['file', 'Forms & e-sign', 'forms']]
      }, {
        group: 'Media',
        items: [['job', 'Jobs', 'jobs'], ['cam', 'Vendors', 'vendors']]
      }, {
        group: 'Finance',
        items: [['dol', 'Accounting', 'accounting'], ['user', 'Agents', 'agents']]
      }, {
        group: null,
        items: [['cog', 'Settings', 'settings']]
      }]
    },
    team: {
      wsNm: 'Ortega Group',
      wsMeta: '6 agents · team',
      ini: 'MO',
      who: 'Marisol Ortega',
      role: 'Team lead',
      nav: [{
        group: null,
        items: [['grid', 'Overview', 'overview']]
      }, {
        group: 'Deal flow',
        items: [['users', 'CRM', 'crm'], ['cards', 'Transactions', 'transactions'], ['up', 'MLS submission', 'mls'], ['file', 'Forms & e-sign', 'forms']]
      }, {
        group: 'Media',
        items: [['job', 'Jobs', 'jobs']]
      }, {
        group: 'Finance',
        items: [['dol', 'Accounting', 'accounting'], ['user', 'Team', 'agents']]
      }, {
        group: null,
        items: [['cog', 'Settings', 'settings']]
      }]
    },
    solo: {
      wsNm: 'Marisol Ortega',
      wsMeta: 'Solo agent',
      ini: 'MO',
      who: 'Marisol Ortega',
      role: 'RE·482901',
      nav: [{
        group: null,
        items: [['grid', 'Overview', 'overview']]
      }, {
        group: 'Deal flow',
        items: [['users', 'CRM', 'crm'], ['cards', 'Transactions', 'transactions'], ['up', 'MLS submission', 'mls'], ['file', 'Forms & e-sign', 'forms']]
      }, {
        group: 'Business',
        items: [['job', 'Bookings', 'jobs'], ['dol', 'Income', 'accounting']]
      }, {
        group: null,
        items: [['cog', 'Settings', 'settings']]
      }]
    }
  };
  BROK_ROLES.brokerage = BROK_ROLES.office;

  // Each role gets a different default dashboard — greeting, KPIs and widgets tuned to what
  // that operator wants to see first. All of it is user-customizable (see customize state).
  const DASHBOARDS = {
    office: {
      eyebrow: 'Thursday · Week 16',
      hi: 'Good morning, Elena.',
      cta: 'New deal',
      sub: th => /*#__PURE__*/React.createElement(React.Fragment, null, "Two deals need signatures. ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: th.ink
        }
      }, "Close of $1.2M is Thursday.")),
      kpis: [{
        l: 'Deals this month',
        v: '184',
        d: '+12.4%',
        s: 'vs 164 prev.'
      }, {
        l: 'GCI · April',
        v: '$182K',
        d: '+9.4%',
        s: 'gross commission'
      }, {
        l: 'Company dollar',
        v: '$47.3K',
        d: '+6.0%',
        s: 'after splits'
      }, {
        l: 'Active agents',
        v: '47',
        d: '+3',
        s: 'onboarded · 30d'
      }],
      widgets: [['pipeline', 4], ['volume', 2], ['today', 2], ['leaderboard', 2], ['trust', 2]]
    },
    team: {
      eyebrow: 'Ortega Group · Week 16',
      hi: 'Morning, Marisol.',
      cta: 'New job',
      sub: th => /*#__PURE__*/React.createElement(React.Fragment, null, "Your team has ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: th.ink
        }
      }, "5 deals closing"), " this month. Two need docs signed."),
      kpis: [{
        l: 'Team GCI · MTD',
        v: '$58.2K',
        d: '+14%',
        s: '6 agents'
      }, {
        l: 'Active listings',
        v: '12',
        d: '+2',
        s: 'on market'
      }, {
        l: 'Closing ≤ 30d',
        v: '5',
        s: '$4.1M volume'
      }, {
        l: 'Team pipeline',
        v: '$6.4M',
        d: '+7%',
        s: '32 deals'
      }],
      widgets: [['volume', 4], ['closings', 2], ['leaderboard', 3], ['pipeline', 3]]
    },
    solo: {
      eyebrow: 'Thursday · Apr 18',
      hi: 'Hi, Marisol.',
      cta: 'Book a shoot',
      sub: th => /*#__PURE__*/React.createElement(React.Fragment, null, "One shoot today, one deal firming up. You\u2019re on pace for a ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: th.ink
        }
      }, "record quarter.")),
      kpis: [{
        l: 'My GCI · YTD',
        v: '$214K',
        d: '+18%',
        s: 'vs last year'
      }, {
        l: 'Active listings',
        v: '4',
        s: '2 in offer'
      }, {
        l: 'Deals in progress',
        v: '3',
        s: '1 firm'
      }, {
        l: 'Next payout',
        v: '$27.2K',
        s: 'May 1 · Riverbend'
      }],
      widgets: [['nextshoot', 2], ['income', 2], ['followups', 2], ['listings', 4], ['closings', 2]]
    }
  };
  DASHBOARDS.brokerage = DASHBOARDS.office;
  const WTITLE = {
    volume: 'Job volume · 24 days',
    today: 'Today · 6 shoots',
    pipeline: 'Pipeline by stage',
    leaderboard: 'Top performers · 30d',
    trust: 'Trust & reconciliation',
    closings: 'Upcoming closings',
    listings: 'Listings & media',
    income: 'Income · YTD',
    nextshoot: 'Next shoot',
    followups: 'Follow-ups due'
  };
  function DashRole({
    th,
    dark,
    role,
    customize
  }) {
    const D = DASHBOARDS[role] || DASHBOARDS.office;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, customize ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Over, {
      color: T.brick
    }, "Editing dashboard"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: -1,
        marginTop: 8
      }
    }, "Customize your overview"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 6
      }
    }, "Drag to reorder \xB7 remove what you don\u2019t need \xB7 add from the library below.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, D.eyebrow), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 34,
        fontWeight: 500,
        letterSpacing: -1.1,
        marginTop: 8
      }
    }, D.hi), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: th.ink2,
        marginTop: 6
      }
    }, D.sub(th)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, customize ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      icon: "plus"
    }, "Add widget"), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      icon: "chk"
    }, "Done")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      icon: "sliders"
    }, "Customize"), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      icon: "plus"
    }, D.cta)))), /*#__PURE__*/React.createElement(KpiRow, {
      th: th,
      items: D.kpis
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6,1fr)',
        gap: 20
      }
    }, D.widgets.map(([key, span], i) => /*#__PURE__*/React.createElement(DashWidget, {
      key: key + i,
      th: th,
      dark: dark,
      span: span,
      title: WTITLE[key],
      customize: customize
    }, renderWidget(key, th, dark))), customize && /*#__PURE__*/React.createElement("div", {
      style: {
        gridColumn: 'span 2',
        border: `1px dashed ${th.hairS}`,
        borderRadius: 2,
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: th.ink3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 2,
        border: `1px solid ${th.hairS}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "plus",
      size: 18,
      color: th.ink3
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13
      }
    }, "Add widget"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.12em',
        color: th.ink4
      }
    }, "14 AVAILABLE"))), customize && /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: '18px 24px'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Widget library"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 14
      }
    }, ['Pipeline value', 'Team leaderboard', 'Upcoming closings', 'Income tracker', 'Trust & reconciliation', 'Next shoot', 'Follow-ups', 'Media in flight', 'MLS status', 'Lead sources', 'Goal tracker', 'Recent signings'].map(w => /*#__PURE__*/React.createElement("div", {
      key: w,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        fontSize: 12.5,
        color: th.ink2
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "plus",
      size: 12,
      color: th.ink3
    }), w)))));
  }
  function DashWidget({
    th,
    dark,
    title,
    span = 2,
    customize,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        gridColumn: `span ${span}`,
        position: 'relative',
        background: th.bg,
        border: `1px ${customize ? 'dashed' : 'solid'} ${customize ? th.hairS : th.hair}`,
        borderRadius: 2,
        padding: 24
      }
    }, customize && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 13,
        left: 12,
        display: 'grid',
        gridTemplateColumns: 'repeat(2,3px)',
        gap: 3,
        cursor: 'grab'
      }
    }, [0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 3,
        height: 3,
        borderRadius: 999,
        background: th.ink4
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 22,
        height: 22,
        borderRadius: 2,
        border: `1px solid ${th.hair}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "x",
      size: 12,
      color: th.ink3
    }))), /*#__PURE__*/React.createElement(Over, {
      color: th.ink3,
      style: customize ? {
        marginLeft: 16
      } : {}
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, children));
  }
  function renderWidget(key, th, dark) {
    switch (key) {
      case 'volume':
        return wVolume(th);
      case 'today':
        return wToday(th);
      case 'pipeline':
        return wPipeline(th);
      case 'leaderboard':
        return wLeaderboard(th);
      case 'trust':
        return wTrust(th);
      case 'closings':
        return wClosings(th, dark);
      case 'listings':
        return wListings(th, dark);
      case 'income':
        return wIncome(th);
      case 'nextshoot':
        return wNextShoot(th);
      case 'followups':
        return wFollowups(th);
      default:
        return null;
    }
  }
  function wVolume(th) {
    const spark = [3, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14, 17, 18, 16, 20, 22, 24, 22, 26, 28, 30, 32];
    const m = Math.max(...spark);
    const path = spark.map((v, i) => `${i === 0 ? 'M' : 'L'}${i / (spark.length - 1) * 560},${72 - v / m * 64}`).join(' ');
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 24,
        letterSpacing: -0.5
      }
    }, "184 ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: th.ink3,
        fontSize: 13
      }
    }, "jobs")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, ['7d', '30d', '90d'].map(p => /*#__PURE__*/React.createElement("div", {
      key: p,
      style: {
        padding: '4px 9px',
        fontSize: 11,
        fontFamily: F.mono,
        color: p === '30d' ? th.ink : th.ink3,
        background: p === '30d' ? th.surf2 : 'transparent',
        border: `1px solid ${p === '30d' ? th.hairS : 'transparent'}`,
        borderRadius: 2
      }
    }, p)))), /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 560 92",
      style: {
        width: '100%',
        height: 104,
        marginTop: 14,
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: path + ' L560,92 L0,92 Z',
      fill: T.brick,
      opacity: "0.08"
    }), /*#__PURE__*/React.createElement("path", {
      d: path,
      stroke: T.brick,
      strokeWidth: "1.5",
      fill: "none"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 560,
      cy: 72 - 32 / m * 64,
      r: "3",
      fill: T.brick
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 6,
        fontFamily: F.mono,
        fontSize: 10,
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("span", null, "MAR 26"), /*#__PURE__*/React.createElement("span", null, "APR 02"), /*#__PURE__*/React.createElement("span", null, "APR 09"), /*#__PURE__*/React.createElement("span", null, "APR 16")));
  }
  function wToday(th) {
    const rows = [['09:00', 'Pine Rd, 1902', 'A. Lindgren', 'ok'], ['11:30', 'Mercer Loop, 30', 'J. Reyes', 'ok'], ['14:30', 'Linden St, 214', 'J. Reyes', 'brick'], ['16:00', 'Alder Ave, 77', 'S. Okafor · auto', 'ok']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, rows.map(([t, addr, v, tone]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        padding: '9px 0',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink,
        width: 42
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5
      }
    }, addr), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: tone === 'warn' ? T.brickDeep : th.ink3,
        marginTop: 2
      }
    }, v)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 1,
        background: tone === 'brick' ? T.brick : tone === 'warn' ? T.warn : T.ok
      }
    }))));
  }
  function wPipeline(th) {
    // Clean list — no bars. Stage, deal count, and value. Plus total for context.
    const rows = [['New', 12, 3.1], ['Contacted', 9, 2.6], ['Showing', 6, 1.9], ['Offer', 4, 2.2], ['Won · 30d', 7, 1.6]];
    const total = rows.reduce((a, r) => a + r[2], 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, rows.map(([n, c, v]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink4,
        width: 56,
        textAlign: 'right'
      }
    }, c, " deals"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 13,
        color: th.ink,
        width: 52,
        textAlign: 'right'
      }
    }, "$", v.toFixed(1), "M")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '12px 0 0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: th.ink3
      }
    }, "Total pipeline"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 14,
        color: th.ink
      }
    }, "$", total.toFixed(1), "M")));
  }
  function wLeaderboard(th) {
    // Clean list — no bars. Rank, agent, deal count, revenue.
    const rows = [['M. Ortega', 34, 16.2], ['L. Park', 28, 13.5], ['K. Haddad', 21, 10.2], ['T. Winters', 19, 9.1]];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, rows.map(([n, j, rev], i) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '9px 0',
        borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink4,
        width: 12
      }
    }, i + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 2,
        background: T.brickSoft,
        color: T.brickDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 600
      }
    }, n.split(' ').map(x => x[0]).join('')), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 12.5,
        fontWeight: 500
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink4,
        width: 54,
        textAlign: 'right'
      }
    }, j, " deals"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 13,
        width: 56,
        textAlign: 'right'
      }
    }, "$", rev.toFixed(1), "K"))));
  }
  function wTrust(th) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 30,
        letterSpacing: -0.8
      }
    }, "$96,500"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink3,
        marginTop: 4
      }
    }, "12 deposits held in trust"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        background: th.surf2,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 24,
        height: 24,
        borderRadius: 999,
        background: T.okTint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "chk",
      size: 13,
      color: T.ok,
      sw: 2.4
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: th.ink2
      }
    }, "April reconciled \xB7 0 exceptions")));
  }
  function wClosings(th, dark) {
    const rows = [['8 Riverbend', 'Apr 26', '$1.28M', 'Firm', 'ok'], ['201 Oak Dr', 'Apr 29', '$910K', 'Financing', 'warn'], ['55 Birch Way', 'May 02', '$690K', 'Firm', 'ok']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, rows.map(([a, d, v, s, tone], i) => /*#__PURE__*/React.createElement("div", {
      key: a,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink3,
        width: 46
      }
    }, d), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12.5,
        fontWeight: 500
      }
    }, a), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        marginRight: 8
      }
    }, v), /*#__PURE__*/React.createElement(Pill, {
      tone: tone,
      dark: dark
    }, s))));
  }
  function wListings(th, dark) {
    const rows = [['214 Linden St', 'Media in edit', '$1.15M', 'warn'], ['77 Alder Ave', 'Shoot today · 16:00', '$740K', 'brick'], ['8 Riverbend', 'Delivered', '$1.28M', 'ok'], ['201 Oak Dr', 'Live on MLS', '$910K', 'ok']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, rows.map(([a, s, v, tone]) => /*#__PURE__*/React.createElement("div", {
      key: a,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: 12,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement(Img, {
      w: 44,
      h: 44,
      label: "",
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, a), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Pill, {
      tone: tone,
      dark: dark
    }, s), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 11.5
      }
    }, v))))));
  }
  function wIncome(th) {
    const bars = [0.5, 0.62, 0.55, 0.7, 0.82, 0.9];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 30,
        letterSpacing: -0.8
      }
    }, "$214K"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: T.ok
      }
    }, "82% to goal")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 5,
        background: th.surf2,
        borderRadius: 2,
        marginTop: 12,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '82%',
        height: '100%',
        background: T.brick
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink4,
        marginTop: 6,
        fontFamily: F.mono,
        letterSpacing: '0.1em'
      }
    }, "GOAL $260K \xB7 YEAR-END"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        marginTop: 16,
        height: 48
      }
    }, bars.map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        height: `${b * 100}%`,
        background: i === bars.length - 1 ? T.brick : th.surf2,
        borderRadius: 1
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 6,
        fontFamily: F.mono,
        fontSize: 9,
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("span", null, "NOV"), /*#__PURE__*/React.createElement("span", null, "APR")));
  }
  function wNextShoot(th) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16,
        background: T.ink,
        color: T.paper,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: "#F4D9CC"
    }, "In 3 hours"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 500,
        marginTop: 8,
        letterSpacing: -0.3
      }
    }, "214 Linden St"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#C8BFB0',
        marginTop: 4
      }
    }, "Today \xB7 14:30 \xB7 J. Reyes"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '7px 10px',
        border: '1px solid #F4F1EB26',
        borderRadius: 2,
        fontSize: 10.5,
        fontFamily: F.mono,
        letterSpacing: '0.1em'
      }
    }, "VIEW JOB"), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '7px 10px',
        border: '1px solid #F4F1EB26',
        borderRadius: 2,
        fontSize: 10.5,
        fontFamily: F.mono,
        letterSpacing: '0.1em'
      }
    }, "MESSAGE")), /*#__PURE__*/React.createElement(BrickMark, {
      size: 72,
      color: "#F4D9CC0F",
      style: {
        position: 'absolute',
        right: -8,
        top: -8
      }
    }));
  }
  function wFollowups(th) {
    const t = [['Call J. Delgado — showing feedback', false], ['Send APS · 8 Riverbend', false], ['Upload staging photos · 77 Alder', true], ['Confirm inspection · 201 Oak', false]];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, t.map(([l, done]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '9px 0',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 2,
        border: `1.5px solid ${done ? T.brick : th.hairS}`,
        background: done ? T.brick : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, done && /*#__PURE__*/React.createElement(I, {
      name: "chk",
      size: 11,
      color: "#fff",
      sw: 2.5
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: done ? th.ink3 : th.ink,
        textDecoration: done ? 'line-through' : 'none'
      }
    }, l))));
  }

  // Brokerage — web shell with all screens. dark toggle support.
  function BrokShell({
    dark = false,
    screen = 'overview',
    role = 'office',
    customize = false,
    locked = false
  }) {
    const th = useTheme(dark);
    const [cur, setCur] = React.useState(screen);
    const RC = BROK_ROLES[role] || BROK_ROLES.office;
    const NAV = RC.nav;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1440,
        height: 920,
        background: th.bg,
        color: th.ink,
        fontFamily: F.display,
        display: 'flex',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 232,
        borderRight: `1px solid ${th.hair}`,
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        background: th.bg
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 24px 28px'
      }
    }, /*#__PURE__*/React.createElement(Wordmark, {
      size: 17,
      color: th.ink
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 16px 10px'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, "Workspace"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: '12px 14px',
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, RC.wsNm), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 2
      }
    }, RC.wsMeta)), /*#__PURE__*/React.createElement(I, {
      name: "cD",
      size: 14,
      color: th.ink3
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }
    }, NAV.map((grp, gi) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: gi
    }, grp.group && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 14px 6px'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4,
      style: {
        fontSize: 9.5
      }
    }, grp.group)), grp.items.map(([ic, lb, k]) => {
      const on = k === cur;
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        role: locked ? undefined : "button",
        tabIndex: locked ? undefined : 0,
        onClick: locked ? undefined : () => setCur(k),
        onKeyDown: locked ? undefined : e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setCur(k);
          }
        },
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '9px 14px',
          borderRadius: 2,
          background: on ? th.surf2 : 'transparent',
          color: on ? th.ink : th.ink3,
          fontSize: 13.5,
          fontWeight: on ? 500 : 400,
          position: 'relative',
          cursor: locked ? 'default' : 'pointer'
        }
      }, on && /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: 0,
          top: 9,
          bottom: 9,
          width: 2,
          background: T.brick
        }
      }), /*#__PURE__*/React.createElement(I, {
        name: ic,
        size: 16,
        color: on ? th.ink : th.ink3
      }), lb);
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        padding: '16px 20px',
        borderTop: `1px solid ${th.hair}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: 2,
        background: T.brickSoft,
        color: T.brickDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600
      }
    }, RC.ini), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 500
      }
    }, RC.who), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3
      }
    }, RC.role)), /*#__PURE__*/React.createElement("div", {
      onClick: locked ? undefined : () => setCur('settings'),
      style: {
        cursor: locked ? 'default' : 'pointer',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "cog",
      size: 15,
      color: th.ink3
    })))), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: locked && cur === 'overview' ? 'hidden' : 'auto'
      }
    }, /*#__PURE__*/React.createElement(TopBar, {
      th: th,
      screen: cur
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: 28
      }
    }, cur === 'overview' && /*#__PURE__*/React.createElement(OverviewContent, {
      th: th,
      dark: dark,
      role: role,
      customize: customize
    }), cur === 'crm' && /*#__PURE__*/React.createElement(CRMContent, {
      th: th,
      dark: dark
    }), cur === 'transactions' && /*#__PURE__*/React.createElement(TransactionsContent, {
      th: th,
      dark: dark
    }), cur === 'mls' && /*#__PURE__*/React.createElement(MLSContent, {
      th: th,
      dark: dark
    }), cur === 'forms' && /*#__PURE__*/React.createElement(FormsContent, {
      th: th,
      dark: dark
    }), cur === 'jobs' && /*#__PURE__*/React.createElement(JobsContent, {
      th: th,
      dark: dark
    }), cur === 'jobdetail' && /*#__PURE__*/React.createElement(JobDetailContent, {
      th: th,
      dark: dark
    }), cur === 'vendors' && /*#__PURE__*/React.createElement(VendorsContent, {
      th: th,
      dark: dark
    }), cur === 'accounting' && /*#__PURE__*/React.createElement(AccountingContent, {
      th: th,
      dark: dark
    }), cur === 'billing' && /*#__PURE__*/React.createElement(BillingContent, {
      th: th,
      dark: dark
    }), cur === 'agents' && /*#__PURE__*/React.createElement(AgentsContent, {
      th: th,
      dark: dark
    }), cur === 'settings' && /*#__PURE__*/React.createElement(SettingsContent, {
      th: th,
      dark: dark
    }))));
  }
  function TopBar({
    th,
    screen
  }) {
    const titles = {
      overview: 'Overview',
      crm: 'CRM',
      transactions: 'Transactions',
      mls: 'MLS submission',
      forms: 'Forms & e-signatures',
      jobs: 'Jobs',
      jobdetail: 'Job · #08412',
      agents: 'Agents',
      vendors: 'Vendors',
      accounting: 'Accounting',
      billing: 'Billing',
      settings: 'Settings'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: 64,
        borderBottom: `1px solid ${th.hair}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 36px',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, titles[screen]), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        height: 16,
        background: th.hair
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2
      }
    }, "April 1 \u2014 18, 2026"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        fontSize: 12,
        color: th.ink3,
        width: 220
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "srch",
      size: 14,
      color: th.ink3
    }), /*#__PURE__*/React.createElement("span", null, "Search jobs, agents\u2026"), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        fontFamily: F.mono,
        fontSize: 10,
        color: th.ink4
      }
    }, "\u2318K")), /*#__PURE__*/React.createElement(I, {
      name: "bell",
      size: 17,
      color: th.ink3
    })));
  }

  // ─── OVERVIEW ───
  function OverviewContent({
    th,
    dark,
    role = 'office',
    customize = false
  }) {
    // Every role — brokerage, team, solo — renders the same customizable widget dashboard.
    return /*#__PURE__*/React.createElement(DashRole, {
      th: th,
      dark: dark,
      role: role,
      customize: customize
    });
  }
  function JobsTable({
    th,
    dark,
    jobs
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '100px 1.6fr 1fr 1fr 1fr 140px 120px',
        padding: '10px 24px',
        borderBottom: `1px solid ${th.hair}`,
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("div", null, "Job"), /*#__PURE__*/React.createElement("div", null, "Property"), /*#__PURE__*/React.createElement("div", null, "Agent"), /*#__PURE__*/React.createElement("div", null, "Vendor"), /*#__PURE__*/React.createElement("div", null, "When"), /*#__PURE__*/React.createElement("div", null, "Status"), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, "Amount")), jobs.map((j, i) => /*#__PURE__*/React.createElement("div", {
      key: j.id,
      style: {
        display: 'grid',
        gridTemplateColumns: '100px 1.6fr 1fr 1fr 1fr 140px 120px',
        padding: '16px 24px',
        borderBottom: i === jobs.length - 1 ? 'none' : `1px solid ${th.hair}`,
        fontSize: 13,
        color: th.ink,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink3
      }
    }, "#", j.id), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, j.addr), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 2
      }
    }, j.type)), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink2
      }
    }, j.agent), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink2
      }
    }, j.vendor), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink2
      }
    }, j.when), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
      tone: j.tone,
      dark: dark
    }, j.status)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        fontFamily: F.mono,
        fontSize: 13
      }
    }, j.amt))));
  }

  // Brokerage — remaining screens (Jobs, Job Detail, Agents, Vendors, Billing, Settings, Login)

  function JobsContent({
    th,
    dark
  }) {
    const jobs = [{
      id: '08412',
      addr: '214 Linden St',
      type: 'House',
      agent: 'M. Ortega',
      vendor: 'J. Reyes',
      when: 'Today · 14:30',
      status: 'In progress',
      tone: 'brick',
      amt: '$749'
    }, {
      id: '08411',
      addr: '77 Alder Ave',
      type: 'Condo',
      agent: 'L. Park',
      vendor: 'S. Okafor',
      when: 'Today · 16:00',
      status: 'Scheduled',
      tone: 'neutral',
      amt: '$379'
    }, {
      id: '08410',
      addr: '1902 Pine Rd',
      type: 'House',
      agent: 'K. Haddad',
      vendor: 'A. Lindgren',
      when: 'Today · 09:00',
      status: 'Editing',
      tone: 'warn',
      amt: '$599'
    }, {
      id: '08409',
      addr: '30 Mercer Loop',
      type: 'Townhouse',
      agent: 'T. Winters',
      vendor: 'J. Reyes',
      when: 'Yesterday',
      status: 'Delivered',
      tone: 'ok',
      amt: '$749'
    }, {
      id: '08408',
      addr: '8 Riverbend',
      type: 'House',
      agent: 'N. Obayemi',
      vendor: 'A. Lindgren',
      when: 'Yesterday',
      status: 'Delivered',
      tone: 'ok',
      amt: '$1,199'
    }, {
      id: '08407',
      addr: '55 Birch Way',
      type: 'Condo',
      agent: 'M. Ortega',
      vendor: 'S. Okafor',
      when: '2 days ago',
      status: 'Delivered',
      tone: 'ok',
      amt: '$379'
    }, {
      id: '08406',
      addr: '112 Ash Ct',
      type: 'House',
      agent: 'L. Park',
      vendor: 'A. Lindgren',
      when: 'Apr 14',
      status: 'Delivered',
      tone: 'ok',
      amt: '$599'
    }, {
      id: '08405',
      addr: '9 Harbor Way',
      type: 'Condo',
      agent: 'T. Winters',
      vendor: 'S. Okafor',
      when: 'Apr 14',
      status: 'Delivered',
      tone: 'ok',
      amt: '$379'
    }, {
      id: '08404',
      addr: '201 Oak Dr',
      type: 'House',
      agent: 'K. Haddad',
      vendor: 'J. Reyes',
      when: 'Apr 13',
      status: 'Delivered',
      tone: 'ok',
      amt: '$749'
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: -1
      }
    }, "Jobs"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 4
      }
    }, "184 this month \xB7 12 today")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      icon: "sliders"
    }, "Filter"), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      icon: "plus"
    }, "New job"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        borderBottom: `1px solid ${th.hair}`
      }
    }, ['All (184)', 'Scheduled (23)', 'In progress (8)', 'Editing (14)', 'Delivered (139)'].map((x, i) => /*#__PURE__*/React.createElement("div", {
      key: x,
      style: {
        padding: '12px 14px',
        fontSize: 13,
        color: i === 0 ? th.ink : th.ink3,
        borderBottom: `2px solid ${i === 0 ? T.brick : 'transparent'}`,
        marginBottom: -1
      }
    }, x))), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement(JobsTable, {
      th: th,
      dark: dark,
      jobs: jobs
    })));
  }
  function JobDetailContent({
    th,
    dark
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, "Jobs \u2192 #08412"), /*#__PURE__*/React.createElement(Pill, {
      tone: "brick",
      dark: dark
    }, "In progress")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: -1
      }
    }, "214 Linden St"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 4
      }
    }, "Toronto, ON \xB7 House \xB7 2,140 sqft")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      icon: "dl"
    }, "Download assets"), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark
    }, "Message vendor"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        background: th.hair,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: th.bg,
        padding: 0
      }
    }, /*#__PURE__*/React.createElement(Img, {
      w: "100%",
      h: 320,
      label: "PROPERTY HERO \u2014 LINDEN ST",
      dark: dark,
      r: 0
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        background: th.bg,
        padding: 28
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Timeline"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }
    }, [['Booked', 'Apr 16 · 10:04', 'M. Ortega booked Premium package', true], ['Scheduled', 'Apr 17 · 09:12', 'J. Reyes assigned · 14:30 arrival', true], ['Shooting', 'Apr 18 · 14:30', 'Vendor on site', true], ['Editing', '—', 'Queued for 24h turnaround', false], ['Delivered', '—', '—', false]].map(([t, when, detail, done], i) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        gap: 16,
        paddingBottom: 20,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 999,
        background: done ? T.brick : th.surf2,
        border: `1.5px solid ${done ? T.brick : th.hairS}`
      }
    }), i < 4 && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        flex: 1,
        background: th.hair,
        marginTop: 4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: done ? th.ink : th.ink3
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink4,
        marginTop: 2
      }
    }, when), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 6
      }
    }, detail))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Package"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 500,
        marginTop: 10,
        letterSpacing: -0.3
      }
    }, "Premium \xB7 $749"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink3,
        marginTop: 6
      }
    }, "40 photos \xB7 Drone \xB7 60-sec reel \xB7 Floor plan")), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "People"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, [['M. Ortega', 'Agent', 'EA'], ['J. Reyes', 'Vendor', 'JR'], ['Ashfield', 'Office', 'AS']].map(([n, r, in2]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 2,
        background: T.brickSoft,
        color: T.brickDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 600
      }
    }, in2), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3
      }
    }, r)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Deliverables"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [['Photos', '0 / 40', false], ['Drone', '0 / 5', false], ['Reel', 'Pending', false], ['Floor plan', 'Pending', false]].map(([n, v, done]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '6px 0',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink3
      }
    }, v))))))));
  }
  function AgentsContent({
    th,
    dark
  }) {
    const agents = [['M. Ortega', 'ortega@harbor.co', 34, '$16,240', 'Active'], ['L. Park', 'park@harbor.co', 28, '$13,480', 'Active'], ['K. Haddad', 'haddad@harbor.co', 21, '$10,240', 'Active'], ['T. Winters', 'winters@harbor.co', 19, '$9,120', 'Active'], ['N. Obayemi', 'obayemi@harbor.co', 17, '$8,400', 'Active'], ['R. Shimizu', 'shimizu@harbor.co', 14, '$6,720', 'Active'], ['P. Alvarez', 'alvarez@harbor.co', 9, '$4,320', 'Paused']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: -1
      }
    }, "Agents"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 4
      }
    }, "47 active \xB7 3 invited")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark
    }, "Invite link"), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      icon: "plus"
    }, "Add agent"))), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 1fr 1fr 140px 60px',
        padding: '10px 24px',
        borderBottom: `1px solid ${th.hair}`,
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("div", null, "Name"), /*#__PURE__*/React.createElement("div", null, "Email"), /*#__PURE__*/React.createElement("div", null, "Jobs \xB7 30d"), /*#__PURE__*/React.createElement("div", null, "Revenue"), /*#__PURE__*/React.createElement("div", null, "Status"), /*#__PURE__*/React.createElement("div", null)), agents.map(([n, e, j, r, s], i) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 1fr 1fr 140px 60px',
        padding: '16px 24px',
        borderBottom: i === agents.length - 1 ? 'none' : `1px solid ${th.hair}`,
        fontSize: 13,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 2,
        background: T.brickSoft,
        color: T.brickDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 600
      }
    }, n.split(' ').map(x => x[0]).join('')), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 500
      }
    }, n)), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink3,
        fontFamily: F.mono,
        fontSize: 12
      }
    }, e), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 13
      }
    }, j), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 13
      }
    }, r), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
      tone: s === 'Active' ? 'ok' : 'neutral',
      dark: dark
    }, s)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "dots",
      size: 16,
      color: th.ink3
    }))))));
  }
  function VendorsContent({
    th,
    dark
  }) {
    const vendors = [['J. Reyes', 'Photography + drone', 64, 4.9, '$28,400'], ['A. Lindgren', 'Photography + reel', 48, 4.8, '$21,600'], ['S. Okafor', 'Photography', 41, 4.9, '$16,400'], ['D. Cheng', 'Drone specialist', 22, 4.7, '$8,800'], ['M. Weston', 'Reel + editing', 18, 4.8, '$7,200']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: -1
      }
    }, "Vendors"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 4
      }
    }, "5 active vendors")), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      icon: "plus"
    }, "Invite vendor")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 20
      }
    }, vendors.map(([n, role, j, r, rev]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24,
        display: 'flex',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 2,
        background: T.brickSoft,
        color: T.brickDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: 600
      }
    }, n.split(' ').map(x => x[0]).join('')), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 500
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink3,
        marginTop: 2
      }
    }, role), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 1,
        background: th.hair,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, [['JOBS · 30d', j], ['RATING', r.toString()], ['REVENUE', rev]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        background: th.bg,
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 9,
        letterSpacing: '0.14em',
        color: th.ink4
      }
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 15,
        marginTop: 4
      }
    }, v)))))))));
  }
  function BillingContent({
    th,
    dark
  }) {
    const invoices = [['INV–1042', 'Apr 15, 2026', '$12,480', 'Paid', 'ok'], ['INV–1041', 'Apr 08, 2026', '$9,320', 'Paid', 'ok'], ['INV–1040', 'Apr 01, 2026', '$14,120', 'Paid', 'ok'], ['INV–1039', 'Mar 24, 2026', '$11,600', 'Pending', 'warn'], ['INV–1038', 'Mar 17, 2026', '$8,240', 'Paid', 'ok']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: -1
      }
    }, "Billing"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 4
      }
    }, "April cycle \xB7 closes Apr 30")), /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      icon: "dl"
    }, "Export statement")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 1,
        background: th.hair,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, [['CURRENT BALANCE', '$11,600'], ['PAID · APRIL', '$35,920'], ['NEXT CHARGE', 'Apr 30']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        background: th.bg,
        padding: '24px 24px 22px'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 32,
        letterSpacing: -0.8,
        marginTop: 14,
        color: th.ink,
        lineHeight: 1
      }
    }, v)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 24px',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Invoices")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 120px 60px',
        padding: '10px 24px',
        borderBottom: `1px solid ${th.hair}`,
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("div", null, "Invoice"), /*#__PURE__*/React.createElement("div", null, "Date"), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, "Amount"), /*#__PURE__*/React.createElement("div", null, "Status"), /*#__PURE__*/React.createElement("div", null)), invoices.map(([id, d, a, s, tone], i) => /*#__PURE__*/React.createElement("div", {
      key: id,
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 120px 60px',
        padding: '14px 24px',
        borderBottom: i === invoices.length - 1 ? 'none' : `1px solid ${th.hair}`,
        fontSize: 13,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono
      }
    }, id), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink3
      }
    }, d), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        fontFamily: F.mono
      }
    }, a), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
      tone: tone,
      dark: dark
    }, s)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "dl",
      size: 14,
      color: th.ink3
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Payment method"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        padding: 18,
        background: th.surf2,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "cards",
      size: 18,
      color: th.ink2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 13
      }
    }, "\u2022\u2022\u2022\u2022 4242")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 6
      }
    }, "Expires 08 / 28 \xB7 Visa")), /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      full: true,
      style: {
        marginTop: 14
      }
    }, "Update card"))));
  }
  function SettingsContent({
    th,
    dark
  }) {
    const sections = [['Office', [['Name', 'Ashfield'], ['Domain', 'harbor.co'], ['Time zone', 'America / Toronto']]], ['Defaults', [['Default package', 'Standard · $379'], ['Turnaround SLA', '24 hours'], ['Auto-assign vendor', 'On · nearest']]], ['Notifications', [['New booking', 'Email + push'], ['Delivery ready', 'Email'], ['Weekly digest', 'Monday 8:00']]]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: -1
      }
    }, "Settings"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 4
      }
    }, "Office \xB7 team \xB7 preferences")), sections.map(([title, rows]) => /*#__PURE__*/React.createElement("div", {
      key: title,
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 24px',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, title)), rows.map(([l, v], i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${th.hair}`,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, l), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: th.ink2,
        fontSize: 13
      }
    }, v, " ", /*#__PURE__*/React.createElement(I, {
      name: "cR",
      size: 14,
      color: th.ink3
    })))))));
  }

  // ─── SHARED · KPI strip for OS modules ───
  function KpiRow({
    th,
    items
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${items.length},1fr)`,
        gap: 1,
        background: th.hair,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, items.map((k, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: th.bg,
        padding: '22px 24px 20px'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, k.l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 32,
        letterSpacing: -0.9,
        marginTop: 12,
        color: th.ink,
        lineHeight: 1
      }
    }, k.v), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12
      }
    }, k.d && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: k.down ? T.bad : T.ok,
        fontFamily: F.mono,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: k.down ? 'arrD' : 'arrU',
      size: 11,
      color: k.down ? T.bad : T.ok
    }), k.d), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: th.ink4
      }
    }, k.s)))));
  }
  function ModHead({
    th,
    dark,
    title,
    sub,
    actions
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 500,
        letterSpacing: -1
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 4
      }
    }, sub)), actions && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, actions));
  }

  // ─── CRM · pipeline board ───
  function CRMContent({
    th,
    dark
  }) {
    const kpis = [{
      l: 'New leads · 30d',
      v: '38',
      d: '+9',
      s: 'vs 29 prev.'
    }, {
      l: 'Pipeline value',
      v: '$14.2M',
      d: '+6.1%',
      s: '48 active deals'
    }, {
      l: 'Win rate',
      v: '32%',
      d: '+3pt',
      s: 'last 90 days'
    }, {
      l: 'Days to close',
      v: '41',
      d: '−5',
      s: 'offer → firm'
    }];
    const cols = [{
      name: 'New',
      dot: th.ink4,
      count: 3,
      sum: '$2.8M',
      cards: [['Priya Nair', '92 Rowan Cres', '$1.24M', '2d', 'New lead', 'brick'], ['The Okonkwos', '15 Cedar Pt', '$860K', '1d', 'Web form', 'neutral'], ['D. Michaux', '410 Queen W', '$720K', '4h', 'Referral', 'neutral']]
    }, {
      name: 'Contacted',
      dot: T.warn,
      count: 2,
      sum: '$2.6M',
      cards: [['R. & S. Bhatt', '88 Maple Grove', '$1.60M', '5d', 'Call booked', 'warn'], ['Lena Poirier', '7 Birchway', '$980K', '3d', 'Nurture', 'neutral']]
    }, {
      name: 'Showing',
      dot: T.brick,
      count: 2,
      sum: '$1.9M',
      cards: [['J. Delgado', '214 Linden St', '$1.15M', '6d', '2nd showing', 'brick'], ['A. Fournier', '30 Mercer Loop', '$740K', '2d', 'Booked Sat', 'neutral']]
    }, {
      name: 'Offer',
      dot: '#3E6DA6',
      count: 2,
      sum: '$2.2M',
      cards: [['M. Ortega', '8 Riverbend', '$1.28M', '1d', 'Reviewing', 'warn'], ['K. Haddad', '201 Oak Dr', '$910K', '3d', 'Countered', 'warn']]
    }, {
      name: 'Won · 30d',
      dot: T.ok,
      count: 2,
      sum: '$1.6M',
      cards: [['T. Winters', '55 Birch Way', '$690K', '—', 'Firm', 'ok'], ['N. Obayemi', '112 Ash Ct', '$905K', '—', 'Closed', 'ok']]
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModHead, {
      th: th,
      dark: dark,
      title: "CRM",
      sub: "312 contacts \xB7 48 active deals \xB7 9 follow-ups due today",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
        variant: "ghost",
        dark: dark,
        icon: "sliders"
      }, "Segment"), /*#__PURE__*/React.createElement(Btn, {
        variant: "primary",
        dark: dark,
        icon: "plus"
      }, "Add contact"))
    }), /*#__PURE__*/React.createElement(KpiRow, {
      th: th,
      items: kpis
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5,1fr)',
        gap: 1,
        background: th.hair,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, cols.map(col => /*#__PURE__*/React.createElement("div", {
      key: col.name,
      style: {
        background: th.bg,
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 420
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 1,
        background: col.dot
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500
      }
    }, col.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink4
      }
    }, col.count)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink3
      }
    }, col.sum)), col.cards.map(([n, addr, val, age, tag, tone]) => /*#__PURE__*/React.createElement("div", {
      key: n + addr,
      style: {
        padding: 14,
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        background: th.bg
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: th.ink3,
        marginTop: 3
      }
    }, addr), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 14,
        marginTop: 10,
        color: th.ink
      }
    }, val), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Pill, {
      tone: tone,
      dark: dark
    }, tag), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 10,
        color: th.ink4,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "clk",
      size: 10,
      color: th.ink4
    }), age))))))));
  }

  // ─── TRANSACTIONS · living deal register ───
  // New deals unshift at the top; the list translates down as one strip so the
  // visible window reads as growth (bottom row is pushed out, not faded).
  // openCount only climbs, even when incoming addresses recycle.
  const TX_VISIBLE = 6;
  const TX_ROW_H = 64;
  const TX_SLIDE_MS = 640;
  const TX_SEED_COUNT = 48;
  const TX_SEED = [{
    addr: '214 Linden St',
    client: 'J. Delgado',
    side: 'Listing',
    price: '$1.15M',
    close: 'Apr 24',
    note: '2 pending',
    status: 'Conditional',
    tone: 'warn'
  }, {
    addr: '8 Riverbend',
    client: 'M. Ortega',
    side: 'Buyer',
    price: '$1.28M',
    close: 'Apr 26',
    note: 'Firm',
    status: 'Firm',
    tone: 'ok'
  }, {
    addr: '201 Oak Dr',
    client: 'K. Haddad',
    side: 'Listing',
    price: '$910K',
    close: 'Apr 29',
    note: 'Financing',
    status: 'Conditional',
    tone: 'warn'
  }, {
    addr: '55 Birch Way',
    client: 'T. Winters',
    side: 'Buyer',
    price: '$690K',
    close: 'May 02',
    note: 'Firm',
    status: 'Firm',
    tone: 'ok'
  }, {
    addr: '30 Mercer Loop',
    client: 'A. Fournier',
    side: 'Listing',
    price: '$740K',
    close: 'May 06',
    note: 'Inspection',
    status: 'Conditional',
    tone: 'warn'
  }, {
    addr: '112 Ash Ct',
    client: 'N. Obayemi',
    side: 'Buyer',
    price: '$905K',
    close: 'May 09',
    note: '—',
    status: 'Closed',
    tone: 'ok'
  }];
  const TX_INCOMING = [{
    addr: '77 Wellesley',
    client: 'P. Nakamura',
    side: 'Buyer',
    price: '$1.32M',
    close: 'May 12',
    note: 'New offer',
    status: 'Conditional',
    tone: 'warn'
  }, {
    addr: '19 Distillery Ln',
    client: 'R. Costa',
    side: 'Listing',
    price: '$860K',
    close: 'May 14',
    note: 'Awaiting docs',
    status: 'Conditional',
    tone: 'warn'
  }, {
    addr: '402 King St W',
    client: 'S. Iyer',
    side: 'Buyer',
    price: '$1.05M',
    close: 'May 16',
    note: 'Financing',
    status: 'Conditional',
    tone: 'warn'
  }, {
    addr: '66 Sorauren',
    client: 'J. Whitfield',
    side: 'Listing',
    price: '$975K',
    close: 'May 18',
    note: 'Inspection',
    status: 'Conditional',
    tone: 'warn'
  }, {
    addr: '9 Bellwoods',
    client: 'A. Beaulieu',
    side: 'Buyer',
    price: '$1.48M',
    close: 'May 20',
    note: 'New offer',
    status: 'Firm',
    tone: 'ok'
  }, {
    addr: '41 Palmerston',
    client: 'L. Chen',
    side: 'Listing',
    price: '$820K',
    close: 'May 21',
    note: '2 pending',
    status: 'Conditional',
    tone: 'warn'
  }, {
    addr: '18 Shaw St',
    client: 'D. Okonkwo',
    side: 'Buyer',
    price: '$1.10M',
    close: 'May 22',
    note: 'Firm',
    status: 'Firm',
    tone: 'ok'
  }, {
    addr: '5 Gladstone',
    client: 'M. Santos',
    side: 'Listing',
    price: '$790K',
    close: 'May 23',
    note: 'New listing',
    status: 'Conditional',
    tone: 'warn'
  }];
  function txPrefersReduce() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }
  function TransactionsContent({
    th,
    dark
  }) {
    const [deals, setDeals] = React.useState(() => TX_SEED.map((d, i) => ({
      ...d,
      id: 'seed-' + i
    })));
    const [openCount, setOpenCount] = React.useState(TX_SEED_COUNT);
    const [reduce, setReduce] = React.useState(txPrefersReduce);
    const [phase, setPhase] = React.useState('idle'); // idle | primed | sliding
    const [freshId, setFreshId] = React.useState(null);
    const listRef = React.useRef(null);
    const incomingRef = React.useRef(0);
    const seqRef = React.useRef(0);
    React.useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const apply = () => setReduce(mq.matches);
      apply();
      if (mq.addEventListener) mq.addEventListener('change', apply);else mq.addListener(apply);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', apply);else mq.removeListener(apply);
      };
    }, []);
    React.useEffect(() => {
      if (reduce) setPhase('idle');
    }, [reduce]);
    React.useLayoutEffect(() => {
      if (phase !== 'primed') return;
      const el = listRef.current;
      if (el) void el.getBoundingClientRect();
      setPhase('sliding');
    }, [phase]);
    React.useEffect(() => {
      if (!freshId) return;
      const t = setTimeout(() => setFreshId(cur => cur === freshId ? null : cur), TX_SLIDE_MS + 180);
      return () => clearTimeout(t);
    }, [freshId]);
    React.useEffect(() => {
      if (reduce) return;
      let timer;
      const schedule = ms => {
        timer = setTimeout(land, ms);
      };
      const land = () => {
        const src = TX_INCOMING[incomingRef.current % TX_INCOMING.length];
        incomingRef.current += 1;
        seqRef.current += 1;
        const id = 'in-' + seqRef.current;
        setDeals(prev => [{
          ...src,
          id
        }, ...prev].slice(0, TX_VISIBLE + 2));
        setOpenCount(c => c + 1);
        setFreshId(id);
        setPhase('primed');
        schedule(3600 + Math.floor(Math.random() * 1400));
      };
      schedule(2200);
      return () => clearTimeout(timer);
    }, [reduce]);
    const onSlideEnd = e => {
      if (e.propertyName !== 'transform') return;
      if (phase !== 'sliding') return;
      setDeals(prev => prev.slice(0, TX_VISIBLE));
      setPhase('idle');
    };
    const kpis = [{
      l: 'Closing this week',
      v: '6',
      d: null,
      s: '$5.9M volume'
    }, {
      l: 'GCI in escrow',
      v: '$214K',
      d: '+8.2%',
      s: `across ${openCount} deals`
    }, {
      l: 'Conditions pending',
      v: '12',
      d: null,
      s: '4 due ≤ 48h',
      down: true
    }, {
      l: 'Docs to sign',
      v: '9',
      d: null,
      s: '3 buyers waiting'
    }];
    const timeline = [['Listed', 'Apr 02', 'Live on TRREB · MLS #C7841902', true], ['Offer accepted', 'Apr 17', '$1.15M · 3 conditions', true], ['Conditions', 'Apr 24', 'Financing + inspection pending', 'now'], ['Firm & binding', '—', 'All conditions waived', false], ['Close', 'May 24', 'Keys + funds released', false]];
    const sliding = phase === 'sliding';
    const offset = phase === 'primed' ? -TX_ROW_H : 0;
    const freshBg = dark ? 'rgba(210,84,43,0.18)' : T.brickTint;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModHead, {
      th: th,
      dark: dark,
      title: "Transactions",
      sub: `${openCount} open · 6 closing this week · listing to close in one timeline`,
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
        variant: "ghost",
        dark: dark,
        icon: "sliders"
      }, "Filter"), /*#__PURE__*/React.createElement(Btn, {
        variant: "primary",
        dark: dark,
        icon: "plus"
      }, "New deal"))
    }), /*#__PURE__*/React.createElement(KpiRow, {
      th: th,
      items: kpis
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 24px',
        borderBottom: `1px solid ${th.hair}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Open deals"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2
      }
    }, ['All', 'Conditional', 'Firm', 'Closed'].map((x, i) => /*#__PURE__*/React.createElement("div", {
      key: x,
      style: {
        padding: '6px 12px',
        fontSize: 12,
        color: i === 0 ? th.ink : th.ink3,
        background: i === 0 ? th.surf2 : 'transparent',
        borderRadius: 2
      }
    }, x)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 0.8fr 1fr 0.8fr 130px',
        padding: '10px 24px',
        borderBottom: `1px solid ${th.hair}`,
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("div", null, "Property"), /*#__PURE__*/React.createElement("div", null, "Client"), /*#__PURE__*/React.createElement("div", null, "Side"), /*#__PURE__*/React.createElement("div", null, "Price"), /*#__PURE__*/React.createElement("div", null, "Close"), /*#__PURE__*/React.createElement("div", null, "Status")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: TX_VISIBLE * TX_ROW_H,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      ref: listRef,
      onTransitionEnd: onSlideEnd,
      style: {
        transform: `translate3d(0, ${offset}px, 0)`,
        transition: !reduce && sliding ? `transform ${TX_SLIDE_MS}ms cubic-bezier(0.16, 0.8, 0.3, 1)` : 'none',
        willChange: sliding ? 'transform' : 'auto'
      }
    }, deals.map(d => /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 0.8fr 1fr 0.8fr 130px',
        padding: '0 24px',
        height: TX_ROW_H,
        boxSizing: 'border-box',
        borderBottom: `1px solid ${th.hair}`,
        fontSize: 13,
        alignItems: 'center',
        background: d.id === freshId ? freshBg : 'transparent',
        transition: reduce ? 'none' : 'background 1.4s ease'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500
      }
    }, d.addr), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink4,
        marginTop: 2
      }
    }, d.note)), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink2
      }
    }, d.client), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink3,
        fontFamily: F.mono,
        fontSize: 11
      }
    }, d.side), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 13
      }
    }, d.price), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink2
      }
    }, d.close), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
      tone: d.tone,
      dark: dark
    }, d.status))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24,
        alignSelf: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "214 Linden St"), /*#__PURE__*/React.createElement(Pill, {
      tone: "warn",
      dark: dark
    }, "Conditional")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink4,
        marginTop: 8
      }
    }, "MLS #C7841902 \xB7 $1.15M"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20
      }
    }, timeline.map(([t, when, detail, state], i) => {
      const done = state === true,
        now = state === 'now';
      return /*#__PURE__*/React.createElement("div", {
        key: t,
        style: {
          display: 'flex',
          gap: 14,
          paddingBottom: i === timeline.length - 1 ? 0 : 18
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 11,
          height: 11,
          borderRadius: 999,
          background: done ? T.brick : now ? T.paper : th.surf2,
          border: `1.5px solid ${done || now ? T.brick : th.hairS}`,
          boxShadow: now ? `0 0 0 3px ${T.brickTint}` : 'none'
        }
      }), i < timeline.length - 1 && /*#__PURE__*/React.createElement("div", {
        style: {
          width: 1,
          flex: 1,
          minHeight: 24,
          background: done ? T.brick : th.hair,
          marginTop: 3
        }
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 500,
          color: done || now ? th.ink : th.ink3
        }
      }, t), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F.mono,
          fontSize: 10.5,
          color: th.ink4,
          marginTop: 2
        }
      }, when), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: th.ink2,
          marginTop: 5
        }
      }, detail)));
    })), /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      full: true,
      icon: "arr",
      style: {
        marginTop: 20
      }
    }, "Open deal"))));
  }

  // ─── MLS SUBMISSION · queue + validation ───
  function MLSContent({
    th,
    dark
  }) {
    const kpis = [{
      l: 'Submitted · 30d',
      v: '52',
      d: '+11',
      s: 'zero re-keying'
    }, {
      l: 'Live listings',
      v: '34',
      d: null,
      s: 'across 3 boards'
    }, {
      l: 'Validation errors',
      v: '1',
      d: null,
      s: 'needs a fix',
      down: true
    }, {
      l: 'Avg. time to live',
      v: '26m',
      d: '−12m',
      s: 'submit → active'
    }];
    const queue = [['214 Linden St', 'TRREB', 'C7841902', '28 / 28', 'Live', 'ok'], ['8 Riverbend', 'TRREB', 'C7841880', '28 / 28', 'Submitted', 'brick'], ['201 Oak Dr', 'Pillar 9', 'A2094117', '27 / 28', 'Validated', 'neutral'], ['30 Mercer Loop', 'TRREB', '—', '25 / 28', 'Draft', 'warn'], ['9 Harbor Way', 'CREA DDF', 'X8820431', '28 / 28', 'Live', 'ok']];
    const checks = [['Address & PIN', 'Matched to GeoWarehouse', true], ['Room dimensions', '12 rooms measured', true], ['Photos ≥ 6', '40 attached', true], ['Commission to co-op', '2.5% specified', true], ['Inclusions text', 'Missing — add before submit', false]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModHead, {
      th: th,
      dark: dark,
      title: "MLS submission",
      sub: "TRREB \xB7 Pillar 9 \xB7 CREA DDF \u2014 board-ready packages from the data you already entered",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
        variant: "ghost",
        dark: dark
      }, "Board settings"), /*#__PURE__*/React.createElement(Btn, {
        variant: "primary",
        dark: dark,
        icon: "up"
      }, "New submission"))
    }), /*#__PURE__*/React.createElement(KpiRow, {
      th: th,
      items: kpis
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 24px',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Submission queue")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr 1fr 0.9fr 130px',
        padding: '10px 24px',
        borderBottom: `1px solid ${th.hair}`,
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("div", null, "Property"), /*#__PURE__*/React.createElement("div", null, "Board"), /*#__PURE__*/React.createElement("div", null, "MLS #"), /*#__PURE__*/React.createElement("div", null, "Fields"), /*#__PURE__*/React.createElement("div", null, "Status")), queue.map((q, i) => /*#__PURE__*/React.createElement("div", {
      key: q[0],
      style: {
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr 1fr 0.9fr 130px',
        padding: '15px 24px',
        borderBottom: i === queue.length - 1 ? 'none' : `1px solid ${th.hair}`,
        fontSize: 13,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500
      }
    }, q[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink2
      }
    }, q[1]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink3
      }
    }, q[2]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: q[3].startsWith('28') ? th.ink2 : T.warn
      }
    }, q[3]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
      tone: q[5],
      dark: dark
    }, q[4]))))), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24,
        alignSelf: 'start'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Validation \xB7 30 Mercer Loop"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink4,
        marginTop: 8
      }
    }, "TRREB \xB7 27 of 28 fields ready"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, checks.map(([l, d, ok]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        gap: 12,
        padding: '11px 0',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 999,
        flexShrink: 0,
        background: ok ? T.okTint : T.warnTint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: ok ? 'chk' : 'x',
      size: 11,
      color: ok ? T.ok : T.warn,
      sw: 2.4
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        color: ok ? th.ink : T.warn
      }
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: th.ink3,
        marginTop: 2
      }
    }, d))))), /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      full: true,
      style: {
        marginTop: 18
      }
    }, "Fix & submit to TRREB"))));
  }

  // ─── FORMS & E-SIGN ───
  function FormsContent({
    th,
    dark
  }) {
    const kpis = [{
      l: 'Out for signature',
      v: '9',
      d: null,
      s: '3 buyers waiting'
    }, {
      l: 'Completed · 30d',
      v: '64',
      d: '+15',
      s: 'signed in-system'
    }, {
      l: 'Avg. turnaround',
      v: '3.4h',
      d: '−1.1h',
      s: 'sent → completed'
    }, {
      l: 'Form templates',
      v: '38',
      d: null,
      s: 'OREA + TRREB'
    }];
    const docs = [['Agreement of Purchase & Sale', 'Form 100', '214 Linden St', 'Buyer, Seller, 2 agents', 2, 3, 'Partially signed', 'warn'], ['Confirmation of Cooperation', 'Form 320', '8 Riverbend', 'Both offices', 2, 2, 'Completed', 'ok'], ['Listing Agreement', 'Form 200', '201 Oak Dr', 'Seller, Listing agent', 1, 2, 'Sent', 'neutral'], ['FINTRAC Individual ID', 'IIR', '30 Mercer Loop', 'Buyer', 0, 1, 'Draft', 'neutral'], ['Working with a Realtor', 'RECO', '55 Birch Way', 'Buyer', 1, 1, 'Completed', 'ok']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModHead, {
      th: th,
      dark: dark,
      title: "Forms & e-signatures",
      sub: "Provincial board forms \u2014 pre-filled from the deal, signed in-system. No DocuSign round-trips.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
        variant: "ghost",
        dark: dark,
        icon: "file"
      }, "Templates"), /*#__PURE__*/React.createElement(Btn, {
        variant: "primary",
        dark: dark,
        icon: "plus"
      }, "New document"))
    }), /*#__PURE__*/React.createElement(KpiRow, {
      th: th,
      items: kpis
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 24px',
        borderBottom: `1px solid ${th.hair}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Documents"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2
      }
    }, ['All', 'Awaiting', 'Completed'].map((x, i) => /*#__PURE__*/React.createElement("div", {
      key: x,
      style: {
        padding: '6px 12px',
        fontSize: 12,
        color: i === 0 ? th.ink : th.ink3,
        background: i === 0 ? th.surf2 : 'transparent',
        borderRadius: 2
      }
    }, x)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1.1fr 1.4fr 1fr 150px',
        padding: '10px 24px',
        borderBottom: `1px solid ${th.hair}`,
        fontFamily: F.mono,
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("div", null, "Document"), /*#__PURE__*/React.createElement("div", null, "Deal"), /*#__PURE__*/React.createElement("div", null, "Parties"), /*#__PURE__*/React.createElement("div", null, "Signatures"), /*#__PURE__*/React.createElement("div", null, "Status")), docs.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: d[0] + d[2],
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1.1fr 1.4fr 1fr 150px',
        padding: '15px 24px',
        borderBottom: i === docs.length - 1 ? 'none' : `1px solid ${th.hair}`,
        fontSize: 13,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "file",
      size: 17,
      color: th.ink3
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500
      }
    }, d[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 10.5,
        color: th.ink4,
        marginTop: 2
      }
    }, d[1]))), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink2
      }
    }, d[2]), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink3,
        fontSize: 12
      }
    }, d[3]), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 3
      }
    }, Array.from({
      length: d[5]
    }).map((_, j) => /*#__PURE__*/React.createElement("div", {
      key: j,
      style: {
        width: 8,
        height: 8,
        borderRadius: 999,
        background: j < d[4] ? T.brick : th.hairS
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink3
      }
    }, d[4], "/", d[5])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
      tone: d[7],
      dark: dark
    }, d[6]))))));
  }

  // ─── ACCOUNTING · commissions, trust, agent billing ───
  function AccountingContent({
    th,
    dark
  }) {
    const kpis = [{
      l: 'GCI · April',
      v: '$182K',
      d: '+9.4%',
      s: 'gross commission'
    }, {
      l: 'Company dollar',
      v: '$47.3K',
      d: '+6.0%',
      s: 'after agent splits'
    }, {
      l: 'Trust balance',
      v: '$96.5K',
      d: null,
      s: '12 deposits held'
    }, {
      l: 'Agent payables',
      v: '$134K',
      d: null,
      s: 'pays out May 1'
    }];
    const comm = [['8 Riverbend', 'M. Ortega', '$1.28M', '$32,000', '85 / 15', '$4,800', '$27,200', 'Ready', 'ok'], ['112 Ash Ct', 'N. Obayemi', '$905K', '$22,625', '80 / 20', '$4,525', '$18,100', 'Ready', 'ok'], ['55 Birch Way', 'T. Winters', '$690K', '$17,250', '80 / 20', '$3,450', '$13,800', 'Pending', 'warn'], ['201 Oak Dr', 'K. Haddad', '$910K', '$22,750', '85 / 15', '$3,413', '$19,338', 'Escrow', 'neutral']];
    const ledger = [['Deposit received', '8 Riverbend', '+$64,000', 'in'], ['Deposit received', '201 Oak Dr', '+$45,500', 'in'], ['Release to close', '112 Ash Ct', '−$45,250', 'out'], ['Commission paid', '55 Birch Way', '−$17,250', 'out']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ModHead, {
      th: th,
      dark: dark,
      title: "Accounting",
      sub: "Commissions, trust ledger and agent billing \u2014 reconciled against every closed deal",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
        variant: "ghost",
        dark: dark,
        icon: "dl"
      }, "Export ledger"), /*#__PURE__*/React.createElement(Btn, {
        variant: "primary",
        dark: dark
      }, "Run payouts"))
    }), /*#__PURE__*/React.createElement(KpiRow, {
      th: th,
      items: kpis
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 24px',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Commission runs \xB7 April")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr 1fr 0.9fr 1fr 110px',
        padding: '10px 24px',
        borderBottom: `1px solid ${th.hair}`,
        fontFamily: F.mono,
        fontSize: 9.5,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: th.ink4
      }
    }, /*#__PURE__*/React.createElement("div", null, "Deal"), /*#__PURE__*/React.createElement("div", null, "Agent"), /*#__PURE__*/React.createElement("div", null, "GCI"), /*#__PURE__*/React.createElement("div", null, "Split"), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, "Agent net"), /*#__PURE__*/React.createElement("div", null, "Status")), comm.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: c[0],
      style: {
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr 1fr 0.9fr 1fr 110px',
        padding: '15px 24px',
        borderBottom: i === comm.length - 1 ? 'none' : `1px solid ${th.hair}`,
        fontSize: 13,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500
      }
    }, c[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 10.5,
        color: th.ink4,
        marginTop: 2
      }
    }, c[2])), /*#__PURE__*/React.createElement("div", {
      style: {
        color: th.ink2
      }
    }, c[1]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 13
      }
    }, c[3]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink3
      }
    }, c[4]), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        fontFamily: F.mono,
        fontSize: 13
      }
    }, c[6]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
      tone: c[8],
      dark: dark
    }, c[7]))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Trust ledger"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 13,
        color: th.ink
      }
    }, "$96,500")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        display: 'flex',
        flexDirection: 'column'
      }
    }, ledger.map(([l, d, amt, dir], i) => /*#__PURE__*/React.createElement("div", {
      key: l + d,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: i === ledger.length - 1 ? 'none' : `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 2,
        background: dir === 'in' ? T.okTint : th.surf2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: dir === 'in' ? 'arrD' : 'arrU',
      size: 13,
      color: dir === 'in' ? T.ok : th.ink3
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 500
      }
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink4,
        marginTop: 1
      }
    }, d)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 12.5,
        color: dir === 'in' ? T.ok : th.ink2
      }
    }, amt))))), /*#__PURE__*/React.createElement("div", {
      style: {
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Reconciliation"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 999,
        background: T.okTint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "chk",
      size: 14,
      color: T.ok,
      sw: 2.4
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2
      }
    }, "April trust reconciled to the penny \xB7 0 exceptions"))))));
  }

  // Login — split screen
  function BrokLogin({
    dark = false
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1440,
        height: 920,
        background: th.bg,
        color: th.ink,
        fontFamily: F.display,
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        borderRight: `1px solid ${th.hair}`,
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement(Wordmark, {
      size: 19,
      color: th.ink
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        maxWidth: 440
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, "Sign in"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 44,
        fontWeight: 500,
        letterSpacing: -1.4,
        marginTop: 12,
        lineHeight: 1.05
      }
    }, "Welcome back,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        color: th.ink3
      }
    }, "one less tab.")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Email"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        padding: '14px 16px',
        border: `1px solid ${th.hairS}`,
        borderRadius: 2,
        fontSize: 15
      }
    }, "elena@harbor.co")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Password"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        padding: '14px 16px',
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        fontSize: 15,
        color: th.ink3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        letterSpacing: 4
      }
    }, "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"), /*#__PURE__*/React.createElement(I, {
      name: "eye",
      size: 16,
      color: th.ink3
    }))), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      full: true,
      style: {
        marginTop: 8
      },
      icon: "arr"
    }, "Sign in"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink3,
        marginTop: 4
      }
    }, "Forgot password? ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.brickDeep
      }
    }, "Reset")))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        fontSize: 11,
        color: th.ink4,
        fontFamily: F.mono,
        letterSpacing: '0.14em'
      }
    }, "BRICKS \xB7 BROKERAGE")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Img, {
      w: "100%",
      h: "100%",
      label: "ARCHITECTURAL COMPOSITION \u2014 WARM STONE",
      dark: dark,
      r: 0
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 48,
        left: 48,
        color: th.ink,
        maxWidth: 360
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Why teams pick Bricks"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 500,
        marginTop: 10,
        letterSpacing: -0.4,
        lineHeight: 1.3
      }
    }, "One place for bookings, vendors and billing. Your agents already know how to use it."))));
  }

  // Booking app (mobile, consumer-facing — agents/owners book shoots)

  // 1) ONBOARDING — 3 slides
  function BookOnboarding({
    dark = false,
    slide = 0
  }) {
    const th = useTheme(dark);
    const slides = [{
      eye: 'FOR AGENTS',
      head: 'Book a shoot in a minute.',
      body: 'Pick a package, pick a time. We handle the vendor, the weather, the edits.',
      img: 'AGENT AT KITCHEN COUNTER'
    }, {
      eye: 'SMART SCHEDULING',
      head: 'The right vendor, automatically.',
      body: 'Bricks picks the nearest top-rated vendor for your slot — no phone tag.',
      img: 'MAP WITH VENDOR PINS'
    }, {
      eye: 'TURN AROUND',
      head: 'Photos in 24 hours.',
      body: 'Edited, branded, MLS-sized. Dropped straight to your inbox and Dropbox.',
      img: 'GALLERY GRID'
    }];
    const s = slides[slide];
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 22px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Wordmark, {
      size: 15,
      color: th.ink
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: th.ink3
      }
    }, "Skip")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 22px 0'
      }
    }, /*#__PURE__*/React.createElement(Img, {
      w: "100%",
      h: 360,
      label: s.img,
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: T.brick
    }, s.eye), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: -0.8,
        marginTop: 10,
        lineHeight: 1.15
      }
    }, s.head), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: th.ink2,
        marginTop: 10,
        lineHeight: 1.5
      }
    }, s.body)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        paddingBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 20
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        height: 2,
        flex: i === slide ? 2 : 1,
        background: i === slide ? T.brick : th.hairS
      }
    }))), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      full: true,
      icon: "arr"
    }, slide === 2 ? 'Get started' : 'Next'))));
  }

  // 2) LOGIN
  function BookLogin({
    dark = false
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 22px 8px'
      }
    }, /*#__PURE__*/React.createElement(Wordmark, {
      size: 15,
      color: th.ink
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: '28px 22px',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, "Sign in"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: -0.8,
        marginTop: 10
      }
    }, "Welcome back."), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 6
      }
    }, "Book a shoot, track deliveries."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Email"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        padding: '14px 14px',
        border: `1px solid ${th.hairS}`,
        borderRadius: 2,
        fontSize: 14
      }
    }, "mortega@harbor.co")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Password"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        padding: '14px 14px',
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        fontSize: 14,
        color: th.ink3,
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        letterSpacing: 3
      }
    }, "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"), /*#__PURE__*/React.createElement(I, {
      name: "eye",
      size: 15,
      color: th.ink3
    }))), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      full: true,
      icon: "arr",
      style: {
        marginTop: 6
      }
    }, "Sign in"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink3,
        textAlign: 'center',
        marginTop: 4
      }
    }, "Forgot password?"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '20px 0 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: th.hair
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 10,
        color: th.ink4,
        letterSpacing: '0.14em'
      }
    }, "OR"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: th.hair
      }
    })), /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      full: true
    }, "Continue with Google")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        fontSize: 12,
        color: th.ink3,
        textAlign: 'center'
      }
    }, "New to Bricks? ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.brickDeep
      }
    }, "Create account"))));
  }

  // 3) REGISTER
  function BookRegister({
    dark = false
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 22px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "arrL",
      size: 18,
      color: th.ink
    }), /*#__PURE__*/React.createElement(Wordmark, {
      size: 15,
      color: th.ink
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: '28px 22px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, "Create account"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: -0.8,
        marginTop: 10
      }
    }, "A few details."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, [['Full name', 'Marisol Ortega'], ['Work email', 'mortega@harbor.co'], ['Office', 'Ashfield'], ['License #', 'RE·482901']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
      key: l
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        padding: '14px 14px',
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        fontSize: 14
      }
    }, v))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        border: `1.5px solid ${T.brick}`,
        background: T.brick,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 1
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "chk",
      size: 11,
      color: "#fff",
      sw: 2.5
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink2,
        lineHeight: 1.5
      }
    }, "I agree to the ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.brickDeep
      }
    }, "Terms"), " and ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.brickDeep
      }
    }, "Privacy Policy"), "."))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        paddingTop: 24
      }
    }, /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      full: true,
      icon: "arr"
    }, "Create account"))));
  }

  // 4) HOME
  function BookHome({
    dark = false
  }) {
    const th = useTheme(dark);
    const nav = React.useContext(DemoNav);
    const locked = !!(nav && nav.locked);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 22px 0',
        flex: 1,
        overflow: locked ? 'hidden' : 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, "Thursday"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5,
        marginTop: 4
      }
    }, "Hi, Marisol.")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 2,
        background: T.brickSoft,
        color: T.brickDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600
      }
    }, "MO")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20,
        padding: 18,
        background: T.ink,
        color: T.paper,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: "#F4D9CC"
    }, "Next shoot \xB7 in 3 hours"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 19,
        fontWeight: 500,
        marginTop: 8,
        letterSpacing: -0.4
      }
    }, "214 Linden St"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#C8BFB0',
        marginTop: 4
      }
    }, "Today \xB7 14:30 \xB7 J. Reyes"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '7px 10px',
        border: `1px solid #F4F1EB26`,
        borderRadius: 2,
        fontSize: 11,
        fontFamily: F.mono,
        letterSpacing: '0.1em'
      }
    }, "VIEW JOB"), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '7px 10px',
        border: `1px solid #F4F1EB26`,
        borderRadius: 2,
        fontSize: 11,
        fontFamily: F.mono,
        letterSpacing: '0.1em'
      }
    }, "MESSAGE")), /*#__PURE__*/React.createElement(BrickMark, {
      size: 80,
      color: "#F4D9CC0F",
      style: {
        position: 'absolute',
        right: -10,
        top: -10
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement(Btn, {
      variant: "accent",
      full: true,
      icon: "plus"
    }, "Book a shoot")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Your listings"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: th.ink3
      }
    }, "All \xB7 14")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [['214 Linden St', 'Shoot today · 14:30', 'brick', 'In progress', SB_IMG + '74E774C6-1524-4287-B115-25CA213E4BBD.PNG'], ['77 Alder Ave', 'Shoot today · 16:00', 'neutral', 'Scheduled', SB_IMG + '8F382591-AA45-4B74-AD75-08717CFB63D4.PNG'], ['8 Riverbend', 'Delivered yesterday', 'ok', 'Delivered', SB_IMG + '2153E4F6-D200-4DE8-BDCE-15799C873D44.PNG'], ['201 Oak Dr', 'Delivered Apr 13', 'ok', 'Delivered', SB_IMG + '74E774C6-1524-4287-B115-25CA213E4BBD.PNG']].map(([a, b, tone, s, photo]) => /*#__PURE__*/React.createElement("div", {
      key: a,
      style: {
        padding: 14,
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: photo,
      alt: "",
      style: {
        width: 48,
        height: 48,
        borderRadius: 2,
        objectFit: 'cover',
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500
      }
    }, a), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 2
      }
    }, b)), /*#__PURE__*/React.createElement(Pill, {
      tone: tone,
      dark: dark
    }, s))))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 20
      }
    })), /*#__PURE__*/React.createElement(TabBar, {
      dark: dark,
      active: 0,
      tabs: [{
        icon: 'home',
        label: 'Home'
      }, {
        icon: 'cal',
        label: 'Jobs'
      }, {
        icon: 'plus',
        label: 'Book'
      }, {
        icon: 'bell',
        label: 'Inbox'
      }, {
        icon: 'user',
        label: 'Me'
      }]
    }));
  }

  // 5) BOOK FLOW — one screen showing the composed flow
  function BookFlow({
    dark = false
  }) {
    const th = useTheme(dark);
    const nav = React.useContext(DemoNav);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 22px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "arrL",
      size: 18,
      color: th.ink
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "New booking \xB7 step 2 / 4")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: th.ink3
      }
    }, "Save")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 22px 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 2,
        background: th.hair,
        marginTop: 12,
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '50%',
        background: T.brick,
        height: '100%'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: '18px 22px 0',
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: T.brick
    }, "Package"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: -0.6,
        marginTop: 8
      }
    }, "How much coverage?"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: th.ink2,
        marginTop: 6
      }
    }, "214 Linden St \xB7 House \xB7 2,140 sqft"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [{
      n: 'Standard',
      p: '$379',
      d: '24 HDR photos · Drone aerials · 24h delivery',
      sel: false
    }, {
      n: 'Premium',
      p: '$749',
      d: '40 photos · Drone · 60-sec reel · Floor plan · 24h',
      sel: true
    }, {
      n: 'Luxury',
      p: '$1,199',
      d: '60 photos · Drone · Reel · 3D tour · 12h rush',
      sel: false
    }, {
      n: 'Estate',
      p: '$2,499',
      d: 'Estate-tier · Unlimited shots · 12h rush · Custom site',
      sel: false
    }].map(pk => /*#__PURE__*/React.createElement("div", {
      key: pk.n,
      style: {
        padding: 18,
        border: `${pk.sel ? 2 : 1}px solid ${pk.sel ? T.brick : th.hair}`,
        borderRadius: 2,
        background: pk.sel ? dark ? '#D2542B14' : T.brickTint : 'transparent',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 17,
        fontWeight: 500
      }
    }, pk.n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 17
      }
    }, pk.p)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink2,
        marginTop: 6,
        lineHeight: 1.5
      }
    }, pk.d), pk.sel && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 18,
        height: 18,
        borderRadius: 999,
        background: T.brick,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "chk",
      size: 11,
      color: "#fff",
      sw: 2.5
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Earliest available"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: 16,
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "bolt",
      size: 20,
      color: T.brick
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500
      }
    }, "Today \xB7 14:30"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 2
      }
    }, "J. Reyes \xB7 4.9 \u2605 \xB7 2.1 mi away")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: T.brickDeep
      }
    }, "Change"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 100
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 22px 28px',
        borderTop: `1px solid ${th.hair}`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: th.bg
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        fontFamily: F.mono,
        letterSpacing: '0.1em'
      }
    }, "TOTAL"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 22,
        marginTop: 2
      }
    }, "$749")), /*#__PURE__*/React.createElement(Btn, {
      variant: "primary",
      dark: dark,
      style: {
        marginLeft: 'auto'
      },
      icon: "arr"
    }, "Continue")), nav && /*#__PURE__*/React.createElement(TabBar, {
      dark: dark,
      active: 2,
      tabs: [{
        icon: 'home',
        label: 'Home'
      }, {
        icon: 'cal',
        label: 'Jobs'
      }, {
        icon: 'plus',
        label: 'Book'
      }, {
        icon: 'bell',
        label: 'Inbox'
      }, {
        icon: 'user',
        label: 'Me'
      }]
    }));
  }

  // 6) JOBS
  function BookJobs({
    dark = false
  }) {
    const th = useTheme(dark);
    const jobs = [['214 Linden St', 'Today · 14:30', 'In progress', 'brick'], ['77 Alder Ave', 'Today · 16:00', 'Scheduled', 'neutral'], ['1902 Pine Rd', 'Editing', 'Editing', 'warn'], ['8 Riverbend', 'Delivered yesterday', 'Delivered', 'ok'], ['201 Oak Dr', 'Delivered Apr 13', 'Delivered', 'ok'], ['112 Ash Ct', 'Delivered Apr 11', 'Delivered', 'ok']];
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 22px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5,
        paddingTop: 8
      }
    }, "Jobs"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        display: 'flex',
        gap: 4,
        borderBottom: `1px solid ${th.hair}`
      }
    }, ['All (14)', 'Upcoming (4)', 'Done (10)'].map((t, i) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        padding: '10px 10px',
        fontSize: 12,
        color: i === 0 ? th.ink : th.ink3,
        borderBottom: `2px solid ${i === 0 ? T.brick : 'transparent'}`,
        marginBottom: -1
      }
    }, t)))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: '0 22px 12px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, jobs.map(([a, when, s, tone]) => /*#__PURE__*/React.createElement("div", {
      key: a,
      style: {
        padding: 14,
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Img, {
      w: 56,
      h: 56,
      label: "",
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500
      }
    }, a), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink3,
        marginTop: 3
      }
    }, when)), /*#__PURE__*/React.createElement(Pill, {
      tone: tone,
      dark: dark
    }, s)))), /*#__PURE__*/React.createElement(TabBar, {
      dark: dark,
      active: 1,
      tabs: [{
        icon: 'home',
        label: 'Home'
      }, {
        icon: 'cal',
        label: 'Jobs'
      }, {
        icon: 'plus',
        label: 'Book'
      }, {
        icon: 'bell',
        label: 'Inbox'
      }, {
        icon: 'user',
        label: 'Me'
      }]
    }));
  }

  // 7) PROFILE
  function BookProfile({
    dark = false
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 22px 0',
        flex: 1,
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5,
        paddingTop: 8
      }
    }, "Profile"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 2,
        background: T.brickSoft,
        color: T.brickDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 600
      }
    }, "MO"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 17,
        fontWeight: 500
      }
    }, "Marisol Ortega"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink3,
        marginTop: 2
      }
    }, "Ashfield \xB7 Agent")), /*#__PURE__*/React.createElement(I, {
      name: "cR",
      size: 16,
      color: th.ink3
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 1,
        background: th.hair,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, [['JOBS', 34], ['THIS MO.', 6], ['RATING', '4.9']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        background: th.bg,
        padding: '14px 12px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 20
      }
    }, v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 9,
        letterSpacing: '0.14em',
        color: th.ink4,
        marginTop: 4
      }
    }, l)))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Account"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, [['user', 'Edit profile'], ['cards', 'Payment methods'], ['bell', 'Notifications'], ['file', 'Tax documents']].map(([ic, l], i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderBottom: i === 3 ? 'none' : `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: ic,
      size: 17,
      color: th.ink2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 14
      }
    }, l), /*#__PURE__*/React.createElement(I, {
      name: "cR",
      size: 14,
      color: th.ink3
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Support"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, [['phone', 'Contact support'], ['file', 'Terms & privacy'], ['logout', 'Sign out']].map(([ic, l], i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderBottom: i === 2 ? 'none' : `1px solid ${th.hair}`,
        color: l === 'Sign out' ? T.brickDeep : th.ink
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: ic,
      size: 17,
      color: l === 'Sign out' ? T.brickDeep : th.ink2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 14
      }
    }, l))))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 20
      }
    })), /*#__PURE__*/React.createElement(TabBar, {
      dark: dark,
      active: 4,
      tabs: [{
        icon: 'home',
        label: 'Home'
      }, {
        icon: 'cal',
        label: 'Jobs'
      }, {
        icon: 'plus',
        label: 'Book'
      }, {
        icon: 'bell',
        label: 'Inbox'
      }, {
        icon: 'user',
        label: 'Me'
      }]
    }));
  }

  // Dispatch app (mobile, for vendors — dark by default)

  function DispOnboarding({
    dark = true,
    slide = 0
  }) {
    const th = useTheme(dark);
    const slides = [{
      eye: 'FOR SHOOTERS',
      head: 'Your day, queued up.',
      body: 'Every job on the books — addresses, gate codes, packages, contact.',
      img: 'VENDOR LOADING VAN'
    }, {
      eye: 'NAVIGATE',
      head: 'Drive time baked in.',
      body: 'Bricks only books jobs you can actually make. Tap for directions.',
      img: 'DASHBOARD MAP'
    }, {
      eye: 'UPLOAD',
      head: 'Shoot. Upload. Done.',
      body: 'Drag the SD card in. Office gets notified when editing starts.',
      img: 'SD CARD + LAPTOP'
    }];
    const s = slides[slide];
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 22px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Wordmark, {
      size: 15,
      color: th.ink
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: th.ink3
      }
    }, "Skip")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 22px 0'
      }
    }, /*#__PURE__*/React.createElement(Img, {
      w: "100%",
      h: 360,
      label: s.img,
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 32
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: T.brick
    }, s.eye), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: -0.8,
        marginTop: 10,
        lineHeight: 1.15,
        color: th.ink
      }
    }, s.head), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: th.ink2,
        marginTop: 10,
        lineHeight: 1.5
      }
    }, s.body)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        paddingBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 20
      }
    }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        height: 2,
        flex: i === slide ? 2 : 1,
        background: i === slide ? T.brick : th.hairS
      }
    }))), /*#__PURE__*/React.createElement(Btn, {
      variant: "accent",
      full: true,
      icon: "arr"
    }, slide === 2 ? 'Get started' : 'Next'))));
  }

  // TODAY — hero next job + rail
  function DispToday({
    dark = true
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 22px 0',
        flex: 1,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Over, {
      color: th.ink4
    }, "Thursday \xB7 Apr 18"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5,
        marginTop: 4
      }
    }, "4 shoots.")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 2,
        background: '#D2542B33',
        color: T.brick,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600
      }
    }, "JR")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: T.brick
    }, "Next up \xB7 in 42 min"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: 18,
        border: `1px solid ${th.hairS}`,
        borderRadius: 2,
        background: th.surf
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5
      }
    }, "214 Linden St"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink3,
        marginTop: 4
      }
    }, "TORONTO \xB7 HOUSE \xB7 2,140 SQFT"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 1,
        background: th.hairS,
        border: `1px solid ${th.hairS}`,
        borderRadius: 2
      }
    }, [['ARRIVE', '14:30'], ['DRIVE', '22 min'], ['PACKAGE', 'Premium']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        background: th.surf,
        padding: '10px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 9,
        letterSpacing: '0.14em',
        color: th.ink4
      }
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 14,
        marginTop: 4,
        color: th.ink
      }
    }, v)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(Btn, {
      variant: "accent",
      style: {
        flex: 1
      },
      icon: "nav"
    }, "Navigate"), /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      icon: "phone",
      style: {
        paddingLeft: 14,
        paddingRight: 14
      }
    }, ' ')))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Pre-shoot checklist"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, [['Agent confirmed · M. Ortega', true], ['Lockbox code · 4812#', true], ['Drone approved for area', true], ['Upload last shoot (#08410)', false]].map(([l, done]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 2,
        border: `1.5px solid ${done ? T.brick : th.hairS}`,
        background: done ? T.brick : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, done && /*#__PURE__*/React.createElement(I, {
      name: "chk",
      size: 11,
      color: "#fff",
      sw: 2.5
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: done ? th.ink3 : th.ink,
        textDecoration: done ? 'line-through' : 'none'
      }
    }, l))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Later today"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [['16:00', '30 Mercer Loop', 'Condo', '$749'], ['17:45', '55 Birch Way', 'Condo', '$379'], ['19:00', '9 Harbor Way', 'Condo · twilight', '$554']].map(([t, a, type, amt]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 13,
        color: th.ink,
        width: 48
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        height: 28,
        background: th.hair
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500
      }
    }, a), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 2
      }
    }, type)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 13,
        color: th.ink
      }
    }, amt))))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 20
      }
    })), /*#__PURE__*/React.createElement(TabBar, {
      dark: dark,
      active: 0,
      tabs: [{
        icon: 'home',
        label: 'Today'
      }, {
        icon: 'cal',
        label: 'Week'
      }, {
        icon: 'up',
        label: 'Upload'
      }, {
        icon: 'dol',
        label: 'Pay'
      }, {
        icon: 'user',
        label: 'Me'
      }]
    }));
  }

  // SCHEDULE — week view
  function DispSchedule({
    dark = true
  }) {
    const th = useTheme(dark);
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 22px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5
      }
    }, "Week 16"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 10px',
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "cU",
      size: 13,
      color: th.ink2,
      style: {
        transform: 'rotate(-90deg)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 10px',
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "cD",
      size: 13,
      color: th.ink2,
      style: {
        transform: 'rotate(-90deg)'
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(7,1fr)',
        gap: 4
      }
    }, days.map((d, i) => {
      const on = i === 3;
      const load = [2, 3, 1, 4, 3, 2, 0][i];
      return /*#__PURE__*/React.createElement("div", {
        key: d,
        style: {
          padding: '8px 0',
          textAlign: 'center',
          background: on ? T.ink : 'transparent',
          color: on ? T.paper : th.ink,
          border: `1px solid ${on ? T.ink : th.hair}`,
          borderRadius: 2
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F.mono,
          fontSize: 9,
          letterSpacing: '0.12em',
          opacity: on ? 0.7 : 0.6
        }
      }, d), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F.mono,
          fontSize: 15,
          marginTop: 3
        }
      }, 13 + i), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          marginTop: 5
        }
      }, Array.from({
        length: load
      }).map((_, j) => /*#__PURE__*/React.createElement("div", {
        key: j,
        style: {
          width: 3,
          height: 3,
          background: on ? T.paper : T.brick,
          borderRadius: 999
        }
      })), load === 0 && /*#__PURE__*/React.createElement("div", {
        style: {
          height: 3
        }
      })));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: '20px 22px 0',
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Thursday, Apr 18 \xB7 4 shoots"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column'
      }
    }, [['09:00', '1902 Pine Rd', 'House · Standard', 'Delivered', 'ok'], ['14:30', '214 Linden St', 'House · Premium', 'Next', 'brick'], ['16:00', '30 Mercer Loop', 'Commercial', 'Scheduled', 'neutral'], ['17:45', '55 Birch Way', 'Condo', 'Scheduled', 'neutral'], ['19:00', '9 Harbor Way', 'Condo · twilight', 'Scheduled', 'neutral']].map(([t, a, ty, s, tone], i) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        gap: 14,
        padding: '14px 0',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 12,
        color: th.ink3,
        width: 44
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        background: th.hair,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -3,
        top: 4,
        width: 7,
        height: 7,
        borderRadius: 999,
        background: tone === 'brick' ? T.brick : tone === 'ok' ? T.ok : th.ink4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        paddingLeft: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500
      }
    }, a), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 2
      }
    }, ty), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(Pill, {
      tone: tone,
      dark: dark
    }, s)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 20
      }
    })), /*#__PURE__*/React.createElement(TabBar, {
      dark: dark,
      active: 1,
      tabs: [{
        icon: 'home',
        label: 'Today'
      }, {
        icon: 'cal',
        label: 'Week'
      }, {
        icon: 'up',
        label: 'Upload'
      }, {
        icon: 'dol',
        label: 'Pay'
      }, {
        icon: 'user',
        label: 'Me'
      }]
    }));
  }

  // JOB DETAIL
  function DispJobDetail({
    dark = true
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 22px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "arrL",
      size: 18,
      color: th.ink
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink3,
        letterSpacing: '0.14em'
      }
    }, "#08412"), /*#__PURE__*/React.createElement(I, {
      name: "dots",
      size: 18,
      color: th.ink
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Img, {
      w: "100%",
      h: 200,
      label: "214 LINDEN ST \xB7 STREET VIEW",
      dark: dark,
      r: 0
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 22px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5
      }
    }, "214 Linden St"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink3,
        marginTop: 4
      }
    }, "Toronto, ON \xB7 House \xB7 2,140 sqft")), /*#__PURE__*/React.createElement(Pill, {
      tone: "brick",
      dark: dark
    }, "Next up")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap: 1,
        background: th.hairS,
        border: `1px solid ${th.hairS}`,
        borderRadius: 2
      }
    }, [['ARRIVE', 'Today · 14:30'], ['PACKAGE', 'Premium'], ['DRIVE', '22 min · 9.4 mi'], ['PAYOUT', '$337']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        background: th.surf,
        padding: '12px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 9,
        letterSpacing: '0.14em',
        color: th.ink4
      }
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 14,
        marginTop: 4
      }
    }, v)))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Contact"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: 14,
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 2,
        background: T.brickSoft,
        color: T.brickDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 600
      }
    }, "MO"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500
      }
    }, "M. Ortega"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3
      }
    }, "Ashfield \xB7 Agent")), /*#__PURE__*/React.createElement(I, {
      name: "phone",
      size: 17,
      color: th.ink2
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Access"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: 14,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13
      }
    }, "Lockbox code"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 16,
        letterSpacing: 2
      }
    }, "4812#")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: th.hair,
        margin: '12px -14px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink2,
        lineHeight: 1.5
      }
    }, "Park on Linden. Dog in back yard. Agent on site 14:15."))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Shot list"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, ['40 interior photos', '5 drone aerials', '60-second walkthrough reel', 'Floor plan — each level'].map(s => /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        display: 'flex',
        gap: 12,
        padding: '10px 0',
        borderBottom: `1px solid ${th.hair}`
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "cam",
      size: 15,
      color: th.ink3
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13
      }
    }, s))))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 120
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 22px 28px',
        borderTop: `1px solid ${th.hair}`,
        display: 'flex',
        gap: 10,
        background: th.bg
      }
    }, /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      dark: dark,
      icon: "phone",
      style: {
        paddingLeft: 14,
        paddingRight: 14
      }
    }, ' '), /*#__PURE__*/React.createElement(Btn, {
      variant: "accent",
      style: {
        flex: 1
      },
      icon: "nav"
    }, "Navigate")));
  }

  // UPLOADS
  function DispUploads({
    dark = true
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 22px 0',
        flex: 1,
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5,
        paddingTop: 8
      }
    }, "Upload"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: th.ink3,
        marginTop: 4
      }
    }, "Drop the card \u2014 we auto-sort by job."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20,
        padding: '32px 20px',
        border: `1.5px dashed ${th.hairS}`,
        borderRadius: 2,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "up",
      size: 28,
      color: T.brick
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 500,
        marginTop: 12
      }
    }, "Drag files or tap to select"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 6
      }
    }, "RAW, JPEG, MP4 \xB7 up to 20 GB per job"), /*#__PURE__*/React.createElement(Btn, {
      variant: "accent",
      style: {
        marginTop: 14
      },
      icon: "plus"
    }, "Choose files")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "In progress"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: 16,
        border: `1px solid ${th.hairS}`,
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500
      }
    }, "1902 Pine Rd \xB7 #08410"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 2,
        fontFamily: F.mono
      }
    }, "127 / 240 FILES \xB7 4.2 GB")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F.mono,
        fontSize: 16,
        color: T.brick
      }
    }, "53%")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 3,
        background: th.hair,
        marginTop: 12,
        borderRadius: 2,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '53%',
        background: T.brick,
        height: '100%'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 10,
        color: th.ink4,
        marginTop: 8,
        letterSpacing: '0.1em'
      }
    }, "~ 4 MIN REMAINING"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Recent uploads"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [['30 Mercer Loop · #08409', '183 files · 3.1 GB', 'Editing', 'warn'], ['8 Riverbend · #08408', '240 files · 5.2 GB', 'Delivered', 'ok'], ['55 Birch Way · #08407', '151 files · 2.8 GB', 'Delivered', 'ok'], ['112 Ash Ct · #08406', '202 files · 4.0 GB', 'Delivered', 'ok']].map(([a, meta, s, tone]) => /*#__PURE__*/React.createElement("div", {
      key: a,
      style: {
        padding: 14,
        border: `1px solid ${th.hair}`,
        borderRadius: 2,
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: "file",
      size: 18,
      color: th.ink3
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, a), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink3,
        marginTop: 2
      }
    }, meta)), /*#__PURE__*/React.createElement(Pill, {
      tone: tone,
      dark: dark
    }, s))))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 20
      }
    })), /*#__PURE__*/React.createElement(TabBar, {
      dark: dark,
      active: 2,
      tabs: [{
        icon: 'home',
        label: 'Today'
      }, {
        icon: 'cal',
        label: 'Week'
      }, {
        icon: 'up',
        label: 'Upload'
      }, {
        icon: 'dol',
        label: 'Pay'
      }, {
        icon: 'user',
        label: 'Me'
      }]
    }));
  }

  // VENDOR PAY / PROFILE
  function DispProfile({
    dark = true
  }) {
    const th = useTheme(dark);
    return /*#__PURE__*/React.createElement(Phone, {
      dark: dark
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 22px 0',
        flex: 1,
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        letterSpacing: -0.5,
        paddingTop: 8
      }
    }, "Payouts"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        padding: 20,
        border: `1px solid ${th.hairS}`,
        borderRadius: 2,
        background: th.surf
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "This week"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 36,
        marginTop: 10,
        letterSpacing: -0.8
      }
    }, "$2,124"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: th.ink3,
        marginTop: 4
      }
    }, "Pays out Monday \xB7 7 jobs"), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 3,
        background: th.hair,
        marginTop: 16,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '68%',
        background: T.brick
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '32%',
        background: th.ink4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 8,
        fontFamily: F.mono,
        fontSize: 10,
        color: th.ink3
      }
    }, /*#__PURE__*/React.createElement("span", null, "PAID $1,450"), /*#__PURE__*/React.createElement("span", null, "PENDING $674"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Recent jobs"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, [['214 Linden St', 'Today', '$337', 'Pending'], ['30 Mercer Loop', 'Today', '$337', 'Pending'], ['1902 Pine Rd', 'Yesterday', '$171', 'Paid'], ['8 Riverbend', 'Apr 16', '$450', 'Paid'], ['55 Birch Way', 'Apr 15', '$249', 'Paid']].map(([a, d, v, s], i) => /*#__PURE__*/React.createElement("div", {
      key: a + i,
      style: {
        display: 'flex',
        gap: 10,
        padding: 14,
        borderBottom: i === 4 ? 'none' : `1px solid ${th.hair}`,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, a), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 11,
        color: th.ink3,
        marginTop: 2
      }
    }, d)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 13
      }
    }, v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F.mono,
        fontSize: 10,
        color: s === 'Paid' ? T.ok : T.warn,
        marginTop: 2
      }
    }, s.toUpperCase())))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement(Over, {
      color: th.ink3
    }, "Account"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        border: `1px solid ${th.hair}`,
        borderRadius: 2
      }
    }, [['user', 'Edit profile'], ['cards', 'Payout method · •••• 9012'], ['file', 'Tax documents'], ['cog', 'Settings'], ['logout', 'Sign out']].map(([ic, l], i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderBottom: i === 4 ? 'none' : `1px solid ${th.hair}`,
        color: l === 'Sign out' ? T.brick : th.ink
      }
    }, /*#__PURE__*/React.createElement(I, {
      name: ic,
      size: 17,
      color: l === 'Sign out' ? T.brick : th.ink2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 14
      }
    }, l), l !== 'Sign out' && /*#__PURE__*/React.createElement(I, {
      name: "cR",
      size: 14,
      color: th.ink3
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 20
      }
    })), /*#__PURE__*/React.createElement(TabBar, {
      dark: dark,
      active: 3,
      tabs: [{
        icon: 'home',
        label: 'Today'
      }, {
        icon: 'cal',
        label: 'Week'
      }, {
        icon: 'up',
        label: 'Upload'
      }, {
        icon: 'dol',
        label: 'Pay'
      }, {
        icon: 'user',
        label: 'Me'
      }]
    }));
  }

  // ── Mount screens ──

  // Expose every top-level component
  const BOOK_SCREENS = [BookHome, BookJobs, BookFlow, BookHome, BookProfile];
  const DISP_SCREENS = [DispToday, DispSchedule, DispUploads, DispProfile, DispProfile];
  function DemoOS({
    dark = false,
    screen = 'overview',
    locked = false
  }) {
    return /*#__PURE__*/React.createElement(BrokShell, {
      dark: dark,
      screen: screen,
      locked: locked
    });
  }
  function DemoBook({
    dark = false,
    locked = false
  }) {
    const [tab, setTab] = React.useState(0);
    const Screen = BOOK_SCREENS[tab] || BookHome;
    return /*#__PURE__*/React.createElement(DemoNav.Provider, {
      value: {
        tab,
        setTab: locked ? undefined : setTab,
        locked
      }
    }, /*#__PURE__*/React.createElement(Screen, {
      dark: dark
    }));
  }
  function DemoDisp({
    dark = false,
    locked = false
  }) {
    const [tab, setTab] = React.useState(0);
    const Screen = DISP_SCREENS[tab] || DispToday;
    return /*#__PURE__*/React.createElement(DemoNav.Provider, {
      value: {
        tab,
        setTab: locked ? undefined : setTab,
        locked
      }
    }, /*#__PURE__*/React.createElement(Screen, {
      dark: dark
    }));
  }
  Object.assign(global, {
    T,
    F,
    useTheme,
    BrickMark,
    Wordmark,
    Over,
    Img,
    I,
    Phone,
    TabBar,
    Pill,
    Btn,
    BrokShell,
    BrokLogin,
    BookOnboarding,
    BookLogin,
    BookRegister,
    BookHome,
    BookFlow,
    BookJobs,
    BookProfile,
    DispOnboarding,
    DispToday,
    DispSchedule,
    DispJobDetail,
    DispUploads,
    DispProfile,
    DemoOS,
    DemoBook,
    DemoDisp
  });
  global.mountBricks = function (id, element) {
    const root = document.getElementById(id);
    if (!root) throw new Error('mountBricks: no element #' + id);
    ReactDOM.createRoot(root).render(element);
  };
})(window);

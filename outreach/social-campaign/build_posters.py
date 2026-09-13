#!/usr/bin/env python3
"""Generate Bricks social posters as PNGs — using Bricks' ACTUAL design language.

Pulled from bricks-site (the live www.brxs.ca site):
- Mark: 3-brick SVG (viewBox 0 0 24 24, fill #D2542B) — exact one from index.html/footer.
- Type: General Sans (400/500/600) + JetBrains Mono (400/500), self-hosted in ./.fonts.
- Palette (assets/site.css :root): paper #F4F1EB, paperDeep #E4DED2, ink #14110E,
  inkSoft #3B332A, inkMute #6B6054, inkFaint #A39684, brick #D2542B, brickDeep #A8401F,
  brickTint #FBEFE8, night #141210, moon #F4F1EB, moonSoft #D6CFC2, moonMute #8F8678.
- Voice/headlines: weight 500, letter-spacing -1.4px on .hero h1; mono labels 10px/0.14em
  uppercase, brick-tint badge; dark .book band uses night/moon.
Pricing = prelaunch a la carte (pricing.html): core shoot (photo+drone+floorplan) $248->$458.
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
POSTER_DIR = os.path.join(HERE, "posters")
FONT_DIR = os.path.join(HERE, ".fonts")
os.makedirs(POSTER_DIR, exist_ok=True)

# ---- Bricks real tokens ----
PAPER="#F4F1EB"; PAPER_D="#E4DED2"; INK="#14110E"; INK_S="#3B332A"
INK_M="#6B6054"; INK_F="#A39684"; BRICK="#D2542B"; BRICK_D="#A8401F"; BRICK_T="#FBEFE8"
NIGHT="#141210"; MOON="#F4F1EB"; MOON_S="#D6CFC2"; MOON_M="#8F8678"

# Exact 3-brick mark from the site (index.html line 160-164 / footer).
BRICK_MARK = """
<svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-label="Bricks">
  <rect x="4" y="5"  width="11" height="7" rx="1.2" fill="#D2542B"/>
  <rect x="4" y="13" width="6"  height="7" rx="1.2" fill="#D2542B"/>
  <rect x="11" y="13" width="10" height="7" rx="1.2" fill="#D2542B"/>
</svg>"""

FONT_FACE = (
"@font-face{font-family:'General Sans';src:url('file://" + os.path.join(FONT_DIR,"gs-400.woff2") + "') format('woff2');font-weight:400;font-display:swap;}"
"@font-face{font-family:'General Sans';src:url('file://" + os.path.join(FONT_DIR,"gs-500.woff2") + "') format('woff2');font-weight:500;font-display:swap;}"
"@font-face{font-family:'General Sans';src:url('file://" + os.path.join(FONT_DIR,"gs-600.woff2") + "') format('woff2');font-weight:600;font-display:swap;}"
"@font-face{font-family:'JetBrains Mono';src:url('file://" + os.path.join(FONT_DIR,"jbm-400.woff2") + "') format('woff2');font-weight:400;font-display:swap;}"
"@font-face{font-family:'JetBrains Mono';src:url('file://" + os.path.join(FONT_DIR,"jbm-500.woff2") + "') format('woff2');font-weight:500;font-display:swap;}"
)

PAGE_CSS = f"""
{FONT_FACE}
*{{box-sizing:border-box;margin:0;padding:0;}}
.wrap{{width:100%;height:100%;background:{PAPER};padding:80px;display:flex;flex-direction:column;
  font-family:'General Sans',system-ui,sans-serif;color:{INK};position:relative;overflow:hidden;}}
.brandrow{{display:flex;align-items:center;gap:12px;}}
.wordmark{{font-weight:500;font-size:26px;letter-spacing:-0.6px;color:{INK};}}
.mono{{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;
  letter-spacing:0.14em;text-transform:uppercase;color:{INK_M};}}
.badge{{display:inline-block;padding:6px 12px;font-family:'JetBrains Mono',monospace;font-size:11px;
  font-weight:500;letter-spacing:0.14em;text-transform:uppercase;border-radius:2px;
  background:{BRICK_T};color:{BRICK_D};}}
.h1{{font-weight:500;font-size:76px;line-height:1.0;letter-spacing:-1.6px;color:{INK};}}
.h1 .ac{{color:{BRICK};}}
.h2{{font-weight:500;font-size:34px;line-height:1.12;letter-spacing:-0.9px;color:{INK};}}
.sub{{font-weight:400;font-size:21px;line-height:1.5;color:{INK_S};max-width:840px;}}
.spacer{{flex:1;}}
.kicker{{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.16em;
  text-transform:uppercase;color:{BRICK_D};}}
/* flow chips (site .flow / .step style) */
.flow{{display:flex;gap:1px;background:{INK_F}55;border:1px solid {INK_F}55;border-radius:2px;overflow:hidden;}}
.step{{background:{PAPER};padding:18px 20px;flex:1;}}
.step .num{{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.16em;color:{INK_F};}}
.step h4{{font-weight:500;font-size:17px;color:{INK};margin:8px 0 4px;letter-spacing:-0.4px;}}
.step p{{font-size:12.5px;color:{INK_M};line-height:1.4;}}
.chip{{display:inline-block;background:{PAPER};border:1px solid {INK_F}66;color:{INK_S};
  font-size:15px;font-weight:500;padding:7px 14px;border-radius:2px;margin-right:8px;}}
/* dark band (site .book) */
.book{{background:{NIGHT};color:{MOON};border-radius:2px;padding:26px 30px;display:flex;align-items:center;
  justify-content:space-between;gap:18px;flex-wrap:wrap;}}
.book .bl{{font-weight:500;font-size:22px;letter-spacing:-0.5px;color:{MOON};}}
.book .bs{{font-size:13px;color:{MOON_S};margin-top:6px;}}
.book .price{{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:500;color:{MOON};}}
.book .price b{{color:#F08A5D;}}
.foot{{display:flex;align-items:center;justify-content:space-between;border-top:1px solid {INK_F}55;padding-top:22px;}}
.foot .url{{font-family:'JetBrains Mono',monospace;font-size:17px;letter-spacing:0.08em;color:{INK_S};font-weight:500;}}
.foot .geo{{font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:{INK_M};}}
.ln{{font-family:'JetBrains Mono',monospace;font-size:20px;letter-spacing:0.1em;color:{INK_F};font-weight:500;}}
"""

def page(body_inner, w, h):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{PAGE_CSS}</style></head>
<body><div class="wrap" style="width:{w}px;height:{h}px;padding:80px;">{body_inner}</div></body></html>"""

# 1: LAUNCH (1080x1080)
p1 = page(f"""
  <div class="brandrow">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="margin-top:44px;"><span class="badge">The operating system for real estate</span></div>
  <h1 class="h1" style="margin-top:32px;">From booking<br/>to capture<br/>to delivery<br/><span class="ac">to close.</span></h1>
  <div class="spacer"></div>
  <div class="flow" style="margin-bottom:26px;">
    <div class="step"><div class="num">01</div><h4>Book</h4><p>à la carte</p></div>
    <div class="step"><div class="num">02</div><h4>Capture</h4><p>licensed drone</p></div>
    <div class="step"><div class="num">03</div><h4>Deliver</h4><p>24–48h edit</p></div>
    <div class="step"><div class="num">04</div><h4>Close</h4><p>one invoice</p></div>
  </div>
  <div class="foot">
    <span class="url">brxs.ca</span>
    <span class="geo">Live in the GTA · photo + drone + floor plan from $248</span>
  </div>
""", 1080, 1080)

# 2: VALUE (1080x1080)
p2 = page(f"""
  <div class="brandrow">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="margin-top:48px;"><span class="kicker">The media OS, not another vendor</span></div>
  <h1 class="h1" style="margin-top:28px;font-size:60px;">A photographer shoots one listing.<br/><span class="ac">Bricks runs media across your whole book.</span></h1>
  <div class="spacer"></div>
  <div style="margin-bottom:26px;">
    <span class="chip">One standard, every time</span>
    <span class="chip">Book in one place</span>
    <span class="chip">24–48h delivery</span>
  </div>
  <div class="book">
    <div><div class="bl">Photo + drone + floor plan</div><div class="bs">Priced by footprint, every shoot.</div></div>
    <div class="price">from <b>$248</b></div>
  </div>
""", 1080, 1080)

# 3: FOUNDER (1080x1350)
p3 = page(f"""
  <div class="brandrow">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="margin-top:54px;"><span class="kicker">From the founder</span></div>
  <h1 class="h1" style="margin-top:28px;font-size:62px;">14,000+ properties shot. Agents don't want another app — they want the shoot <span class="ac">done.</span></h1>
  <div class="spacer"></div>
  <p class="sub" style="margin-bottom:24px;">Bricks is the OS that gets it <b>booked, captured, delivered</b> — without the follow-up.</p>
  <div class="foot">
    <span class="url">brxs.ca</span>
    <span class="geo">Live in the GTA</span>
  </div>
""", 1080, 1350)

# 4: REEL COVER (1080x1920)
p4 = page(f"""
  <div class="brandrow" style="position:absolute;top:72px;left:80px;">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <span class="badge" style="margin-bottom:34px;align-self:flex-start;">Reel</span>
    <h1 class="h1" style="font-size:84px;">Your photographer shoots it.<br/><span class="ac">Bricks runs the whole thing</span> around it.</h1>
    <div style="display:flex;gap:16px;margin-top:50px;align-items:center;font-family:'JetBrains Mono',monospace;
      font-size:22px;letter-spacing:0.12em;color:{MOON_S};font-weight:500;">
      <span style="color:#F08A5D;">BOOK</span><span class="ln">→</span>
      <span style="color:#F08A5D;">CAPTURE</span><span class="ln">→</span>
      <span style="color:#F08A5D;">DELIVER</span>
    </div>
  </div>
  <div class="foot" style="position:absolute;bottom:72px;left:80px;right:80px;">
    <span class="url">brxs.ca</span>
    <span class="geo">GTA · From $248</span>
  </div>
""", 1080, 1920)

# 5: LUXURY (1080x1350)
p5 = page(f"""
  <div class="brandrow">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="margin-top:54px;"><span class="badge">For the $5M listing</span></div>
  <h1 class="h1" style="margin-top:28px;font-size:60px;">A $5M listing deserves better than <span class="ac">guesswork.</span></h1>
  <div class="spacer"></div>
  <p class="sub" style="margin-bottom:24px;">Cinematic reel <b>$199–349</b> · twilight <b>$150–200</b> · 3D tour <b>$149–299</b> — every shoot, à la carte. Photo, drone, floor plan from <b>$248</b>. Booked direct.</p>
  <div class="book">
    <div><div class="bl">Premium add-ons</div><div class="bs">Build the listing you want.</div></div>
    <div class="price">à la carte</div>
  </div>
""", 1080, 1350)

POSTERS = {
    "01-launch-1080x1080.png":  (p1, 1080, 1080),
    "02-value-1080x1080.png":   (p2, 1080, 1080),
    "03-founder-1080x1350.png": (p3, 1080, 1350),
    "04-reel-cover-1080x1920.png": (p4, 1080, 1920),
    "05-luxury-1080x1350.png":  (p5, 1080, 1350),
}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for fname, (html, w, h) in POSTERS.items():
        po = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        po.set_content(html, wait_until="networkidle")
        po.screenshot(path=os.path.join(POSTER_DIR, fname), clip={"x":0,"y":0,"width":w,"height":h})
        po.close()
        print("wrote", fname)
    browser.close()
print("DONE")

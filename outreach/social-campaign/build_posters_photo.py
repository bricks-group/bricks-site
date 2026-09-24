#!/usr/bin/env python3
"""Photo-backed Bricks posters (v2). Composites real Bricks shoot imagery with the
brand design language (3-brick mark, General Sans + JetBrains Mono, paper/night/brick
palette). Images are loaded by absolute file:// path and center-cropped via CSS
object-fit:cover (no PIL needed).

Source imagery:
- bricks-site/media/res-*.jpg, comm-*.jpg, raphael-merchant.jpg
- bricks-site/media/0*.jpg, 1*.jpg (higher-res selects)
- Bricks Project/Before and After/*.png (proof pairs)
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
POSTER_DIR = os.path.join(HERE, "posters")
FONT_DIR = os.path.join(HERE, ".fonts")
os.makedirs(POSTER_DIR, exist_ok=True)

PAPER="#F4F1EB"; PAPER_D="#E4DED2"; INK="#14110E"; INK_S="#3B332A"
INK_M="#6B6054"; INK_F="#A39684"; BRICK="#D2542B"; BRICK_D="#A8401F"; BRICK_T="#FBEFE8"
NIGHT="#141210"; MOON="#F4F1EB"; MOON_S="#D6CFC2"; MOON_M="#8F8678"

BRICK_MARK = """
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-label="Bricks">
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

SRC = os.path.join(POSTER_DIR, "_src")
S = {
 "res_living1": "file://" + os.path.join(SRC, "res-living-1.jpg"),
 "aerial":      "file://" + os.path.join(SRC, "comm-aerial-1.jpg"),
 "founder":     "file://" + os.path.join(SRC, "raphael-merchant.jpg"),
 "lux":         "file://" + os.path.join(SRC, "05.jpg"),
 "lux2":        "file://" + os.path.join(SRC, "09.jpg"),
 "sky_b":       "file://" + os.path.join(SRC, "Sky Before.png"),
 "sky_a":       "file://" + os.path.join(SRC, "Sky After.png"),
 "hdr_b":       "file://" + os.path.join(SRC, "HDR Before.png"),
 "hdr_a":       "file://" + os.path.join(SRC, "HDR After.png"),
 "twi_b":       "file://" + os.path.join(SRC, "Twilight before.png"),
 "twi_a":       "file://" + os.path.join(SRC, "twilight After.png"),
 "sta_b":       "file://" + os.path.join(SRC, "Staging Before.png"),
 "sta_a":       "file://" + os.path.join(SRC, "Staging After.png"),
}

BASE = f"""
{FONT_FACE}
*{{box-sizing:border-box;margin:0;padding:0;}}
.frame{{position:relative;width:100%;height:100%;overflow:hidden;background:{NIGHT};
  font-family:'General Sans',system-ui,sans-serif;color:{MOON};}}
.photo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}}
.scrim{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,18,16,0.30) 0%,rgba(20,18,16,0.10) 35%,rgba(20,18,16,0.82) 100%);}}
.scrim-top{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,18,16,0.78) 0%,rgba(20,18,16,0.10) 30%,rgba(20,18,16,0.10) 58%,rgba(20,18,16,0.82) 100%);}}
.content{{position:absolute;inset:0;display:flex;flex-direction:column;padding:72px;}}
.brandrow{{display:flex;align-items:center;gap:11px;}}
.wordmark{{font-weight:500;font-size:25px;letter-spacing:-0.6px;color:{MOON};}}
.badge{{display:inline-block;padding:6px 12px;font-family:'JetBrains Mono',monospace;font-size:11px;
  font-weight:500;letter-spacing:0.14em;text-transform:uppercase;border-radius:2px;
  background:rgba(251,239,232,0.16);color:#F4C9B6;backdrop-filter:blur(2px);}}
.kicker{{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:#F4C9B6;}}
.h1{{font-weight:500;font-size:62px;line-height:1.02;letter-spacing:-1.6px;color:{MOON};}}
.h1 .ac{{color:#F08A5D;}}
.sub{{font-weight:400;font-size:19px;line-height:1.5;color:{MOON_S};max-width:760px;}}
.spacer{{flex:1;}}
.foot{{display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(244,241,235,0.22);padding-top:20px;}}
.foot .url{{font-family:'JetBrains Mono',monospace;font-size:16px;letter-spacing:0.08em;color:{MOON};font-weight:500;}}
.foot .geo{{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:{MOON_M};}}
.ln{{font-family:'JetBrains Mono',monospace;font-size:20px;letter-spacing:0.1em;color:rgba(244,241,235,0.5);font-weight:500;}}
.flow{{display:flex;gap:12px;font-family:'JetBrains Mono',monospace;font-size:18px;letter-spacing:0.12em;font-weight:500;}}
.flow b{{color:#F08A5D;}}
"""

def page(body, img_url, scrim, w, h):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE}</style></head>
<body><div class="frame" style="width:{w}px;height:{h}px;">
<img class="photo" src="{img_url}"/>
<div class="{scrim}"></div>
<div class="content" style="padding:72px;">{body}</div>
</div></body></html>"""

p1 = page(f"""
  <div class="brandrow">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="margin-top:26px;"><span class="badge">The operating system for real estate</span></div>
  <div class="spacer"></div>
  <h1 class="h1">From booking<br/>to capture<br/>to delivery<br/><span class="ac">to close.</span></h1>
  <div class="foot"><span class="url">brxs.ca</span><span class="geo">Live in the GTA · from $248</span></div>
""", S["res_living1"], "scrim", 1080, 1080)

p2 = page(f"""
  <div class="brandrow">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="margin-top:24px;"><span class="kicker">The media OS, not another vendor</span></div>
  <div class="spacer"></div>
  <h1 class="h1" style="font-size:52px;">A photographer shoots one listing.<br/><span class="ac">Bricks runs media across your whole book.</span></h1>
  <div class="foot"><span class="url">brxs.ca</span><span class="geo">One standard · 24–48h</span></div>
""", S["aerial"], "scrim-top", 1080, 1080)

p3 = page(f"""
  <div class="brandrow">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div class="spacer"></div>
  <h1 class="h1" style="font-size:50px;">CoStar volume shaped the standard.<br/>They want the shoot <span class="ac">done.</span></h1>
  <p class="sub" style="margin-top:18px;">Bricks is the OS that gets it booked, captured, delivered — without the follow-up. — Raphael Merchant, founder</p>
  <div class="foot"><span class="url">brxs.ca</span><span class="geo">Live in the GTA</span></div>
""", S["founder"], "scrim-top", 1080, 1350)

p4 = page(f"""
  <div class="brandrow" style="position:absolute;top:64px;left:72px;right:72px;">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <span class="badge" style="align-self:flex-start;margin-bottom:30px;">Reel</span>
    <h1 class="h1" style="font-size:74px;">Your photographer shoots it.<br/><span class="ac">Bricks runs the whole thing</span> around it.</h1>
    <div class="flow" style="margin-top:46px;"><b>BOOK</b><span class="ln">→</span><b>CAPTURE</b><span class="ln">→</span><b>DELIVER</b></div>
  </div>
  <div class="foot" style="position:absolute;bottom:64px;left:72px;right:72px;">
    <span class="url">brxs.ca</span><span class="geo">GTA · From $248</span></div>
""", S["lux"], "scrim-top", 1080, 1920)

p5 = page(f"""
  <div class="brandrow">{BRICK_MARK}<span class="wordmark">bricks</span></div>
  <div style="margin-top:24px;"><span class="badge">For the $5M listing</span></div>
  <div class="spacer"></div>
  <h1 class="h1" style="font-size:52px;">A $5M listing deserves better than <span class="ac">guesswork.</span></h1>
  <p class="sub" style="margin-top:16px;">Cinematic reel $199–349 · twilight $150–200 · 3D tour $149–299. Photo, drone, floor plan from $248.</p>
  <div class="foot"><span class="url">brxs.ca</span><span class="geo">Booked direct</span></div>
""", S["lux2"], "scrim-top", 1080, 1350)

proof_pairs = [("Sky", S["sky_b"], S["sky_a"]), ("HDR", S["hdr_b"], S["hdr_a"]),
               ("Twilight", S["twi_b"], S["twi_a"]), ("Staging", S["sta_b"], S["sta_a"])]
cells = ""
for name, b, a in proof_pairs:
    cells += f"""
    <div style="border:1px solid {INK_F}55;border-radius:2px;overflow:hidden;background:{PAPER_D};">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:{INK_F}55;">
        <img src="{b}" style="width:100%;height:240px;object-fit:cover;display:block;"/>
        <img src="{a}" style="width:100%;height:240px;object-fit:cover;display:block;"/>
      </div>
      <div style="display:flex;justify-content:space-between;padding:9px 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:{INK_M};">
        <span>Before</span><span style="color:{BRICK_D};font-weight:500;">{name} · After</span></div>
    </div>"""
p6 = f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE}
.pframe{{position:relative;width:100%;height:100%;background:{PAPER};font-family:'General Sans',sans-serif;color:{INK};}}
.pcontent{{position:absolute;inset:0;padding:64px;display:flex;flex-direction:column;}}
.pbrand{{display:flex;align-items:center;gap:11px;}}
.pwm{{font-weight:500;font-size:24px;letter-spacing:-0.6px;color:{INK};}}
.phead{{font-weight:500;font-size:38px;letter-spacing:-0.9px;line-height:1.05;color:{INK};margin-top:14px;}}
.phead .ac{{color:{BRICK};}}
.psub{{font-size:15px;color:{INK_S};margin-top:8px;max-width:560px;}}
.pgrid{{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px;}}
</style></head><body><div class="pframe" style="width:1080px;height:1080px;"><div class="pcontent">
  <div class="pbrand">{BRICK_MARK}<span class="pwm">bricks</span></div>
  <div class="phead">The difference is in the <span class="ac">delivery.</span></div>
  <div class="psub">Sky replacement, HDR blending, twilight, virtual staging — the Bricks edit, every shoot.</div>
  <div class="pgrid">{cells}</div>
  <div class="foot" style="margin-top:auto;border-top:1px solid {INK_F}55;padding-top:18px;">
    <span style="font-family:'JetBrains Mono',monospace;font-size:15px;color:{INK};font-weight:500;">brxs.ca</span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:{INK_M};">Live in the GTA</span>
  </div>
</div></div></body></html>"""

POSTERS = {
    "01-launch-1080x1080.png":  (p1, 1080, 1080),
    "02-value-1080x1080.png":   (p2, 1080, 1080),
    "03-founder-1080x1350.png": (p3, 1080, 1350),
    "04-reel-cover-1080x1920.png": (p4, 1080, 1920),
    "05-luxury-1080x1350.png":  (p5, 1080, 1350),
    "06-proof-1080x1080.png":   (p6, 1080, 1080),
}

TMP = os.path.join(HERE, "_tmp")
os.makedirs(TMP, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    for fname, (html, w, h) in POSTERS.items():
        # write to a real file so the document has a file:// origin and
        # file:// image + font subresources resolve (set_content blocks them).
        html_path = os.path.join(TMP, fname.replace(".png", ".html"))
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
        po = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        po.goto("file://" + html_path, wait_until="networkidle")
        po.screenshot(path=os.path.join(POSTER_DIR, fname), clip={"x":0,"y":0,"width":w,"height":h})
        po.close()
        os.remove(html_path)
        print("wrote", fname)
    browser.close()
print("DONE")

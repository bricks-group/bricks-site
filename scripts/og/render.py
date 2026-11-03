"""Render scripts/og/og.html to public/og.png (1200x630). Run from the repo root: python3 scripts/og/render.py"""
from pathlib import Path
from playwright.sync_api import sync_playwright

here = Path(__file__).resolve().parent
out = here.parent.parent / 'public' / 'og.png'
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
    pg.goto((here / 'og.html').as_uri())
    pg.evaluate('document.fonts.ready')
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(out), clip={'x': 0, 'y': 0, 'width': 1200, 'height': 630})
    b.close()
print(out)

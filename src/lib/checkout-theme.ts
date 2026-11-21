import type { Appearance, CustomFontSource } from '@stripe/stripe-js'

/**
 * Stripe Appearance for the same-page pay form, built from the site's own
 * colour variables (globals.css) so it follows light and dark mode: paper
 * background, ink text, hairline borders, square corners, brick primary.
 */
export type SiteColors = {
  paper: string
  ink: string
  inkSoft: string
  inkMute: string
  hairStrong: string
  brick: string
  brickDeep: string
}

export const LIGHT: SiteColors = {
  paper: '#F4F1EB',
  ink: '#14110E',
  inkSoft: '#3B332A',
  inkMute: '#6B6054',
  hairStrong: 'rgba(20,17,16,0.13)',
  brick: '#D2542B',
  brickDeep: '#A8401F',
}

/** Stripe needs concrete colours; #RRGGBBAA hex is turned into rgba(). */
export function cssColor(v: string, fallback: string): string {
  const s = (v || '').trim()
  const m = /^#([0-9a-f]{6})([0-9a-f]{2})$/i.exec(s)
  if (m) {
    const n = parseInt(m[1], 16)
    const a = Math.round((parseInt(m[2], 16) / 255) * 100) / 100
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
  }
  return /^(#[0-9a-f]{3,6}|rgba?\([^)]*\))$/i.test(s) ? s : fallback
}

export function readSiteColors(get: (name: string) => string): SiteColors {
  return {
    paper: cssColor(get('--paper'), LIGHT.paper),
    ink: cssColor(get('--ink'), LIGHT.ink),
    inkSoft: cssColor(get('--inkSoft'), LIGHT.inkSoft),
    inkMute: cssColor(get('--inkMute'), LIGHT.inkMute),
    hairStrong: cssColor(get('--hairStrong'), LIGHT.hairStrong),
    brick: cssColor(get('--brick'), LIGHT.brick),
    brickDeep: cssColor(get('--brickDeep'), LIGHT.brickDeep),
  }
}

export const FONT_FAMILY = "'General Sans', system-ui, -apple-system, 'Segoe UI', sans-serif"

export function siteFonts(origin: string): CustomFontSource[] {
  return [
    { family: 'General Sans', src: `url(${origin}/fonts/GeneralSans-Regular.1336dc613744.woff2)`, weight: '400', display: 'swap' },
    { family: 'General Sans', src: `url(${origin}/fonts/GeneralSans-Medium.0168813e5da4.woff2)`, weight: '500', display: 'swap' },
  ]
}

export function bricksAppearance(c: SiteColors): Appearance {
  const line = `1px solid ${c.hairStrong}`
  return {
    theme: 'flat',
    labels: 'above',
    variables: {
      colorPrimary: c.brick,
      colorBackground: c.paper,
      colorText: c.ink,
      colorTextSecondary: c.inkMute,
      colorTextPlaceholder: c.inkMute,
      colorIcon: c.inkMute,
      colorDanger: c.brickDeep,
      fontFamily: FONT_FAMILY,
      fontSizeBase: '15px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      borderRadius: '0px',
      spacingUnit: '4px',
      gridRowSpacing: '16px',
      gridColumnSpacing: '12px',
      focusBoxShadow: 'none',
      focusOutline: 'none',
    },
    rules: {
      '.Input': { backgroundColor: c.paper, border: line, boxShadow: 'none', padding: '12px 14px' },
      '.Input:focus': { border: `1px solid ${c.ink}`, boxShadow: 'none' },
      '.Input--invalid': { border: `1px solid ${c.brickDeep}`, boxShadow: 'none' },
      '.Label': { color: c.inkSoft, fontWeight: '500', fontSize: '13px', marginBottom: '6px' },
      '.Tab': { backgroundColor: 'transparent', border: line, boxShadow: 'none', color: c.inkSoft },
      '.Tab:hover': { color: c.ink, border: `1px solid ${c.inkMute}` },
      '.Tab--selected': { backgroundColor: 'transparent', border: `1px solid ${c.ink}`, boxShadow: 'none', color: c.ink },
      '.Tab--selected:focus': { boxShadow: 'none' },
      '.TabIcon--selected': { fill: c.ink },
      '.TabLabel': { fontWeight: '500' },
      '.Block': { backgroundColor: 'transparent', border: line, boxShadow: 'none' },
      '.AccordionItem': { backgroundColor: 'transparent', border: line, boxShadow: 'none' },
      '.PickerItem': { backgroundColor: 'transparent', border: line, boxShadow: 'none' },
      '.PickerItem--selected': { border: `1px solid ${c.ink}`, boxShadow: 'none' },
      '.CheckboxInput': { border: line, boxShadow: 'none' },
      '.Error': { color: c.brickDeep, fontSize: '13px' },
    },
  }
}

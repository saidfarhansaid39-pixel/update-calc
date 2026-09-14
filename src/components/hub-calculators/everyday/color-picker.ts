import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hex: z.string().min(4).max(7), outputType: z.string().min(1), colorName: z.string().min(0) }),
  fields: [
    { name: 'hex', label: 'HEX Color', type: 'text', placeholder: '#1a3a8a' },
    { name: 'outputType', label: 'Output Format', type: 'select', options: [{ label: 'RGB (0-255)', value: 'rgb' }, { label: 'RGBA (0-1)', value: 'rgba' }, { label: 'HSL', value: 'hsl' }] },
    { name: 'colorName', label: 'Color Label (optional)', type: 'text', placeholder: 'e.g., primary brand' },
  ],
  defaults: { hex: '#1a759f', outputType: 'rgb', colorName: 'Brand Teal' },
  presets: [
    { label: 'Charcoal Gray', values: { hex: '#36454f', outputType: 'rgb', colorName: 'Charcoal' } },
    { label: 'Soft Lavender', values: { hex: '#d6cadd', outputType: 'hsl', colorName: 'Lavender' } },
    { label: 'Coral', values: { hex: '#ff7f50', outputType: 'rgb', colorName: 'Coral' } },
    { label: 'Navy', values: { hex: '#000080', outputType: 'rgba', colorName: 'Navy' } },
  ],
  compute: (v) => {
    const h = v.hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16) || 0
    const g = parseInt(h.substring(2, 4), 16) || 0
    const b = parseInt(h.substring(4, 6), 16) || 0
    const max = Math.max(r, g, b) / 255
    const min = Math.min(r, g, b) / 255
    const delta = max - min
    const lightness = ((max + min) / 2) * 100
    let hue = 0
    if (delta) {
      if (max === r / 255) hue = ((g / 255 - b / 255) / delta) % 6
      else if (max === g / 255) hue = (b / 255 - r / 255) / delta + 2
      else hue = (r / 255 - g / 255) / delta + 4
    }
    hue = Math.round(hue * 60)
    if (hue < 0) hue += 360
    const saturation = max === 0 ? 0 : delta / (1 - Math.abs(2 * lightness / 100 - 1)) * 100
    let resultString = ''
    if (v.outputType === 'rgb') resultString = `rgb(${r}, ${g}, ${b})`
    else if (v.outputType === 'rgba') resultString = `rgba(${(r/255).toFixed(3)}, ${(g/255).toFixed(3)}, ${(b/255).toFixed(3)}, 1)`
    else resultString = `hsl(${hue}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`
    const isLight = lightness > 60
    const isDark = lightness < 30
    const rgbSum = r + g + b
    const hexUpper = h.toUpperCase()
    return { result: resultString, label: `${v.outputType.toUpperCase()} Value`, unit: '', steps: [
      { label: 'HEX Input', value: `#${hexUpper}${v.colorName ? ` — ${v.colorName}` : ''}` },
      { label: 'RGB (0-255)', value: `${r}, ${g}, ${b}` },
      { label: 'RGB %', value: `${(r/255*100).toFixed(0)}%, ${(g/255*100).toFixed(0)}%, ${(b/255*100).toFixed(0)}%` },
      { label: 'HSL', value: `${hue}° ${Math.round(saturation)}% ${Math.round(lightness)}%` },
      { label: `Output (${v.outputType})`, value: resultString },
      { label: 'Brightness', value: isLight ? 'Light/pastel' : isDark ? 'Dark/shade' : 'Mid-tone' },
      { label: 'Color Family', value: hue < 30 ? 'Red-Orange' : hue < 90 ? 'Yellow-Green' : hue < 150 ? 'Green-Cyan' : hue < 210 ? 'Cyan-Blue' : hue < 270 ? 'Blue-Purple' : hue < 330 ? 'Purple-Pink' : 'Red-Pink' },
      { label: 'Grayscale Equivalent', value: `#${r.toString(16).padStart(2,'0').repeat(3).substring(0, 6).toUpperCase()} (approx)` },
    ] ,
    extras: [
      { label: 'Format Usage Guide', value: v.outputType === 'rgb' ? 'RGB(0-255) is the standard CSS format — works everywhere. Use for: web stylesheets, CSS-in-JS, design system tokens.' : v.outputType === 'rgba' ? 'Float RGBA (0-1) is used in: WebGL/Three.js shaders, Canvas API, OpenGL, and Unity UI. CSS prefers 0-255 for RGB with 0-1 alpha.' : 'HSL is the most intuitive format — adjust lightness for variants (L+10% = lighter, L-10% = darker). Used in: design systems, color manipulation, theme generation.' },
      { label: `HEX to ${v.outputType.toUpperCase()} Conversion`, value: v.outputType === 'rgb' ? `#${h[0]}${h[1]} = ${r} (16²×${parseInt(h[0], 16)}+16×${parseInt(h[1], 16)}), #${h[2]}${h[3]} = ${g}, #${h[4]}${h[5]} = ${b}. Each channel: 0 (00) to 255 (FF).` : v.outputType === 'rgba' ? `Divide each 0-255 by 255: ${r}÷255=${(r/255).toFixed(3)}, ${g}÷255=${(g/255).toFixed(3)}, ${b}÷255=${(b/255).toFixed(3)}. RGBA format is used in WebGL and OpenGL contexts.` : `From RGB(${r},${g},${b}): H=${hue}° (position on color wheel), S=${Math.round(saturation)}% (vibrancy), L=${Math.round(lightness)}% (brightness). This is the W3C standard HSL conversion.` },
      { label: 'Color Temperature', value: `#${hexUpper}: ${rgbSum > 550 ? 'Warm (' : rgbSum > 350 ? 'Neutral (' : 'Cool ('}${rgbSum}/765). ${r > b ? 'Red-dominant' : b > r ? 'Blue-dominant' : 'Balanced'} — ${r > b ? 'warm' : b > r ? 'cool' : 'neutral'} temperature. Warm colors advance visually; cool colors recede. Use warm for foreground/interactive, cool for backgrounds/space.` },
      { label: 'Design System Usage', value: `#${hexUpper} ${v.colorName ? `(${v.colorName})` : ''} in your palette: ${isLight ? 'Use as background or accent' : isDark ? 'Use as text or primary element' : 'Use as interactive color (buttons, links)'}. Create variants: lighten 20% for hover, darken 15% for active states, desaturate 30% for disabled states. Saturation ${Math.round(saturation)}%: ${saturation > 70 ? 'high energy' : saturation > 30 ? 'moderate' : 'subdued'}.` },
      { label: 'Accessibility Checklist', value: `For #${hexUpper}, WCAG AA requires: 4.5:1 for normal text, 3:1 for large text (18+ px). ${isLight ? 'Use charcoal/dark text (#2d2d2d or darker) for read' : isDark ? 'White (#fff) or light gray (#eee) for readable text — test with a contrast checker' : 'Both white and dark text may work — test contrast ratios'}. Minimum recommended contrast: 7:1 for small body text.` },
      { label: 'Print vs Screen Differences', value: `#${hexUpper} on screen uses additive RGB (emitted light). In print, subtractive CMYK will shift. For accurate brand colors in print, use Pantone Matching System. Screen: sRGB (web) vs Display P3 (Apple) — P3 shows ~25% more colors in the green/red range. Design in sRGB for web, P3 for video.` },
      { label: 'Material Design Elevation', value: `Use #${hexUpper} as a Material Design surface color? Lightness ${Math.round(lightness)}%: ${isLight ? 'Good for L0-L2 elevation (background, cards)' : isDark ? 'Good for L4-L8 elevation (bottom sheets, dialogs)' : 'Works as primary surface with white or dark overlays'}. Elevation overlay: light theme adds white overlay; dark theme adds white overlay at different opacities.` },
      { label: 'Analogous & Triadic Palettes', value: `Analogous: ${(hue - 30 + 360) % 360}°-${hue}°-${(hue + 30) % 360}° (harmonious). Triadic: ${hue}°, ${(hue + 120) % 360}°, ${(hue + 240) % 360}° (balanced contrast). Split-complementary: ${hue}°, ${(hue + 150) % 360}°, ${(hue + 210) % 360}° (high contrast with nuance). Use https://coolors.co or Adobe Color to generate full palettes.` },
    ]}
  },
  description: 'Convert HEX color codes to RGB (0-255), RGBA float (0-1), or HSL values with color family detection, brightness assessment, and accessibility guidance. Pick and analyze any color for web, print, or design system use.',
  formula: 'HEX to RGB: parseInt(pair, 16) for each channel (0-255). RGB to HSL: H = arctan2(√3(G−B), 2R−G−B) × 60°; S = Δ ÷ (1−|2L−1|); L = (max+min)/2. HEX shorthand: #RGB if each digit pair matches (e.g., #FF8800 → #F80).',
  interpretation: 'HEX uses base-16 (0-9, A-F) with each pair representing a color channel: Red, Green, Blue. Range 00 (0) to FF (255) — 256 values per channel × 3 = 16.7M colors. RGB (0-255) is the standard CSS format. HSL (Hue 0-360°, Saturation 0-100%, Lightness 0-100%) is more intuitive for creating color variants — adjust L for lighter/darker, S for muted/vibrant. Web-safe colors use multiples of 51: 00, 33, 66, 99, CC, FF (216 colors). For accessibility, ensure text on this background meets WCAG AA 4.5:1 contrast ratio.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hex: z.string().min(4).max(7), rgbType: z.string().min(1), colorName: z.string().min(0) }),
  fields: [
    { name: 'hex', label: 'HEX Color', type: 'text', placeholder: '#1a3a8a' },
    { name: 'rgbType', label: 'Channels', type: 'select', options: [{ label: 'RGB (0-255)', value: '255' }, { label: 'RGBA (0-1)', value: '1' }] },
    { name: 'colorName', label: 'Color Name (optional)', type: 'text', placeholder: 'e.g., ocean blue' },
  ],
  defaults: { hex: '#1a759f', rgbType: '255', colorName: 'Teal' },
  presets: [
    { label: 'Deep Ocean Blue', values: { hex: '#0a2463', rgbType: '255', colorName: 'Deep Blue' } },
    { label: 'Crimson Red', values: { hex: '#dc143c', rgbType: '255', colorName: 'Crimson' } },
    { label: 'Forest Green', values: { hex: '#228b22', rgbType: '255', colorName: 'Forest Green' } },
    { label: 'Warm Gold', values: { hex: '#daa520', rgbType: '255', colorName: 'Goldenrod' } },
  ],
  compute: (v) => {
    const h = v.hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16) || 0
    const g = parseInt(h.substring(2, 4), 16) || 0
    const b = parseInt(h.substring(4, 6), 16) || 0
    const max = Math.max(r, g, b) / 255
    const min = Math.min(r, g, b) / 255
    const delta = max - min
    let hue = 0
    if (delta) {
      if (max === r / 255) hue = ((g / 255 - b / 255) / delta) % 6
      else if (max === g / 255) hue = (b / 255 - r / 255) / delta + 2
      else hue = (r / 255 - g / 255) / delta + 4
    }
    hue = Math.round(hue * 60)
    if (hue < 0) hue += 360
    const lightness = (max + min) / 2 * 100
    const saturation = delta ? delta / (1 - Math.abs(2 * lightness / 100 - 1)) * 100 : 0
    const c = 1 - Math.abs(2 * lightness / 100 - 1)
    const satVal = delta ? delta / (1 - Math.abs(2 * lightness / 100 - 1)) * 100 : 0
    const isLight = lightness > 60
    const isDark = lightness < 30
    const rgbFloat = v.rgbType === '1' ? `${(r / 255).toFixed(3)}, ${(g / 255).toFixed(3)}, ${(b / 255).toFixed(3)}` : `${r}, ${g}, ${b}`
    const hexShorthand = h[0] === h[1] && h[2] === h[3] && h[4] === h[5] ? `#${h[0]}${h[2]}${h[4]}` : 'N/A'
    return { result: r * 65536 + g * 256 + b, label: `#${h.toUpperCase()}`, unit: 'RGB', steps: [
      { label: 'HEX Input', value: `#${h.toUpperCase()}${v.colorName ? ` (${v.colorName})` : ''}` },
      { label: `RGB (${v.rgbType === '1' ? '0-1' : '0-255'})`, value: `rgb(${rgbFloat})` },
      { label: 'RGB Integer Value', value: `${r}, ${g}, ${b}` },
      { label: 'HSL', value: `${hue}° ${saturation.toFixed(0)}% ${lightness.toFixed(0)}%` },
      { label: 'HEX Shorthand', value: hexShorthand !== 'N/A' ? `${hexShorthand} (shorthand valid)` : 'Not applicable (use full 6-char)' },
      { label: 'Tone', value: isLight ? 'Light' : isDark ? 'Dark' : 'Mid-tone' },
      { label: 'Saturation Description', value: saturation > 80 ? 'Highly saturated (vibrant)' : saturation > 40 ? 'Moderately saturated' : 'Desaturated/muted' },
      { label: 'Complementary Hue', value: `${(hue + 180) % 360}° (rotate hue by 180°)` },
    ] ,
    extras: [
      { label: 'RGB Channel Breakdown', value: `R=${r} (${(r / 255 * 100).toFixed(0)}%), G=${g} (${(g / 255 * 100).toFixed(0)}%), B=${b} (${(b / 255 * 100).toFixed(0)}%). Dominant channel: ${r > g && r > b ? 'Red' : g > r && g > b ? 'Green' : 'Blue'} (${Math.max(r, g, b)}). Weakest channel: ${Math.min(r, g, b) === r ? 'Red' : Math.min(r, g, b) === g ? 'Green' : 'Blue'} (${Math.min(r, g, b)}).` },
      { label: 'HSL Practical Meaning', value: `Hue ${hue}°: ${hue < 30 ? 'red-orange' : hue < 90 ? 'yellow-green' : hue < 150 ? 'green-cyan' : hue < 210 ? 'cyan-blue' : hue < 270 ? 'blue-purple' : hue < 330 ? 'purple-pink' : 'red-pink'} family. Sat ${saturation.toFixed(0)}%: ${saturation > 80 ? 'vibrant, pure color' : saturation > 40 ? 'moderate intensity, easy on eyes' : 'near-gray, subtle'}. Light ${lightness.toFixed(0)}%: ${isLight ? 'pastel/light tint' : isDark ? 'deep shade/near-black' : 'balanced mid-tone'}.` },
      { label: 'Accessibility: Contrast Ratio', value: `#${h.toUpperCase()} has relative luminance of ~${((0.2126 * r / 255 + 0.7152 * g / 255 + 0.0722 * b / 255)).toFixed(3)}. For WCAG AA: use white text (ratio ≥4.5:1) on ${isDark ? 'this dark bg' : 'some dark bgs'} or black text on ${isLight ? 'this light bg' : 'some light bgs'}. Test with contrast checkers for accessibility compliance.` },
      { label: 'HEX Shorthand Rules', value: hexShorthand !== 'N/A' ? `#${h.toUpperCase()} can be shortened to ${hexShorthand} because each channel has matching pairs (R=${h[0]}${h[1]}, G=${h[2]}${h[3]}, B=${h[4]}${h[5]}). Shorthand saves 3 chars and works in all modern browsers.` : 'Your hex cannot use 3-character shorthand because at least one channel has different digits (e.g., #1a3b5c must use full 6 characters). Only pairs like #ffcc00 → #fc0 work as shorthand.' },
      { label: 'Color Psychology & Usage', value: `Hue ${hue}° ${v.colorName ? `(${v.colorName})` : ''}: ${hue < 30 ? 'Reds signal urgency, passion, excitement — great for CTAs but use sparingly (increases heart rate).' : hue < 90 ? 'Yellows signal optimism, warmth, attention — use for highlights, not backgrounds (fatiguing at scale).' : hue < 150 ? 'Greens signal growth, health, nature — universally positive, easy on eyes for extended viewing.' : hue < 210 ? 'Cyans signal clarity, technology, water — modern and clean, popular in tech interfaces.' : hue < 270 ? 'Blues signal trust, stability, professionalism — the safest UI color, used by 75% of banks and tech companies.' : hue < 330 ? 'Purples signal creativity, luxury, wisdom — associated with premium brands and artistic contexts.' : 'Pinks signal romance, playfulness, creativity — popular for lifestyle and beauty brands.'}` },
      { label: 'Web-Safe Color Check', value: `#${h.toUpperCase()} is ${[0, 51, 102, 153, 204, 255].includes(r) && [0, 51, 102, 153, 204, 255].includes(g) && [0, 51, 102, 153, 204, 255].includes(b) ? '' : 'NOT '}a web-safe color (all channels multiples of 51 — 00, 33, 66, 99, CC, FF). Web-safe colors ensure consistent display across legacy 256-color systems; modern displays handle all 16.7M colors identically.` },
      { label: 'Conversion to CMYK (Print)', value: `For print: C=${((1 - r / 255 - Math.max(r, g, b) / 255) / (1 - Math.max(r, g, b) / 255 || 1) * 100).toFixed(0)}%, M=${((1 - g / 255 - Math.max(r, g, b) / 255) / (1 - Math.max(r, g, b) / 255 || 1) * 100).toFixed(0)}%, Y=${((1 - b / 255 - Math.max(r, g, b) / 255) / (1 - Math.max(r, g, b) / 255 || 1) * 100).toFixed(0)}%, K=${(100 - Math.max(r, g, b) / 255 * 100).toFixed(0)}%. Note: CMYK conversion is approximate — actual print output depends on paper stock, printer profile, and ink type. Use Pantone matching for exact brand colors.` },
    ]}
  },
  description: 'Convert HEX color codes to RGB (0-255 and 0-1) and HSL values with saturation/lightness descriptions, complementary hue finder, web-safe color check, and WCAG accessibility notes. Perfect for web designers, UI developers, and print designers.',
  formula: 'R = parseInt(hex[0-1], 16), G = parseInt(hex[2-3], 16), B = parseInt(hex[4-5], 16). S(HSL) = Δ ÷ (1 − |2L/100 − 1|) × 100. L = (max + min)/2 × 100. H = arctan2(√3(G−B), 2R−G−B) × 60° (mod 360).',
  interpretation: 'HEX uses base-16 (0-9, A-F) with 00 (0) to FF (255) per channel — 16.7 million possible colors. RGB range 0-255 (8-bit) or 0-1 (normalized). HSL cylinder: hue (0-360° color wheel), saturation (0-100% intensity), lightness (0-100% brightness). Web-safe palette uses 216 colors (6×6×6 grid of 00, 33, 66, 99, CC, FF). For accessibility, ensure contrast ratio ≥4.5:1 for normal text (WCAG AA). A color\'s complementary is hue + 180° for maximum contrast.'
}

export default calcDef

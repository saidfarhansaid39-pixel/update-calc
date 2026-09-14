import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hexColor: z.string().min(1).refine(v => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v), 'Invalid hex'), alphaOpacity: z.string().min(1).refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100') }),
  fields: [
    { name: 'hexColor', label: 'Hex Color (#rrggbb)', type: 'text', placeholder: '#1a3a8a' },
    { name: 'alphaOpacity', label: 'Opacity (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  defaults: { hexColor: "#1a759f", alphaOpacity: "100" },
  presets: [
    { label: "Bootstrap Primary", values: { hexColor: "#0d6efd", alphaOpacity: "100" } },
    { label: "Semi-Transparent Overlay", values: { hexColor: "#000000", alphaOpacity: "40" } },
    { label: "Tailwind Emerald", values: { hexColor: "#10b981", alphaOpacity: "100" } },
    { label: "Warm Accent", values: { hexColor: "#f59e0b", alphaOpacity: "80" } },
  ],
  compute: (v) => {
    const hex = v.hexColor.replace('#', '')
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16)
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16)
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16)
    const alpha = v.alphaOpacity / 100
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    const contrast = luminance > 0.5 ? '#000000' : '#FFFFFF'
    const hslR = r / 255; const hslG = g / 255; const hslB = b / 255
    const max = Math.max(hslR, hslG, hslB), min = Math.min(hslR, hslG, hslB)
    const l = (max + min) / 2
    const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
    const hue = hslR === max && hslG !== hslB ? 60 * ((hslG - hslB) / (max - min)) : undefined
    return { result: `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`, label: 'RGBA Value', unit: '', steps: [{ label: 'Hex Input', value: v.hexColor.toUpperCase() }, { label: 'Decimal RGB', value: `rgb(${r}, ${g}, ${b})` }, { label: 'With Alpha', value: `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})` }, { label: 'Relative Luminance', value: `${(luminance * 100).toFixed(1)}%` }, { label: 'Recommended Text Color', value: contrast }, { label: 'HSL (approx)', value: `hsl(${((hue ?? 0) + 360) % 360}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%)` }] ,
    extras: [
      { label: "WCAG Contrast Requirements", value: "Normal text: 4.5:1 minimum | Large text (18px+ / 14px bold): 3:1 | AA vs AAA compliance" },
      { label: "Luminance Explained", value: "Calculated as 0.299R + 0.587G + 0.114B. Below 0.5 = dark (use white text), above 0.5 = light (use black text)." },
      { label: "Color Blindness Considerations", value: "~8% of males have red-green deficiency. Avoid relying solely on color — use icons and patterns too." },
      { label: "Shorthand vs Full Hex", value: "#fff expands to #ffffff. Shorthand is identical — browsers convert RGB hex pairs automatically." },
      { label: "CSS Color Functions", value: "Modern CSS supports rgba(), hsla(), oklch(), and color-mix() for more powerful color manipulation." },
      { label: "Accessible Color Palettes", value: "Use tools like Coolors, Contrast Checker, or Adobe Color to verify ratios before committing to a palette." },
      { label: "Dark Mode Strategy", value: "Don't simply invert colors. Reduce luminance contrast — dark bg should be #1a1a2e, not #000." },
      { label: "Color Psychology", value: "Blue (#1a759f): trust/calm | Green (#10b981): growth/health | Orange (#f59e0b): energy/warmth | Red (#ef4444): urgency/error" },
    ]}
  },
  description: 'Convert any hex color code to RGBA, HSL, and RGB values. Calculate relative luminance to determine the best text color for accessibility compliance.',
  formula: 'RGB: Hex → Decimal per channel | Luminance = 0.299R + 0.587G + 0.114B (normalized 0-1) | HSL: derived from RGB min/max',
  interpretation: 'The WCAG 2.1 AA standard requires a 4.5:1 contrast ratio for normal text and 3:1 for large text. The relative luminance calculation here is the first step — you can then compute the actual contrast ratio between two colors as (L1 + 0.05) / (L2 + 0.05). A luminance value above 0.5 means the color is perceived as light and black text will be most readable; below 0.5 calls for white text. For production use, always verify your final color pair with a full contrast checker tool.'
}

export default calcDef

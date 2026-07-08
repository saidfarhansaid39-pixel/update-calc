import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hex: z.string().min(4).max(7), rgbType: z.string().min(1) }),
  fields: [
    { name: 'hex', label: 'HEX Color', type: 'text', placeholder: '#1a3a8a' },
    { name: 'rgbType', label: 'Channels', type: 'select', options: [{ label: 'RGB (0-255)', value: '255' }, { label: 'RGBA (0-1)', value: '1' }] },
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
    return { result: r * 65536 + g * 256 + b, label: `${r}, ${g}, ${b}`, unit: 'RGB', steps: [{ label: 'HEX', value: `#${h.toUpperCase()}` }, { label: 'RGB', value: `${r}, ${g}, ${b}` }, { label: 'HSL', value: `${hue}°, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%` }] }
  },
  description: 'Convert HEX color codes to RGB and HSL values. Perfect for web designers and developers working with color systems.',
  formula: 'R = hex[0-1], G = hex[2-3], B = hex[4-5] | HSL from RGB using standard conversion',
  interpretation: 'HEX uses base-16 (0-9,A-F). RGB range 0-255 per channel. HSL represents hue (0-360°), saturation (0-100%), lightness (0-100%).'
}

export default calcDef

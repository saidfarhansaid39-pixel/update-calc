import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hex: z.string().min(4).max(7), rgbType: z.string().min(1) }),
  fields: [
    { name: 'hex', label: 'HEX Color', type: 'text', placeholder: '#1a759f' },
    { name: 'rgbType', label: 'Channels', type: 'select', options: [{ label: 'RGB (0-255)', value: '255' }, { label: 'RGBA (0-1)', value: '1' }] },
  ],
  compute: (v) => {
    const h = v.hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16) || 0
    const g = parseInt(h.substring(2, 4), 16) || 0
    const b = parseInt(h.substring(4, 6), 16) || 0
    const max = Math.max(r, g, b) / 255
    const min = Math.min(r, g, b) / 255
    const lightness = ((max + min) / 2) * 100
    const saturation = max === 0 ? 0 : ((max - min) / (1 - Math.abs(2 * lightness / 100 - 1))) * 100
    return { result: `rgb(${r}, ${g}, ${b})`, label: 'RGB Value', unit: '', steps: [{ label: 'HEX', value: `#${h}` }, { label: 'RGB (0-255)', value: `rgb(${r}, ${g}, ${b})` }, { label: 'HSL', value: `hsl(${Math.round(saturation)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)` }] }
  },
  description: 'Convert HEX color codes to RGB values with HSL approximation. Enter any 6-digit hex color code to see its RGB components.',
  formula: 'R = parseInt(HEX[0-1], 16), G = parseInt(HEX[2-3], 16), B = parseInt(HEX[4-5], 16)',
  interpretation: 'HEX uses base-16 (0-9, A-F). Each pair represents one channel: Red, Green, Blue. Values range 00 (0) to FF (255). Web-safe colors use multiples of 51: 00, 33, 66, 99, CC, FF.'
}

export default calcDef

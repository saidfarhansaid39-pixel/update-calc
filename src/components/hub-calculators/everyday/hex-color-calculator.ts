import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hexColor: z.string().min(1).refine(v => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v), 'Invalid hex'), alphaOpacity: z.string().min(1).refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100') }),
  fields: [
    { name: 'hexColor', label: 'Hex Color (#rrggbb)', type: 'text', placeholder: '#1a3a8a' },
    { name: 'alphaOpacity', label: 'Opacity (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  compute: (v) => {
    const hex = v.hexColor.replace('#', '')
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16)
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16)
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16)
    const alpha = v.alphaOpacity / 100
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    const contrast = luminance > 0.5 ? '#000000' : '#FFFFFF'
    return { result: `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`, label: 'RGBA Value', unit: '', steps: [{ label: 'Hex', value: v.hexColor }, { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` }, { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})` }, { label: 'Luminance', value: `${(luminance * 100).toFixed(0)}%` }, { label: 'Suggested Text', value: contrast }] }
  },
  description: 'Convert hex color codes to RGBA values with opacity. Calculate luminance and determine whether to use light or dark text for readability.',
  formula: 'RGB = Hex to decimal conversion | Luminance = 0.299R + 0.587G + 0.114B | RGBA = RGB + Alpha',
  interpretation: 'Web accessibility requires 4.5:1 contrast ratio for normal text. Dark text on light backgrounds (luminance > 0.5) is most readable. Use hex codes consistently in CSS for maintainability.'
}

export default calcDef

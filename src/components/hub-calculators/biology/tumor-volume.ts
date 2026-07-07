import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    lengthMm: z.string().refine(v => parseFloat(v) > 0, '>0'),
    widthMm: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'lengthMm', label: 'Length (longest dimension)', type: 'number', unit: 'mm', min: 0.1, step: '0.1' },
    { name: 'widthMm', label: 'Width (perpendicular)', type: 'number', unit: 'mm', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const volume = (v.lengthMm * v.widthMm * v.widthMm) / 2
    const volumeCm3 = volume / 1000
    return {
      result: volume, label: 'Tumor Volume', unit: 'mm³',
      steps: [
        { label: 'Length (L)', value: `${v.lengthMm} mm` },
        { label: 'Width (W)', value: `${v.widthMm} mm` },
        { label: 'Volume = L × W² / 2', value: `${volume.toFixed(1)} mm³` },
        { label: 'Volume (cm³)', value: `${volumeCm3.toFixed(3)} cm³` },
        { label: 'Approx mass (if density ˜ 1 g/cm³)', value: `${volumeCm3.toFixed(3)} g` },
      ]
}
  },
  description: 'Tumor volume is estimated from caliper measurements using the ellipsoid formula. It is the standard endpoint in preclinical tumor xenograft studies.',
  formula: 'V = (L × W²) / 2 (ellipsoid approximation) | L = longest diameter, W = perpendicular diameter (shorter axis)',
  interpretation: 'Tumor volume doubling time is calculated from serial measurements. Typically measured 2-3 times per week. Endpoint volume for efficacy studies is usually 500-2000 mm³ depending on regulations.'
}

export default calcDef

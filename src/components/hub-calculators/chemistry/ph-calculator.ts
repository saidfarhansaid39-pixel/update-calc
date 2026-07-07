import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    hConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'hConc', label: '[H⁺] Concentration', type: 'number', unit: 'M', min: 1e-14, max: 10, step: 'any' },
  ],
  compute: (v) => {
    const ph = -Math.log10(v.hConc)
    const pOH = 14 - ph
    const cat = ph < 7 ? 'Acidic' : ph > 7 ? 'Basic' : 'Neutral'
    return {
      result: ph, label: 'pH', unit: '',
      steps: [
        { label: '[H⁺]', value: `${v.hConc.toExponential(3)} M` },
        { label: 'pH = -log₁₀[H⁺]', value: ph.toFixed(2) },
        { label: 'pOH', value: pOH.toFixed(2) },
        { label: 'Classification', value: cat },
      ]
}
  },
  description: 'pH measures the acidity or basicity of a solution on a logarithmic scale from 0 to 14. Each unit represents a tenfold change in hydrogen ion concentration.',
  formula: 'pH = -log₁₀[H⁺]',
  interpretation: 'pH < 7: acidic, pH = 7: neutral, pH > 7: basic. Strong acids have pH 0-3, weak acids pH 3-6, weak bases pH 8-11, strong bases pH 11-14.'
}

export default calcDef

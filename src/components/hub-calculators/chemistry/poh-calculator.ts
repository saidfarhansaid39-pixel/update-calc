import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ohConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'ohConc', label: '[OH⁻] Concentration', type: 'number', unit: 'M', min: 1e-14, max: 10, step: 'any' },
  ],
  compute: (v) => {
    const pOH = -Math.log10(v.ohConc)
    const pH = 14 - pOH
    return {
      result: pOH, label: 'pOH', unit: '',
      steps: [
        { label: '[OH⁻]', value: `${v.ohConc.toExponential(3)} M` },
        { label: 'pOH = -log₁₀[OH⁻]', value: pOH.toFixed(2) },
        { label: 'pH = 14 - pOH', value: pH.toFixed(2) },
      ]
}
  },
  description: 'pOH is the negative logarithm of hydroxide ion concentration. At 25°C, pH + pOH = 14 for aqueous solutions.',
  formula: 'pOH = -log₁₀[OH⁻]',
  interpretation: 'pOH is inversely related to pH. Higher pOH means more acidic, lower pOH means more basic. Used alongside pH for complete acid-base analysis.'
}

export default calcDef

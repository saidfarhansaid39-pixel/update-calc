import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    conc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'conc', label: 'Strong Base Concentration', type: 'number', unit: 'M', min: 1e-14, max: 10, step: 'any' },
  ],
  compute: (v) => {
    const pOH = -Math.log10(v.conc)
    const pH = 14 - pOH
    return {
      result: pH, label: 'pH', unit: '',
      steps: [
        { label: '[OH⁻]', value: `${v.conc.toExponential(3)} M` },
        { label: 'pOH = -log₁₀[OH⁻]', value: pOH.toFixed(2) },
        { label: 'pH = 14 − pOH', value: pH.toFixed(2) },
      ]
}
  },
  description: 'Strong bases completely dissociate in water, so [OH⁻] equals the base concentration. pH is calculated from pOH using pH + pOH = 14 at 25°C.',
  formula: 'pH = 14 + log₁₀[B] (strong base, complete dissociation)',
  interpretation: 'NaOH, KOH, Ca(OH)₂, and Ba(OH)₂ are strong bases. A 0.01 M NaOH solution has pOH = 2.00 and pH = 12.00. Group 1 hydroxides are fully dissociated.'
}

export default calcDef

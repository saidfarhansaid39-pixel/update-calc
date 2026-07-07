import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    cationConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    anionConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    ksp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'cationConc', label: 'Cation Concentration', type: 'number', unit: 'M', min: 1e-20, step: 'any' },
    { name: 'anionConc', label: 'Anion Concentration', type: 'number', unit: 'M', min: 1e-20, step: 'any' },
    { name: 'ksp', label: 'Ksp', type: 'number', unit: '', min: 1e-50, step: 'any' },
  ],
  compute: (v) => {
    const q = v.cationConc * v.anionConc
    const willPrecipitate = q > v.ksp
    return {
      result: willPrecipitate ? 'Precipitate forms' : 'No precipitate', label: 'Prediction', unit: '',
      steps: [
        { label: 'Q (ion product)', value: `${q.toExponential(6)}` },
        { label: 'Ksp', value: `${v.ksp.toExponential(6)}` },
        { label: 'Q vs Ksp', value: willPrecipitate ? 'Q > Ksp → precipitate' : 'Q ≤ Ksp → no precipitate' },
      ]
}
  },
  description: 'Predict whether a precipitate forms by comparing the reaction quotient Q (the ion product) with the solubility product constant Ksp.',
  formula: 'If Q = [cation][anion] > Ksp → precipitation occurs. If Q ≤ Ksp → solution is unsaturated or saturated.',
  interpretation: 'Q > Ksp: supersaturated, precipitate will form. Q = Ksp: saturated, at equilibrium. Q < Ksp: unsaturated, more solid can dissolve. Precipitation is used in gravimetric analysis and water treatment.'
}

export default calcDef

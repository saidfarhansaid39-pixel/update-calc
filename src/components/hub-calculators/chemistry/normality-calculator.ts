import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molarity: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    nFactor: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'molarity', label: 'Molarity', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'nFactor', label: 'n-factor (equivalents/mol)', type: 'number', unit: '', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const N = v.molarity * v.nFactor
    return {
      result: N, label: 'Normality', unit: 'N',
      steps: [
        { label: 'Molarity', value: `${v.molarity} M` },
        { label: 'n-factor', value: `${v.nFactor}` },
        { label: 'N = M × n', value: `${N.toFixed(4)} N` },
      ]
}
  },
  description: 'Normality (N) is the number of equivalent weights of solute per liter of solution. It is used in acid-base and redox titration calculations.',
  formula: 'N = M × n (where n is the number of H⁺, OH⁻, or electrons)',
  interpretation: 'For acids, n = number of H⁺ ions (H₂SO₄ has n = 2). For bases, n = number of OH⁻. For redox, n = electrons transferred. Same-solution N × V values can be equated directly.'
}

export default calcDef

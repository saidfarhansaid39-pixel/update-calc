import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    initial: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    change: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number'),
    coeff: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'initial', label: 'Initial [Reactant]', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'change', label: 'Change (x, amount reacted)', type: 'number', unit: 'M', min: 0, step: '0.001' },
    { name: 'coeff', label: 'Stoichiometric Coefficient', type: 'number', unit: '', min: 1, max: 10, step: '1' },
  ],
  compute: (v) => {
    const consumed = v.coeff * v.change
    const eq = v.initial - consumed
    return {
      result: Math.max(0, eq), label: 'Equilibrium [Reactant]', unit: 'M',
      steps: [
        { label: 'Initial [R]₀', value: `${v.initial} M` },
        { label: 'Change = -coeff × x', value: `-${consumed.toFixed(4)} M` },
        { label: 'Equilibrium [R]', value: `${eq.toFixed(4)} M` },
        { label: 'Valid?', value: eq > 0 ? 'Yes' : 'No — x too large, use quadratic' },
      ]
}
  },
  description: 'ICE (Initial-Change-Equilibrium) tables calculate equilibrium concentrations from initial concentrations and the extent of reaction (x).',
  formula: '[Eq] = [Initial] - (coeff × x) | Solve K = [P]/([R]) for x',
  interpretation: 'All equilibrium concentrations must be positive. If [Eq] < 0, the 5% approximation is invalid and the quadratic formula must be used to solve for x precisely.'
}

export default calcDef

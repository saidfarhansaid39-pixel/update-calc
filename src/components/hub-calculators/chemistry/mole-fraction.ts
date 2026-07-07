import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    nA: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    nB: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'nA', label: 'Moles of Component A', type: 'number', unit: 'mol', min: 0.0001, step: '0.01' },
    { name: 'nB', label: 'Moles of Component B', type: 'number', unit: 'mol', min: 0, step: '0.01' },
  ],
  compute: (v) => {
    const total = v.nA + v.nB
    const xA = v.nA / total
    const xB = v.nB / total
    return {
      result: xA, label: 'Mole Fraction of A (χₐ)', unit: '',
      steps: [
        { label: 'n(A)', value: `${v.nA} mol` },
        { label: 'n(B)', value: `${v.nB} mol` },
        { label: 'Total moles', value: `${total} mol` },
        { label: 'χ(A) = n(A) / n(total)', value: `${xA.toFixed(4)}` },
        { label: 'χ(B) = n(B) / n(total)', value: `${xB.toFixed(4)}` },
        { label: 'Sum check', value: `${(xA + xB).toFixed(4)} (should = 1)` },
      ]
}
  },
  description: 'Mole fraction (χ) is the ratio of moles of one component to the total moles in a mixture. A dimensionless quantity, the sum of all mole fractions in a mixture equals 1.',
  formula: 'χ_A = n_A / (n_A + n_B + ...) | χ_A + χ_B + ... = 1',
  interpretation: 'Mole fraction is used in Raoult\'s law (P_A = χ_A × P°_A) and gas mixtures (Dalton\'s law). For air: χ(N₂) ≈ 0.78, χ(O₂) ≈ 0.21, χ(Ar) ≈ 0.01.'
}

export default calcDef

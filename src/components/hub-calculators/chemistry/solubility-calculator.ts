import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    ksp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    coeff: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1')
}),
  fields: [
    { name: 'ksp', label: 'Ksp Value', type: 'number', unit: '', min: 1e-50, step: 'any' },
    { name: 'coeff', label: 'Number of Ions', type: 'number', unit: '', min: 1, max: 5, step: '1' },
  ],
  compute: (v) => {
    const s = Math.pow(v.ksp / Math.pow(v.coeff, v.coeff), 1 / (v.coeff + 1))
    return {
      result: s, label: 'Molar Solubility', unit: 'M',
      steps: [
        { label: 'Ksp', value: v.ksp.toExponential(4) },
        { label: 'Ions per formula unit', value: `${v.coeff}` },
        { label: 'Solubility = (Ksp/(c^c))^(1/(c+1))', value: `${s.toExponential(6)} M` },
      ]
}
  },
  description: 'Solubility product (Ksp) is the equilibrium constant for the dissolution of a sparingly soluble ionic compound. Molar solubility (S) is the concentration that dissolves.',
  formula: 'For AₓBᵧ: S = (Ksp / (xˣ × yʸ))^(1/(x+y))',
  interpretation: 'Lower Ksp means lower solubility. Temperature affects Ksp. Common Ksp values: AgCl (1.8×10⁻¹⁰), CaCO₃ (3.4×10⁻⁹), BaSO₄ (1.1×10⁻¹⁰).'
}

export default calcDef

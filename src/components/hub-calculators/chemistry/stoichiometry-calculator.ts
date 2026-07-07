import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molesA: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    coeffA: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    coeffB: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'molesA', label: 'Moles of Reactant A', type: 'number', unit: 'mol', min: 0, step: '0.001' },
    { name: 'coeffA', label: 'Coefficient of A', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'coeffB', label: 'Coefficient of B', type: 'number', unit: '', min: 1, step: '1' },
  ],
  compute: (v) => {
    const molesB = v.molesA * v.coeffB / v.coeffA
    return {
      result: molesB, label: 'Moles of Product B', unit: 'mol',
      steps: [
        { label: 'Moles A', value: `${v.molesA} mol` },
        { label: 'Ratio B/A', value: `${v.coeffB} / ${v.coeffA}` },
        { label: 'Moles B = A × (coeff B / coeff A)', value: `${molesB.toFixed(4)} mol` },
      ]
}
  },
  description: 'Stoichiometry uses mole ratios from balanced chemical equations to calculate amounts of reactants and products.',
  formula: 'moles B = moles A × (coefficient B / coefficient A)',
  interpretation: 'The mole ratio comes directly from the balanced chemical equation. For 2H₂ + O₂ → 2H₂O, the ratio H₂:O₂ = 2:1.'
}

export default calcDef

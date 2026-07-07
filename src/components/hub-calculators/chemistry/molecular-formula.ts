import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    empMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    molMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'empMass', label: 'Empirical Formula Mass', type: 'number', unit: 'g/mol', min: 1, step: '0.01' },
    { name: 'molMass', label: 'Molecular Mass (experimental)', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const mult = v.molMass / v.empMass
    return {
      result: mult, label: 'Multiplier n', unit: '',
      steps: [
        { label: 'Empirical formula mass', value: `${v.empMass} g/mol` },
        { label: 'Molecular mass', value: `${v.molMass} g/mol` },
        { label: 'n = molecular / empirical', value: mult.toFixed(2) },
      ]
}
  },
  description: 'The molecular formula is a multiple of the empirical formula. The multiplier n is found by dividing the experimental molecular mass by the empirical formula mass.',
  formula: 'n = molecular mass / empirical formula mass',
  interpretation: 'n must be a whole number (round to nearest integer). If n = 1, empirical and molecular formulas are the same. For glucose: empirical CH₂O (30 g/mol), molecular C₆H₁₂O₆ (180 g/mol), n = 6.'
}

export default calcDef

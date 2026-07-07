import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    empMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    molMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'empMass', label: 'Empirical Formula Mass', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
    { name: 'molMass', label: 'Molecular Mass (experimental)', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const n = Math.round(v.molMass / v.empMass)
    return {
      result: n, label: 'Multiplier n', unit: '',
      steps: [
        { label: 'Empirical formula mass', value: `${v.empMass} g/mol` },
        { label: 'Molecular mass', value: `${v.molMass} g/mol` },
        { label: 'n = molecular / empirical', value: `${n}` },
        { label: 'Molecular formula = n × (empirical)', value: n === 1 ? 'Same as empirical formula' : `${n} × empirical formula` },
      ]
}
  },
  description: 'The molecular formula shows the actual number of atoms of each element in a molecule, which is a whole-number multiple of the empirical formula.',
  formula: 'n = Molecular mass / Empirical formula mass',
  interpretation: 'If n = 1, the empirical and molecular formulas are the same. If n = 2, the molecular formula has twice the atoms of the empirical formula (e.g., C₂H₄O₂ vs CH₂O).'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    given: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    givenCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    targetCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'given', label: 'Moles of Known Substance', type: 'number', unit: 'mol', min: 0.001, step: '0.001' },
    { name: 'givenCoeff', label: 'Coefficient of Known Substance', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'targetCoeff', label: 'Coefficient of Target Substance', type: 'number', unit: '', min: 1, step: '1' },
  ],
  compute: (v) => {
    const target = v.given * v.targetCoeff / v.givenCoeff
    return {
      result: target, label: 'Moles of Target Substance', unit: 'mol',
      steps: [
        { label: 'Known moles', value: `${v.given} mol` },
        { label: 'Target / Given coefficient ratio', value: `${v.targetCoeff} / ${v.givenCoeff}` },
        { label: 'Target moles', value: `${target.toFixed(4)} mol` },
      ]
}
  },
  description: 'Reaction stoichiometry uses balanced chemical equation coefficients to convert between amounts of different substances involved in a chemical reaction.',
  formula: 'moles target = moles given × (coefficient target / coefficient given)',
  interpretation: 'The coefficients from the balanced equation give the mole ratios. For 2H₂ + O₂ → 2H₂O, 2 mol H₂ reacts with 1 mol O₂ to produce 2 mol H₂O.'
}

export default calcDef

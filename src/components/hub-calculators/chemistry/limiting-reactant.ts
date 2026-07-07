import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    aMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    bMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    aMw: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    bMw: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    aCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    bCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'aMass', label: 'Mass of Reactant A', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'aMw', label: 'Molar Mass of A', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
    { name: 'aCoeff', label: 'Coefficient of A', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'bMass', label: 'Mass of Reactant B', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'bMw', label: 'Molar Mass of B', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
    { name: 'bCoeff', label: 'Coefficient of B', type: 'number', unit: '', min: 1, step: '1' },
  ],
  compute: (v) => {
    const molA = v.aMass / v.aMw
    const molB = v.bMass / v.bMw
    const stoichA = molA / v.aCoeff
    const stoichB = molB / v.bCoeff
    const limiting = stoichA < stoichB ? 'A' : 'B'
    return {
      result: limiting, label: 'Limiting Reactant', unit: '',
      steps: [
        { label: 'Moles of A', value: `${molA.toFixed(4)} mol` },
        { label: 'Moles of B', value: `${molB.toFixed(4)} mol` },
        { label: 'A / coeff A', value: stoichA.toFixed(4) },
        { label: 'B / coeff B', value: stoichB.toFixed(4) },
        { label: 'Limiting reactant', value: limiting },
      ]
}
  },
  description: 'The limiting reactant is the reactant that is completely consumed first, determined by comparing the available mole ratios to the stoichiometric coefficients.',
  formula: 'Compare (moles A / coeff A) vs (moles B / coeff B). The smaller value indicates the limiting reactant.',
  interpretation: 'The limiting reactant determines the maximum amount of product that can form. The other reactant is in excess and remains after the reaction completes.'
}

export default calcDef

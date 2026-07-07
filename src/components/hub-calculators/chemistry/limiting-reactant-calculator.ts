import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molesA: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    molesB: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    coeffA: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    coeffB: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'molesA', label: 'Moles of Reactant A', type: 'number', unit: 'mol', min: 0, step: '0.001' },
    { name: 'coeffA', label: 'Coefficient of A', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'molesB', label: 'Moles of Reactant B', type: 'number', unit: 'mol', min: 0, step: '0.001' },
    { name: 'coeffB', label: 'Coefficient of B', type: 'number', unit: '', min: 1, step: '1' },
  ],
  compute: (v) => {
    const needB = v.molesA * v.coeffB / v.coeffA
    const limiting = v.molesB >= needB ? 'A (B is in excess)' : 'B (A is in excess)'
    const excess = v.molesB >= needB ? v.molesB - needB : v.molesA - (v.molesB * v.coeffA / v.coeffB)
    return {
      result: needB, label: 'Moles of B needed', unit: 'mol',
      steps: [
        { label: 'Moles A', value: `${v.molesA} mol` },
        { label: 'Moles B', value: `${v.molesB} mol` },
        { label: 'B needed for all A', value: `${needB.toFixed(4)} mol` },
        { label: 'Limiting reactant', value: limiting },
        { label: 'Excess remaining', value: `${Math.abs(excess).toFixed(4)} mol` },
      ]
}
  },
  description: 'The limiting reactant is the substance that is completely consumed first in a chemical reaction, determining the maximum amount of product formed.',
  formula: 'Compare actual mole ratios to stoichiometric ratios',
  interpretation: 'The limiting reactant determines the theoretical yield. Any excess reactant remains unconsumed after the reaction is complete.'
}

export default calcDef

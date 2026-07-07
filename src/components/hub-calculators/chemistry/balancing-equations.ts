import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    aCount: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1'),
    bCount: z.string().min(1, 'Required').refine(v => parseInt(v) >= 1, '≥ 1'),
    cCount: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '≥ 0'),
    dCount: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, '≥ 0')
}),
  fields: [
    { name: 'aCount', label: 'Atoms of Element in Reactant 1', type: 'number', unit: '', min: 1, max: 20, step: '1' },
    { name: 'bCount', label: 'Atoms of Element in Reactant 2', type: 'number', unit: '', min: 1, max: 20, step: '1' },
    { name: 'cCount', label: 'Atoms of Element in Product 1', type: 'number', unit: '', min: 0, max: 20, step: '1' },
    { name: 'dCount', label: 'Atoms of Element in Product 2', type: 'number', unit: '', min: 0, max: 20, step: '1' },
  ],
  compute: (v) => {
    const left = v.aCount + v.bCount
    const right = v.cCount + v.dCount
    const balanced = left === right
    return {
      result: balanced ? 'Balanced' : `Left: ${left}, Right: ${right}`, label: balanced ? 'Equation Status' : 'Imbalance', unit: '',
      steps: [
        { label: 'Atoms on left', value: `${left}` },
        { label: 'Atoms on right', value: `${right}` },
        { label: 'Status', value: balanced ? '✓ Balanced' : '✗ Unbalanced — adjust coefficients' },
      ]
}
  },
  description: 'Balancing chemical equations ensures the law of conservation of mass is satisfied — the same number of each type of atom appears on both sides of the equation.',
  formula: 'Count atoms per element on each side and adjust coefficients to make them equal.',
  interpretation: 'A balanced equation has the same number of each atom on both sides. Coefficients are the smallest whole numbers. H₂ + Cl₂ → 2HCl is balanced: 2 H and 2 Cl on each side.'
}

export default calcDef

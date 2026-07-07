import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    count1: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    mass2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    count2: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mass1', label: 'Atom 1 Mass', type: 'number', unit: 'g/mol', min: 0.001, step: '0.001' },
    { name: 'count1', label: 'Count of Atom 1', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'mass2', label: 'Atom 2 Mass', type: 'number', unit: 'g/mol', min: 0.001, step: '0.001' },
    { name: 'count2', label: 'Count of Atom 2', type: 'number', unit: '', min: 1, step: '1' },
  ],
  compute: (v) => {
    const mw = v.count1 * v.mass1 + v.count2 * v.mass2
    return {
      result: mw, label: 'Molecular Weight', unit: 'g/mol',
      steps: [
        { label: 'Atom 1', value: `${v.count1} × ${v.mass1}` },
        { label: 'Atom 2', value: `${v.count2} × ${v.mass2}` },
        { label: 'Molecular weight', value: `${mw.toFixed(3)} g/mol` },
      ]
}
  },
  description: 'Molecular weight (molecular mass) is the mass of one molecule, calculated as the sum of atomic masses of all constituent atoms.',
  formula: 'MW = Σ(nᵢ × Aᵢ)',
  interpretation: 'Molecular weight and molar mass are numerically equivalent. Molecular weight is expressed in daltons (Da) or g/mol.'
}

export default calcDef

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
    { name: 'mass1', label: 'Element 1 Mass', type: 'number', unit: 'g/mol', min: 0.001, step: '0.001' },
    { name: 'count1', label: 'Atoms of Element 1', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'mass2', label: 'Element 2 Mass', type: 'number', unit: 'g/mol', min: 0.001, step: '0.001' },
    { name: 'count2', label: 'Atoms of Element 2', type: 'number', unit: '', min: 1, step: '1' },
  ],
  compute: (v) => {
    const total = v.count1 * v.mass1 + v.count2 * v.mass2
    return {
      result: total, label: 'Molar Mass', unit: 'g/mol',
      steps: [
        { label: 'Element 1', value: `${v.count1} × ${v.mass1} g/mol` },
        { label: 'Element 2', value: `${v.count2} × ${v.mass2} g/mol` },
        { label: 'Total', value: `${total.toFixed(3)} g/mol` },
      ]
}
  },
  description: 'Molar mass is the mass of one mole of a substance, calculated by summing the atomic masses of all atoms in the formula multiplied by their counts.',
  formula: 'M = Σ(nᵢ × Aᵢ)',
  interpretation: 'Molar mass is expressed in g/mol. For example, H₂O has molar mass 2(1.008) + 16.00 = 18.016 g/mol. It is used to convert between mass and moles.'
}

export default calcDef

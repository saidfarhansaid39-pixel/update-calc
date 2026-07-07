import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pct1: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n < 100 }, '0-100'),
    mw1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    pct2: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n < 100 }, '0-100'),
    mw2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'pct1', label: 'Percent of Element 1', type: 'number', unit: '%', min: 0.1, max: 99.9, step: '0.1' },
    { name: 'mw1', label: 'Atomic Mass of Element 1', type: 'number', unit: 'g/mol', min: 1, step: '0.001' },
    { name: 'pct2', label: 'Percent of Element 2', type: 'number', unit: '%', min: 0.1, max: 99.9, step: '0.1' },
    { name: 'mw2', label: 'Atomic Mass of Element 2', type: 'number', unit: 'g/mol', min: 1, step: '0.001' },
  ],
  compute: (v) => {
    const mol1 = v.pct1 / v.mw1
    const mol2 = v.pct2 / v.mw2
    const ratio = mol1 >= mol2 ? mol1 / mol2 : mol2 / mol1
    return {
      result: ratio, label: 'Element Ratio (rounded)', unit: '',
      steps: [
        { label: 'Moles of 1', value: `${v.pct1} / ${v.mw1} = ${mol1.toFixed(4)}` },
        { label: 'Moles of 2', value: `${v.pct2} / ${v.mw2} = ${mol2.toFixed(4)}` },
        { label: 'Simplest ratio', value: mol1 >= mol2 ? `${(mol1 / mol2).toFixed(2)} : 1` : `1 : ${(mol2 / mol1).toFixed(2)}` },
      ]
}
  },
  description: 'The empirical formula is the simplest whole-number ratio of atoms in a compound, derived from percent composition data.',
  formula: '1. Convert % to grams. 2. Divide by atomic mass. 3. Divide by smallest value. 4. Round to nearest whole number.',
  interpretation: 'For example, 40.0% C (12.01) and 6.7% H (1.008) gives C₁H₂. The molecular formula may be a multiple of the empirical formula.'
}

export default calcDef

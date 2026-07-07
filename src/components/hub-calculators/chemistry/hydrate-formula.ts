import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    massHydrate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    massAnhydrous: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mwSalt: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'massHydrate', label: 'Mass of Hydrate', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'massAnhydrous', label: 'Mass of Anhydrous Salt', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'mwSalt', label: 'Molar Mass of Anhydrous Salt', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const massWater = v.massHydrate - v.massAnhydrous
    const molSalt = v.massAnhydrous / v.mwSalt
    const molWater = massWater / 18.015
    const ratio = molWater / molSalt
    return {
      result: ratio.toFixed(1), label: 'Water Molecules per Formula Unit', unit: '',
      steps: [
        { label: 'Mass of water lost', value: `${massWater.toFixed(4)} g` },
        { label: 'Moles of anhydrous salt', value: `${molSalt.toFixed(4)} mol` },
        { label: 'Moles of water', value: `${molWater.toFixed(4)} mol` },
        { label: 'Ratio water : salt', value: ratio.toFixed(2) },
      ]
}
  },
  description: 'Hydrate formula determination finds the number of water molecules associated with each formula unit of a salt by heating to drive off water and measuring mass loss.',
  formula: 'n = (mass water / 18.015) / (mass anhydrous / MW salt)',
  interpretation: 'Common hydrates include CuSO₄·5H₂O (blue vitriol) and Na₂CO₃·10H₂O (washing soda). The ratio n is typically a small whole number like 1, 2, 5, 7, or 10.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mw: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mass', label: 'Mass of Substance', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'mw', label: 'Molar Mass', type: 'number', unit: 'g/mol', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const moles = v.mass / v.mw
    return {
      result: moles, label: 'Moles', unit: 'mol',
      steps: [
        { label: 'Mass', value: `${v.mass} g` },
        { label: 'Molar mass', value: `${v.mw} g/mol` },
        { label: 'Moles = mass / molar mass', value: `${moles.toFixed(4)} mol` },
      ]
}
  },
  description: 'Convert between mass in grams and moles using the molar mass as the conversion factor. Moles = mass (g) / molar mass (g/mol).',
  formula: 'n = m / M',
  interpretation: 'Molar mass is the bridge between grams and moles. For example, 18 g of water (MW 18.015 g/mol) equals 1 mole, containing 6.022 × 10²³ molecules.'
}

export default calcDef

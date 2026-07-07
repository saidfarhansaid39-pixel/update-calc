import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molesLim: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be ≥ 0'),
    coeffLim: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    coeffProd: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    mwProd: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'molesLim', label: 'Moles of Limiting Reactant', type: 'number', unit: 'mol', min: 0, step: '0.001' },
    { name: 'coeffLim', label: 'Coefficient of Limiting', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'coeffProd', label: 'Coefficient of Product', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'mwProd', label: 'Molar Mass of Product', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const molesProd = v.molesLim * v.coeffProd / v.coeffLim
    const massProd = molesProd * v.mwProd
    return {
      result: massProd, label: 'Theoretical Yield', unit: 'g',
      steps: [
        { label: 'Moles limiting', value: `${v.molesLim} mol` },
        { label: 'Moles product', value: `${molesProd.toFixed(4)} mol` },
        { label: 'Mass product = moles × MW', value: `${massProd.toFixed(2)} g` },
      ]
}
  },
  description: 'Theoretical yield is the maximum amount of product that can be formed from the limiting reactant, assuming 100% reaction efficiency.',
  formula: 'moles product = moles limiting × (coeff product / coeff limiting)',
  interpretation: 'Actual yield is always ≤ theoretical yield due to side reactions, incomplete reactions, and losses. Percent yield = (actual / theoretical) × 100%.'
}

export default calcDef

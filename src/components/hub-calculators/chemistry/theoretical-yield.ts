import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    limMass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    limMw: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    limCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    prodCoeff: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    prodMw: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'limMass', label: 'Mass of Limiting Reactant', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'limMw', label: 'Molar Mass of Limiting Reactant', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
    { name: 'limCoeff', label: 'Coefficient of Limiting Reactant', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'prodCoeff', label: 'Coefficient of Product', type: 'number', unit: '', min: 1, step: '1' },
    { name: 'prodMw', label: 'Molar Mass of Product', type: 'number', unit: 'g/mol', min: 1, step: '0.1' },
  ],
  compute: (v) => {
    const molLim = v.limMass / v.limMw
    const molProd = molLim * v.prodCoeff / v.limCoeff
    const massProd = molProd * v.prodMw
    return {
      result: massProd, label: 'Theoretical Yield', unit: 'g',
      steps: [
        { label: 'Moles of limiting reactant', value: `${molLim.toFixed(4)} mol` },
        { label: 'Mole ratio product/limiting', value: `${v.prodCoeff} / ${v.limCoeff}` },
        { label: 'Moles of product', value: `${molProd.toFixed(4)} mol` },
        { label: 'Theoretical mass', value: `${massProd.toFixed(3)} g` },
      ]
}
  },
  description: 'Theoretical yield is the maximum amount of product that can be formed from the limiting reactant, assuming 100% efficiency and no side reactions.',
  formula: 'theoretical yield = moles(limiting) × (coeff product / coeff limiting) × MW(product)',
  interpretation: 'The actual yield is always less than or equal to the theoretical yield. The percent yield compares actual to theoretical. Common losses include side reactions and mechanical losses during purification.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass: z.string().refine(v => parseFloat(v) > 0, '>0'),
    mw: z.string().refine(v => parseFloat(v) > 0, '>0'),
    volumeFinal: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'mass', label: 'Mass of Solute', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'mw', label: 'Molecular Weight', type: 'number', unit: 'g/mol', min: 1, step: '1' },
    { name: 'volumeFinal', label: 'Final Volume', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const moles = v.mass / v.mw
    const molarity = moles / v.volumeFinal
    return {
      result: molarity, label: 'Solution Molarity', unit: 'M',
      steps: [
        { label: 'Mass', value: `${v.mass} g` },
        { label: 'MW', value: `${v.mw} g/mol` },
        { label: 'Moles = mass / MW', value: `${moles.toExponential(4)} mol` },
        { label: 'Molarity = moles / volume', value: `${molarity.toExponential(4)} M` },
        { label: 'In mM', value: `${(molarity * 1000).toFixed(2)} mM` },
      ]
}
  },
  description: 'Molarity (M) is the number of moles of solute per liter of solution. It is the most common concentration unit in biological and chemical laboratory work.',
  formula: 'M = n / V = mass / (MW × V) | n = moles, MW = molecular weight (g/mol), V = volume (L)',
  interpretation: 'Stock solutions are typically prepared at higher molarity then diluted. Common buffers: 1 M Tris, 0.5 M EDTA, 5 M NaCl. Always add solute to ~80% final volume, dissolve, then adjust to final volume.'
}

export default calcDef

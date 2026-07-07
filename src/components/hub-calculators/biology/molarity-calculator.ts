import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    volume: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    mw: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mass', label: 'Solute Mass', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'volume', label: 'Solution Volume', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
    { name: 'mw', label: 'Molecular Weight', type: 'number', unit: 'g/mol', min: 0.1, step: '0.01' },
  ],
  compute: (v) => {
    const molarity = v.mass / (v.mw * v.volume)
    return {
      result: molarity, label: 'Molarity', unit: 'M',
      steps: [
        { label: 'Mass', value: `${v.mass} g` },
        { label: 'Volume', value: `${v.volume} L` },
        { label: 'MW', value: `${v.mw} g/mol` },
        { label: 'Moles', value: `${(v.mass / v.mw).toFixed(4)} mol` },
        { label: 'Molarity', value: `${molarity.toFixed(4)} M` },
      ]
}
  },
  description: 'Molarity is the concentration of a solution expressed as moles of solute per liter. It is the most common concentration unit in laboratory biology and chemistry.',
  formula: 'Molarity (M) = Mass(g) / (MW × Volume(L))',
  interpretation: '1 M = 1 mole/L. Common lab concentrations: 0.1-10 M. Serial dilutions are used to achieve precise working concentrations from stock solutions.'
}

export default calcDef

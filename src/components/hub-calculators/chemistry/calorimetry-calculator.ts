import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mass: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    c: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    dT: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return !isNaN(n) }, 'Must be a number')
}),
  fields: [
    { name: 'mass', label: 'Mass of Substance', type: 'number', unit: 'g', min: 0.1, step: '0.1' },
    { name: 'c', label: 'Specific Heat Capacity', type: 'number', unit: 'J/(g·°C)', min: 0.001, step: '0.001' },
    { name: 'dT', label: 'Temperature Change ΔT', type: 'number', unit: '°C', step: '0.1' },
  ],
  compute: (v) => {
    const q = v.mass * v.c * v.dT
    return {
      result: q, label: 'Heat Energy q', unit: 'J',
      steps: [
        { label: 'Mass', value: `${v.mass} g` },
        { label: 'Specific heat', value: `${v.c} J/(g·°C)` },
        { label: 'ΔT', value: `${v.dT >= 0 ? '+' : ''}${v.dT} °C` },
        { label: 'q = mcΔT', value: `${q.toFixed(2)} J (${(q / 1000).toFixed(4)} kJ)` },
      ]
}
  },
  description: 'Calorimetry measures heat transfer using the equation q = mcΔT, where q is heat, m is mass, c is specific heat capacity, and ΔT is temperature change.',
  formula: 'q = mcΔT',
  interpretation: 'Positive q = heat absorbed (endothermic), negative q = heat released (exothermic). Water has a high specific heat (4.184 J/g·°C), making it an excellent coolant.'
}

export default calcDef

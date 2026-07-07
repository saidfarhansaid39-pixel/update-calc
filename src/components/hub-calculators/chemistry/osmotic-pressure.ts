import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    molarity: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    i: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, '≥ 1'),
    temp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'molarity', label: 'Molarity', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'i', label: 'Van\'t Hoff Factor', type: 'number', unit: '', min: 1, max: 10, step: '0.1' },
    { name: 'temp', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 0.082057
    const pi = v.i * v.molarity * R * v.temp
    return {
      result: pi, label: 'Osmotic Pressure Π', unit: 'atm',
      steps: [
        { label: 'Molarity', value: `${v.molarity} M` },
        { label: 'i', value: `${v.i}` },
        { label: 'T', value: `${v.temp} K` },
        { label: 'Π = iMRT', value: `${pi.toFixed(4)} atm` },
      ]
}
  },
  description: 'Osmotic pressure (Π) is the pressure required to prevent solvent flow across a semipermeable membrane due to a concentration difference.',
  formula: 'Π = iMRT',
  interpretation: 'Osmotic pressure is proportional to concentration. This principle is used in reverse osmosis for water purification and explains why salt preserves food.'
}

export default calcDef

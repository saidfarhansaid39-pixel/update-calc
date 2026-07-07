import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    m: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    i: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 1, '≥ 1'),
    t: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'm', label: 'Molarity', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'i', label: 'Van\'t Hoff Factor', type: 'number', unit: '', min: 1, max: 10, step: '0.1' },
    { name: 't', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 0.082057
    const pi = v.i * v.m * R * v.t
    return {
      result: pi, label: 'Osmotic Pressure Π', unit: 'atm',
      steps: [
        { label: 'Molarity', value: `${v.m} M` },
        { label: 'i', value: `${v.i}` },
        { label: 'T', value: `${v.t} K` },
        { label: 'Π = iMRT', value: `${pi.toFixed(4)} atm` },
        { label: 'Equivalent height of water', value: `${(pi * 10.33).toFixed(2)} m H₂O` },
      ]
}
  },
  description: 'Osmotic pressure (Π) is the pressure required to prevent the flow of solvent across a semipermeable membrane due to concentration differences.',
  formula: 'Π = iMRT',
  interpretation: 'Osmotic pressure is proportional to concentration. This principle is used in water purification (reverse osmosis) and explains why salt preserves food.'
}

export default calcDef

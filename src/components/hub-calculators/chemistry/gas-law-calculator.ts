import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    p: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'p', label: 'Pressure', type: 'number', unit: 'atm', min: 0.001, step: '0.001' },
    { name: 'v', label: 'Volume', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
    { name: 't', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 0.082057
    const n = v.p * v.v / (R * v.t)
    return {
      result: n, label: 'Moles of Gas n', unit: 'mol',
      steps: [
        { label: 'P', value: `${v.p} atm` },
        { label: 'V', value: `${v.v} L` },
        { label: 'T', value: `${v.t} K` },
        { label: 'R (constant)', value: '0.082057 L·atm/(mol·K)' },
        { label: 'n = PV/RT', value: `${n.toFixed(4)} mol` },
      ]
}
  },
  description: 'The Ideal Gas Law relates pressure, volume, amount, and temperature of an ideal gas. It combines Boyle\'s, Charles\'s, and Avogadro\'s laws.',
  formula: 'PV = nRT',
  interpretation: 'At STP (0°C, 1 atm), 1 mole of ideal gas occupies 22.4 L. The ideal gas law is accurate for most gases at moderate pressures and temperatures.'
}

export default calcDef

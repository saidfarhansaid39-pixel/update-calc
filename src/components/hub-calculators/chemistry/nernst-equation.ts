import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    e0: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -5 && n <= 5 }, '-5 to +5'),
    n: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    q: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    temp: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'e0', label: 'Standard Potential E°', type: 'number', unit: 'V', min: -5, max: 5, step: '0.001' },
    { name: 'n', label: 'Electrons Transferred', type: 'number', unit: 'e⁻', min: 1, max: 10, step: '1' },
    { name: 'q', label: 'Reaction Quotient Q', type: 'number', unit: '', min: 1e-20, step: 'any' },
    { name: 'temp', label: 'Temperature', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const R = 8.314, F = 96485
    const e = v.e0 - (R * v.temp) / (v.n * F) * Math.log(v.q)
    return {
      result: e, label: 'Cell Potential E', unit: 'V',
      steps: [
        { label: 'E°', value: `${v.e0 >= 0 ? '+' : ''}${v.e0} V` },
        { label: 'n', value: `${v.n} e⁻` },
        { label: 'Q', value: v.q.toExponential(4) },
        { label: 'RT/nF · ln(Q)', value: `${((R * v.temp) / (v.n * F) * Math.log(v.q)).toExponential(4)} V` },
        { label: 'E = E° - (RT/nF)ln(Q)', value: `${e >= 0 ? '+' : ''}${e.toExponential(4)} V` },
      ]
}
  },
  description: 'The Nernst equation calculates cell potential under non-standard conditions: E = E° - (RT/nF)ln(Q). It shows how concentration affects voltage.',
  formula: 'E = E° - (RT/nF) × ln(Q)',
  interpretation: 'At equilibrium (Q = K), E = 0. The Nernst equation explains how battery voltage decreases as reactants are consumed. Concentration cells produce small voltages from concentration differences alone.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    rate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'rate', label: 'Growth Rate (r)', type: 'number', unit: 'per time', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const dt = Math.LN2 / v.rate
    return {
      result: dt, label: 'Doubling Time', unit: 'time units',
      steps: [
        { label: 'Growth rate', value: `${v.rate} per unit` },
        { label: 'Doubling time', value: `${dt.toFixed(2)} units` },
        { label: 'Rule of 70 check', value: `${(70 / (v.rate * 100)).toFixed(2)}` },
      ]
}
  },
  description: 'Doubling time is the time it takes for a population or quantity to double in size at a constant growth rate. It is derived from the exponential growth equation.',
  formula: 'Doubling Time = ln(2) / r | Rule of 70: DT ˜ 70 / (r × 100)',
  interpretation: 'A 2% annual growth rate yields ~35-year doubling time. Higher rates = shorter doubling. The Rule of 70 gives a quick approximation: DT ˜ 70/growth rate (%).'
}

export default calcDef

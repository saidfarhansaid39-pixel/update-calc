import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    n0: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    rate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'n0', label: 'Initial Population', type: 'number', min: 1, step: '1' },
    { name: 'rate', label: 'Growth Rate (µ)', type: 'number', unit: 'h?¹', min: 0.01, step: '0.01' },
    { name: 'time', label: 'Time', type: 'number', unit: 'hours', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const nt = v.n0 * Math.exp(v.rate * v.time)
    const doubling = Math.LN2 / v.rate
    return {
      result: nt, label: 'Final Population', unit: 'cells',
      steps: [
        { label: 'Initial population', value: `${v.n0}` },
        { label: 'Growth rate (µ)', value: `${v.rate} h?¹` },
        { label: 'Time elapsed', value: `${v.time} h` },
        { label: 'Doubling time', value: `${doubling.toFixed(2)} h` },
        { label: 'Final population', value: `${nt.toFixed(0)}` },
      ]
}
  },
  description: 'Bacterial growth follows exponential kinetics in the log phase. Model population size over time given initial count and specific growth rate.',
  formula: 'Nt = N0 × e^(µ×t) | Doubling time = ln(2) / µ',
  interpretation: 'Exponential growth: Nt = N0 × e^(µt). Lag phase ? Log (exponential) phase ? Stationary phase ? Death phase.'
}

export default calcDef

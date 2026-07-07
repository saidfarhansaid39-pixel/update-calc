import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    n0: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    rate: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    years: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'n0', label: 'Initial Population', type: 'number', min: 1, step: '1' },
    { name: 'rate', label: 'Growth Rate (r)', type: 'number', unit: 'per year', min: 0.001, step: '0.001' },
    { name: 'years', label: 'Time', type: 'number', unit: 'years', min: 1, step: '1' },
  ],
  compute: (v) => {
    const nt = v.n0 * Math.exp(v.rate * v.years)
    const doubling = Math.LN2 / v.rate
    return {
      result: nt, label: 'Final Population', unit: 'individuals',
      steps: [
        { label: 'Initial pop', value: `${v.n0.toLocaleString()}` },
        { label: 'Growth rate (r)', value: `${v.rate}` },
        { label: 'Time', value: `${v.years} years` },
        { label: 'Doubling time', value: `${doubling.toFixed(2)} years` },
        { label: 'Final population', value: `${nt.toFixed(0).toLocaleString()}` },
      ]
}
  },
  description: 'Exponential population growth models unrestricted growth at a constant rate. It applies to populations with abundant resources and no limiting factors.',
  formula: 'Nt = N0 × e^(rt) | Doubling time = ln(2)/r',
  interpretation: 'Exponential growth is unrealistic long-term; logistic growth incorporates carrying capacity. Real populations follow logistic, boom-bust, or chaotic dynamics.'
}

export default calcDef

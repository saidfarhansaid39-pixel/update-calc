import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    n0: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    k: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    r: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    years: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'n0', label: 'Initial Population', type: 'number', min: 1, step: '1' },
    { name: 'k', label: 'Carrying Capacity (K)', type: 'number', min: 1, step: '1' },
    { name: 'r', label: 'Growth Rate (r)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'years', label: 'Time Steps', type: 'number', unit: 'years', min: 1, step: '1' },
  ],
  compute: (v) => {
    let n = v.n0
    for (let i = 0; i < Math.min(v.years, 1000); i++) {
      n = n + v.r * n * (1 - n / v.k)
    }
    return {
      result: n, label: 'Population at K', unit: '',
      steps: [
        { label: 'Initial pop', value: `${v.n0}` },
        { label: 'K (carrying capacity)', value: `${v.k}` },
        { label: 'r (growth rate)', value: `${v.r}` },
        { label: 'Iterations', value: `${Math.min(v.years, 1000)}` },
        { label: 'Final population', value: `${n.toFixed(0)}` },
        { label: 'K saturation', value: `${(n / v.k * 100).toFixed(1)}% of K` },
      ]
}
  },
  description: 'Carrying capacity (K) is the maximum population size an environment can sustain. The logistic growth model incorporates density-dependent limiting factors.',
  formula: 'dN/dt = rN(1 – N/K) | Logistic growth equation',
  interpretation: 'When N = K, population growth stops. Below K, growth is positive. Above K, population declines. K is not fixed — it changes with environmental conditions.'
}

export default calcDef

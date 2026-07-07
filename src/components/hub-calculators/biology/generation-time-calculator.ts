import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    n0: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    nt: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'n0', label: 'Initial Cell Count', type: 'number', min: 1, step: '1' },
    { name: 'nt', label: 'Final Cell Count', type: 'number', min: 1, step: '1' },
    { name: 'time', label: 'Time Elapsed', type: 'number', unit: 'hours', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const n = Math.log(v.nt / v.n0) / Math.LN2
    const genTime = v.time / n
    const growthRate = Math.log(v.nt / v.n0) / v.time
    return {
      result: genTime, label: 'Generation Time', unit: 'hours',
      steps: [
        { label: 'Initial count', value: `${v.n0}` },
        { label: 'Final count', value: `${v.nt}` },
        { label: 'Time elapsed', value: `${v.time} h` },
        { label: 'Number of generations', value: `${n.toFixed(2)}` },
        { label: 'Generation time', value: `${genTime.toFixed(2)} h` },
        { label: 'Growth rate (µ)', value: `${growthRate.toFixed(4)} h?¹` },
      ]
}
  },
  description: 'Generation (doubling) time is the time it takes for a microbial population to double in number. It indicates growth efficiency and culture health.',
  formula: 'n = log2(Nt/N0) | Generation Time = t / n | µ = ln(Nt/N0) / t',
  interpretation: 'E. coli doubling time: ~20 min in rich media. Mammalian cells: 18-24 h. Yeast: ~90 min. Faster growth = shorter generation time.'
}

export default calcDef

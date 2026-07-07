import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    remaining: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    initial: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'initial', label: 'Initial Amount', type: 'number', min: 0.1, step: '0.1' },
    { name: 'remaining', label: 'Remaining Amount', type: 'number', min: 0, step: '0.1' },
    { name: 'time', label: 'Time Elapsed', type: 'number', unit: 'time', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const ratio = v.remaining / v.initial
    const halfLife = ratio > 0 ? v.time * Math.LN2 / Math.log(v.initial / v.remaining) : 0
    const decayConstant = Math.LN2 / halfLife
    return {
      result: halfLife, label: 'Half-Life', unit: 'time units',
      steps: [
        { label: 'Initial amount', value: `${v.initial}` },
        { label: 'Remaining after t', value: `${v.remaining}` },
        { label: 'Time elapsed', value: `${v.time}` },
        { label: 'Decay constant (?)', value: `${decayConstant.toFixed(4)}` },
        { label: 'Half-life', value: `${halfLife.toFixed(2)} units` },
      ]
}
  },
  description: 'Half-life is the time required for a quantity to reduce to half its initial value through exponential decay. Used in nuclear physics, pharmacology, and biology.',
  formula: 'Nt = N0 × (1/2)^(t/t½) | t½ = t × ln(2) / ln(N0/Nt)',
  interpretation: 'After n half-lives: remaining = initial × (1/2)^n. After 1: 50%, 2: 25%, 3: 12.5%, 4: 6.25%, 5: 3.125%, 10: ~0.1%.'
}

export default calcDef

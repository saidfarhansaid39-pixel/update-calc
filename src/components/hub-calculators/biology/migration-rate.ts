import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    fst: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n <= 1 }, '0-1')
}),
  fields: [
    { name: 'fst', label: 'FST (Fixation Index)', type: 'number', min: 0, max: 1, step: '0.01' },
  ],
  compute: (v) => {
    const nm = v.fst < 1 ? (1 - v.fst) / (2 * v.fst) : 0
    return {
      result: nm, label: 'Gene Flow (Nm)', unit: 'migrants/generation',
      steps: [
        { label: 'FST', value: `${v.fst.toFixed(3)}` },
        { label: 'Nm = (1 - FST) / (2 × FST)', value: `${nm.toFixed(2)}` },
        { label: 'Interpretation', value: nm > 1 ? 'High gene flow (Nm > 1: homogenizing)' : nm > 0.1 ? 'Moderate gene flow' : 'Low gene flow (drift dominates)' },
      ]
}
  },
  description: 'The migration rate or gene flow (Nm) estimates the number of migrants per generation between populations. It is inferred from FST under the island model.',
  formula: 'FST ˜ 1 / (4Nm + 1) | Nm = (1 - FST) / (2 × FST) for diploids under infinite island model',
  interpretation: 'Nm > 1: gene flow sufficient to prevent differentiation by drift alone. Nm < 0.5: populations will diverge. Nm < 0.1: nearly isolated.'
}

export default calcDef

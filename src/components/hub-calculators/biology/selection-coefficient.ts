import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    relativeFitness: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n <= 1 }, '0-1')
}),
  fields: [
    { name: 'relativeFitness', label: 'Relative Fitness (w)', type: 'number', min: 0, max: 1, step: '0.01' },
  ],
  compute: (v) => {
    const w = v.relativeFitness; const s = 1 - w
    return {
      result: s * 100, label: 'Selection Coefficient (s)', unit: '%',
      steps: [
        { label: 'Relative fitness (w)', value: `${w.toFixed(3)}` },
        { label: 's = 1 - w', value: `${s.toFixed(3)}` },
        { label: 'Selection against genotype', value: `${(s*100).toFixed(1)}% reduction` },
        { label: 'If s=1: completely lethal', value: s >= 1 ? 'Yes' : 'No' },
        { label: 'If s=0: no selection', value: s <= 0.001 ? 'Yes' : 'No' },
      ]
}
  },
  description: 'The selection coefficient (s) measures the intensity of natural selection against a genotype. It is the reduction in fitness relative to the most fit genotype.',
  formula: 's = 1 - w, where w = relative fitness (0 = w = 1) | w = 1 means no selection disadvantage',
  interpretation: 's = 0: selectively neutral. s = 1: complete lethality. s > 0 indicates purifying selection. Negative s (w > 1) indicates positive selection.'
}

export default calcDef

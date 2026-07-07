import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    species: z.string().min(1, 'Required').refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers')
}),
  fields: [
    { name: 'species', label: 'Species Abundances', type: 'number', step: '1' },
  ],
  compute: (v) => {
    const counts = (v.species || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n))
    const total = counts.reduce((a: number, b: number) => a + b, 0)
    const d = counts.map((c: number) => { const p = c / total; return p * p }).reduce((a: number, b: number) => a + b, 0)
    const invD = total > 0 ? 1 / d : 0
    const gini = 1 - d
    return {
      result: gini, label: "Simpson's (1-D)", unit: '',
      steps: [
        { label: 'Total individuals', value: total.toFixed(0) },
        ...counts.map((c: number, i: number) => ({ label: `Species ${i+1}`, value: `${c} (${(c/total*100).toFixed(1)}%)` })),
        { label: 'D = Σ pᵢ²', value: d.toFixed(4) },
        { label: '1-D (diversity)', value: gini.toFixed(4) },
        { label: '1/D (inverse)', value: invD.toFixed(2) },
      ]
}
  },
  description: "Simpson's Diversity Index measures the probability that two randomly selected individuals belong to different species. It ranges from 0 (no diversity) to 1 (infinite diversity).",
  formula: 'D = Σ(pᵢ²) | Simpson\'s Index (1-D) | Inverse Simpson (1/D)',
  interpretation: '1-D = 0 (low diversity) to ~1 (high diversity). 1/D = effective number of species. More intuitive: 1/D = 5 means the diversity equals 5 equally common species.'
}

export default calcDef

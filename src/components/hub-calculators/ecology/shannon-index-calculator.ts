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
    const proportions = counts.map((c: number) => c / total)
    const shannon = -proportions.map((p: number) => p > 0 ? p * Math.log(p) : 0).reduce((a: number, b: number) => a + b, 0)
    const maxDiv = Math.log(counts.length)
    const evenness = maxDiv > 0 ? shannon / maxDiv : 0
    return {
      result: shannon, label: 'Shannon-Wiener H\'', unit: '',
      steps: [
        { label: 'Number of species (S)', value: `${counts.length}` },
        { label: 'Total individuals', value: total.toFixed(0) },
        ...proportions.map((p: number, i: number) => ({ label: `p${i+1}`, value: `${p.toFixed(4)}` })),
        { label: 'H\' = -Σ pᵢ ln(pᵢ)', value: shannon.toFixed(4) },
        { label: 'H\' max = ln(S)', value: maxDiv.toFixed(4) },
        { label: 'Evenness J\'', value: evenness.toFixed(4) },
      ]
}
  },
  description: 'The Shannon-Wiener index (H\') quantifies species diversity by accounting for both richness and evenness. It is one of the most widely used biodiversity metrics.',
  formula: "H' = -Σ(pᵢ × ln(pᵢ)) | H'max = ln(S) | J' = H'/H'max",
  interpretation: 'H\' = 0 when only one species present. Higher H\' = greater diversity. Typical values: 0.5-2 (disturbed), 2-3.5 (moderate), 3.5-4.5 (pristine).'
}

export default calcDef

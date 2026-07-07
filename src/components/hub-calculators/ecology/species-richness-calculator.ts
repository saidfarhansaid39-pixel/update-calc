import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    species: z.string().min(1, 'Required').refine(v => v.split(',').every(s => !isNaN(parseFloat(s.trim()))), 'Comma-separated numbers'),
    samples: z.string().optional().refine(v => !v || parseInt(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'species', label: 'Species Abundances', type: 'number', step: '1' },
    { name: 'samples', label: 'Number of Samples (optional)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const counts = (v.species || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n))
    const total = counts.reduce((a: number, b: number) => a + b, 0)
    const richness = counts.filter((c: number) => c > 0).length
    const margalef = (richness - 1) / Math.log(total)
    const menhinick = richness / Math.sqrt(total)
    return {
      result: richness, label: 'Species Richness (S)', unit: '',
      steps: [
        { label: 'Species observed', value: `${richness}` },
        { label: 'Total individuals', value: total.toFixed(0) },
        { label: 'Margalef index', value: margalef.toFixed(4) },
        { label: 'Menhinick index', value: menhinick.toFixed(4) },
        { label: 'Interpretation', value: richness >= 20 ? 'High richness' : richness >= 10 ? 'Moderate richness' : 'Low richness' },
      ]
}
  },
  description: 'Species richness is the count of different species in a community. The Margalef and Menhinick indices adjust richness for sampling effort.',
  formula: 'S = number of species | Margalef: (S-1)/ln(N) | Menhinick: S/√N',
  interpretation: 'Species richness depends on sampling effort. Rarefaction curves help standardize comparisons. More samples usually reveal more species (species-area relationship).'
}

export default calcDef

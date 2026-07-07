import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    chromosomePairs: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n > 0 && n <= 50 }, '1-50')
}),
  fields: [
    { name: 'chromosomePairs', label: 'Number of Chromosome Pairs (n)', type: 'number', min: 1, max: 50, step: '1' },
  ],
  compute: (v) => {
    const combinations = Math.pow(2, v.chromosomePairs)
    return {
      result: combinations, label: 'Unique Gamete Combos', unit: '',
      steps: [
        { label: 'Haploid number (n)', value: `${v.chromosomePairs}` },
        { label: 'Independent assortment', value: `2^${v.chromosomePairs}` },
        { label: 'Unique gamete types', value: `${combinations.toLocaleString()}` },
        { label: 'With crossover', value: '~10²× more (virtually unlimited)' },
      ]
}
  },
  description: 'Meiosis produces genetically unique gametes through independent assortment and crossing over, generating tremendous genetic diversity.',
  formula: 'Unique combinations = 2^n (without crossover) | n = haploid chromosome number',
  interpretation: 'Humans (n=23): 2²³ = 8.4 million combinations without crossover. With crossing over, each gamete is effectively unique among billions.'
}

export default calcDef

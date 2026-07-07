import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    total: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    germinated: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'total', label: 'Total Seeds Planted', type: 'number', min: 1, step: '1' },
    { name: 'germinated', label: 'Seeds Germinated', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const pct = v.germinated / v.total * 100
    return {
      result: pct, label: 'Germination Rate', unit: '%',
      steps: [
        { label: 'Total seeds', value: `${v.total}` },
        { label: 'Germinated', value: `${v.germinated}` },
        { label: 'Germination rate', value: `${pct.toFixed(1)}%` },
        { label: 'Quality', value: pct >= 90 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 50 ? 'Fair' : 'Poor' },
      ]
}
  },
  description: 'Seed germination rate is the percentage of seeds that successfully sprout. High germination rates indicate seed viability and proper growing conditions.',
  formula: 'Germination Rate (%) = (Germinated seeds / Total seeds) × 100',
  interpretation: 'Commercial seeds: =85% germination. Rates below 50% suggest poor seed quality, improper storage, or suboptimal germination conditions.'
}

export default calcDef

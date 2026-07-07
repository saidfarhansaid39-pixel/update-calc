import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    hits: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    atBats: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0')
}),
  fields: [
    { name: 'hits', label: 'Hits', type: 'number', min: 0, step: '1' },
    { name: 'atBats', label: 'At Bats', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const avg = v.hits / v.atBats
    const obp = avg
    return {
      result: avg, label: 'Batting Average', unit: '',
      steps: [
        { label: 'Hits', value: `${v.hits}` },
        { label: 'At bats', value: `${v.atBats}` },
        { label: 'AVG', value: `${avg.toFixed(3)} (${(avg * 1000).toFixed(0)} per 1000 AB)` },
        { label: 'Rating', value: avg > 0.300 ? 'Elite' : avg > 0.280 ? 'Excellent' : avg > 0.250 ? 'Good' : avg > 0.230 ? 'Average' : 'Below average' },
      ]
}
  },
  description: 'Calculate batting average (AVG), the ratio of hits to at bats in baseball. A .300 average is considered elite, while .250-.270 is around league average in MLB.'
}

export default calcDef

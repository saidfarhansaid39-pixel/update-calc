import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    made: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    attempts: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0')
}),
  fields: [
    { name: 'made', label: 'Free Throws Made', type: 'number', min: 0, step: '1' },
    { name: 'attempts', label: 'Free Throws Attempted', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const pct = v.made / v.attempts * 100
    return {
      result: pct, label: 'Free Throw Percentage', unit: '%',
      steps: [
        { label: 'Made', value: `${v.made}` },
        { label: 'Attempted', value: `${v.attempts}` },
        { label: 'FT%', value: `${pct.toFixed(1)}%` },
        { label: 'Points from FT', value: `${v.made} points` },
        { label: 'NBA average', value: pct > 82 ? 'Excellent (>NBA avg 78%)' : pct > 73 ? 'Around NBA average' : 'Below NBA average (~78%)' },
      ]
}
  },
  description: 'Calculate free throw percentage (FT%). Free throw shooting is a fundamental basketball skill that can significantly impact game outcomes, especially in close contests.'
}

export default calcDef

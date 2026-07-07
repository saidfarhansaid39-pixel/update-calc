import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    comp: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    att: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0'),
    yards: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    td: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    interceptions: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'comp', label: 'Completions', type: 'number', min: 0, step: '1' },
    { name: 'att', label: 'Attempts', type: 'number', min: 1, step: '1' },
    { name: 'yards', label: 'Passing Yards', type: 'number', min: 0, step: '1' },
    { name: 'td', label: 'Touchdowns', type: 'number', min: 0, step: '1' },
    { name: 'interceptions', label: 'Interceptions', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const a = Math.max(0, Math.min(2.375, (v.comp / v.att - 0.3) * 5))
    const b = Math.max(0, Math.min(2.375, (v.yards / v.att - 3) * 0.25))
    const c = Math.max(0, Math.min(2.375, v.td / v.att * 20))
    const d = Math.max(0, Math.min(2.375, 2.375 - v.interceptions / v.att * 25))
    const rating = (a + b + c + d) / 6 * 100
    const pct = v.comp / v.att * 100
    return {
      result: rating, label: 'NFL Passer Rating', unit: '',
      steps: [
        { label: 'Completion %', value: `${pct.toFixed(1)}%` },
        { label: 'Yards per attempt', value: `${(v.yards / v.att).toFixed(1)}` },
        { label: 'TD %', value: `${(v.td / v.att * 100).toFixed(1)}%` },
        { label: 'INT %', value: `${(v.interceptions / v.att * 100).toFixed(1)}%` },
        { label: 'Passer Rating', value: `${rating.toFixed(1)}` },
        { label: 'Grade', value: rating > 100 ? 'Excellent' : rating > 85 ? 'Good' : rating > 70 ? 'Average' : rating > 55 ? 'Below Average' : 'Poor' },
      ]
}
  },
  description: 'Calculate the NFL Passer Rating formula, which combines completion percentage, yards per attempt, touchdown percentage, and interception percentage. A perfect rating is 158.3.'
}

export default calcDef

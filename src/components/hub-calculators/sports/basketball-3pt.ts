import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    made: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    attempts: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0')
}),
  fields: [
    { name: 'made', label: '3-Pointers Made', type: 'number', min: 0, step: '1' },
    { name: 'attempts', label: '3-Pointers Attempted', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const pct = v.made / v.attempts * 100
    return {
      result: pct, label: '3-Point Percentage', unit: '%',
      steps: [
        { label: 'Made', value: `${v.made}` },
        { label: 'Attempted', value: `${v.attempts}` },
        { label: '3PT%', value: `${pct.toFixed(1)}%` },
        { label: 'Effective FG%', value: `${((v.made * 1.5) / v.attempts * 100).toFixed(1)}% (adjusted for 3-pt value)` },
        { label: 'NBA average', value: pct > 38 ? 'Above NBA average (~36%)' : pct > 33 ? 'Around NBA average' : 'Below NBA average (~36%)' },
      ]
}
  },
  description: 'Calculate three-point shooting percentage (3PT%). Three-point shooting efficiency is increasingly important in modern basketball analytics.'
}

export default calcDef

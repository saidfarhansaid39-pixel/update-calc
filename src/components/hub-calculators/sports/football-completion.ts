import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    comp: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    att: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0')
}),
  fields: [
    { name: 'comp', label: 'Completions', type: 'number', min: 0, step: '1' },
    { name: 'att', label: 'Attempts', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const pct = v.comp / v.att * 100
    return {
      result: pct, label: 'Completion Percentage', unit: '%',
      steps: [
        { label: 'Completions', value: `${v.comp}` },
        { label: 'Attempts', value: `${v.att}` },
        { label: 'Completion %', value: `${pct.toFixed(1)}%` },
        { label: 'Formula', value: `${v.comp} / ${v.att} × 100` },
        { label: 'NFL benchmark', value: pct > 67 ? 'Elite (>67%)' : pct > 63 ? 'Good (63-67%)' : pct > 58 ? 'Average' : 'Below average' },
      ]
}
  },
  description: 'Calculate quarterback completion percentage. The modern NFL average is around 64-65%, with elite quarterbacks completing over 67% of their passes.'
}

export default calcDef

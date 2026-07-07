import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    made: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    attempts: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0')
}),
  fields: [
    { name: 'made', label: 'Field Goals Made', type: 'number', min: 0, step: '1' },
    { name: 'attempts', label: 'Field Goals Attempted', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const pct = v.made / v.attempts * 100
    return {
      result: pct, label: 'Field Goal Percentage', unit: '%',
      steps: [
        { label: 'Made', value: `${v.made}` },
        { label: 'Attempted', value: `${v.attempts}` },
        { label: 'FG%', value: `${pct.toFixed(1)}%` },
        { label: 'Formula', value: `${v.made} / ${v.attempts} × 100` },
        { label: 'NBA average', value: pct > 47 ? 'Above NBA average (~47%)' : pct > 44 ? 'Around NBA average' : 'Below NBA average (~47%)' },
      ]
}
  },
  description: 'Calculate basketball field goal percentage (FG%). FG% is the ratio of field goals made to attempted and is a fundamental shooting efficiency metric in basketball.'
}

export default calcDef

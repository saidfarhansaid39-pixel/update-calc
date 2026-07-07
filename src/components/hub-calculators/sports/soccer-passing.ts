import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    successful: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
    totalPasses: z.string().min(1, 'Required').refine(v => { const val = parseFloat(v); return val > 0 }, 'Must be > 0')
}),
  fields: [
    { name: 'successful', label: 'Successful Passes', type: 'number', min: 0, step: '1' },
    { name: 'totalPasses', label: 'Total Passes Attempted', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const pct = v.successful / v.totalPasses * 100
    return {
      result: pct, label: 'Passing Accuracy', unit: '%',
      steps: [
        { label: 'Successful passes', value: `${v.successful}` },
        { label: 'Total attempts', value: `${v.totalPasses}` },
        { label: 'Pass accuracy', value: `${pct.toFixed(1)}%` },
        { label: 'Benchmark', value: pct > 85 ? 'Excellent (elite midfielder)' : pct > 78 ? 'Very Good' : pct > 70 ? 'Average' : 'Below average' },
      ]
}
  },
  description: 'Calculate soccer passing accuracy percentage. Top-tier midfielders typically maintain 85-90% pass completion rates in competitive matches.'
}

export default calcDef

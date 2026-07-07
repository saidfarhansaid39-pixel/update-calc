import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), time: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'time', label: 'Time Interval', type: 'number', unit: 's', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.force * v.time, label: 'Impulse', unit: 'N·s', steps: [{ label: 'Formula', value: 'J = FΔt' }, { label: 'Substitute', value: `${v.force} × ${v.time}` }, { label: 'Result', value: `${(v.force * v.time).toFixed(2)} N·s` }] }),
  description: 'Impulse equals force multiplied by time interval. It equals the change in momentum.',
  formula: 'J = F × Δt',
  interpretation: 'Impulse-momentum theorem: J = Δp. A larger impulse produces a greater change in momentum.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'length', label: 'Pendulum Length', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  compute: (v) => { const T = 2 * Math.PI * Math.sqrt(v.length / 9.81); const f = 1 / T; return { result: T, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(L/g)' }, { label: 'Length', value: `${v.length} m` }, { label: 'Period', value: `${T.toFixed(4)} s` }, { label: 'Frequency', value: `${f.toFixed(4)} Hz` }] } },
  description: 'A simple pendulum\'s period depends only on its length and gravitational acceleration for small amplitude oscillations.',
  formula: 'T = 2pisqrt(L/g)',
  interpretation: 'The period is independent of mass and amplitude (for small angles < 15°). A 1 m pendulum has a period of about 2.01 seconds on Earth.'
}

export default calcDef

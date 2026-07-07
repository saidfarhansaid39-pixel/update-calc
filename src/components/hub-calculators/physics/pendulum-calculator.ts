import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'length', label: 'Length', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  compute: (v) => { const T = 2 * Math.PI * Math.sqrt(v.length / 9.81); const f = 1 / T; return { result: T, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(L/g)' }, { label: 'g', value: '9.81 m/s^2' }, { label: 'Result', value: `${T.toFixed(4)} s` }, { label: 'Frequency', value: `${f.toFixed(4)} Hz` }] } },
  description: 'A simple pendulum\'s period depends only on its length and gravitational acceleration, not on mass or amplitude (for small angles).',
  formula: 'T = 2pisqrt(L/g)',
  interpretation: 'A 1 m pendulum has a period of ~2.01 s. Pendulum motion is approximately simple harmonic for small angles (<15°).'
}

export default calcDef

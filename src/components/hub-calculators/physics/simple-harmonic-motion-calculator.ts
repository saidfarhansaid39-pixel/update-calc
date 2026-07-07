import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), springConstant: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'springConstant', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }],
  compute: (v) => { const omega = Math.sqrt(v.springConstant / v.mass); const period = 2 * Math.PI / omega; const freq = 1 / period; return { result: period, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(m/k)' }, { label: 'Angular frequency', value: `${omega.toFixed(3)} rad/s` }, { label: 'Period', value: `${period.toFixed(4)} s` }, { label: 'Frequency', value: `${freq.toFixed(3)} Hz` }] } },
  description: 'Simple harmonic motion describes oscillatory motion where restoring force is proportional to displacement.',
  formula: 'T = 2pisqrt(m/k)',
  interpretation: 'The period depends only on mass and spring constant, not on amplitude. This is characteristic of simple harmonic motion.'
}

export default calcDef

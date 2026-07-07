import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), springConstant: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'springConstant', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }],
  compute: (v) => { const omega = Math.sqrt(v.springConstant / v.mass); const T = 2 * Math.PI / omega; const f = 1 / T; return { result: T, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(m/k)' }, { label: 'Angular frequency ω', value: `${omega.toFixed(3)} rad/s` }, { label: 'Period', value: `${T.toFixed(4)} s` }, { label: 'Frequency', value: `${f.toFixed(3)} Hz` }] } },
  description: 'A spring-mass system exhibits simple harmonic motion. The period depends only on mass and spring constant.',
  formula: 'T = 2pisqrt(m/k)',
  interpretation: 'The period is independent of amplitude for ideal springs. A stiffer spring (larger k) produces a shorter period.'
}

export default calcDef

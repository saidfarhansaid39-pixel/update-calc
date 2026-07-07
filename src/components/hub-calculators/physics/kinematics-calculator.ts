import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ u: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), a: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), t: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'u', label: 'Initial Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'a', label: 'Acceleration', type: 'number', unit: 'm/s^2', step: '0.1' }, { name: 't', label: 'Time', type: 'number', unit: 's', min: 0.01, step: '0.01' }],
  compute: (v) => { const vf = v.u + v.a * v.t; const d = v.u * v.t + 0.5 * v.a * v.t * v.t; return { result: vf, label: 'Final Velocity', unit: 'm/s', steps: [{ label: 'v = u + at', value: `${v.u} + ${v.a}×${v.t} = ${vf.toFixed(2)} m/s` }, { label: 'Displacement', value: `s = ut + ½at^2 = ${d.toFixed(2)} m` }] } },
  description: 'SUVAT equations describe motion with constant acceleration: v = u + at, s = ut + ½at^2.',
  formula: 'v = u + at, s = ut + ½at^2',
  interpretation: 'These equations apply only when acceleration is constant. They describe one-dimensional motion.'
}

export default calcDef

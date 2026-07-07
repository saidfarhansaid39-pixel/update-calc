import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ v0: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), a: z.string().min(1).refine(v => parseFloat(v) !== 0, '≠0'), t: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'v0', label: 'Initial Velocity v₀', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'a', label: 'Acceleration a', type: 'number', unit: 'm/s²', min: -100, step: '0.1' }, { name: 't', label: 'Time t', type: 'number', unit: 's', min: 0.1, step: '0.1' }],
  compute: (v) => { const vf = v.v0 + v.a * v.t; const d = v.v0 * v.t + 0.5 * v.a * v.t * v.t; return { result: d, label: 'Displacement Δx', unit: 'm', steps: [{ label: 'Formulas', value: 'v = v₀ + at, Δx = v₀t + ½at²' }, { label: 'Final velocity', value: `${vf.toFixed(2)} m/s` }, { label: 'Displacement', value: `${d.toFixed(2)} m` }] } },
  description: 'One-dimensional kinematics equations for constant acceleration. Solves for displacement and final velocity given initial velocity, acceleration, and time.',
  formula: 'v = v₀ + at, Δx = v₀t + ½at²',
  interpretation: 'The SUVAT equations of motion assuming constant acceleration. For free fall near Earth, a = g = 9.81 m/s² downward. Deceleration has negative a.'
}

export default calcDef

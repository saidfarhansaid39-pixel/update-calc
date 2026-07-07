import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ inertia: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), torsionConstant: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'inertia', label: 'Moment of Inertia', type: 'number', unit: 'kg·m^2', min: 0.001, step: '0.001' }, { name: 'torsionConstant', label: 'Torsion Constant', type: 'number', unit: 'N·m/rad', min: 0.001, step: '0.001' }],
  compute: (v) => { const T = 2 * Math.PI * Math.sqrt(v.inertia / v.torsionConstant); return { result: T, label: 'Period', unit: 's', steps: [{ label: 'Formula', value: 'T = 2pisqrt(I/κ)' }, { label: 'Substitute', value: `2pisqrt(${v.inertia}/${v.torsionConstant})` }, { label: 'Result', value: `${T.toFixed(4)} s` }] } },
  description: 'A torsion pendulum oscillates by twisting about its suspension axis. The restoring torque is proportional to the angular displacement.',
  formula: 'T = 2pisqrt(I/κ)',
  interpretation: 'κ is the torsion constant of the suspension fibre. The period is independent of amplitude, making torsion pendulums useful for precise timekeeping.'
}

export default calcDef

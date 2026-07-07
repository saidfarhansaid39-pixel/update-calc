import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }],
  compute: (v) => ({ result: v.mass * v.velocity, label: 'Momentum', unit: 'kg·m/s', steps: [{ label: 'Formula', value: 'p = mv' }, { label: 'Substitute', value: `${v.mass} × ${v.velocity}` }, { label: 'Result', value: `${(v.mass * v.velocity).toFixed(2)} kg·m/s` }] }),
  description: 'Momentum is the product of mass and velocity. It is a vector quantity conserved in isolated systems.',
  formula: 'p = mv',
  interpretation: 'Momentum is conserved in collisions. The total momentum before equals total momentum after an interaction in an isolated system.'
}

export default calcDef

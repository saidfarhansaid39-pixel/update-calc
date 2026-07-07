import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 0.001, step: '0.001' }, { name: 'radius', label: 'Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.mass * v.velocity * v.velocity / v.radius, label: 'Centripetal Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = mv^2/r' }, { label: 'Substitute', value: `${v.mass} × ${v.velocity}^2 / ${v.radius}` }, { label: 'Result', value: `${(v.mass * v.velocity * v.velocity / v.radius).toFixed(2)} N` }] }),
  description: 'Centripetal force is the inward force required to keep an object moving in a circular path.',
  formula: 'F = mv^2 / r',
  interpretation: 'Centripetal force is directed toward the center of the circle. It increases with mass and velocity squared and decreases with radius.'
}

export default calcDef

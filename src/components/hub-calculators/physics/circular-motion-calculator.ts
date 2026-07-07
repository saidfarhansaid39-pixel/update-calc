import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), radius: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 0.001, step: '0.001' }, { name: 'radius', label: 'Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.velocity * v.velocity / v.radius, label: 'Centripetal Acceleration', unit: 'm/s^2', steps: [{ label: 'Formula', value: 'a = v^2/r' }, { label: 'Substitute', value: `${v.velocity}^2 / ${v.radius}` }, { label: 'Result', value: `${(v.velocity * v.velocity / v.radius).toFixed(2)} m/s^2` }] }),
  description: 'Centripetal acceleration is the acceleration toward the center required to keep an object moving in a circle.',
  formula: 'a = v^2 / r',
  interpretation: 'Centripetal force F = mv^2/r is required for circular motion. Without it, objects move in straight lines.'
}

export default calcDef

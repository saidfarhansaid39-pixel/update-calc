import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: 0.5 * v.mass * v.velocity * v.velocity, label: 'Kinetic Energy', unit: 'J', steps: [{ label: 'Formula', value: 'KE = ½mv^2' }, { label: 'Square velocity', value: `${v.velocity}^2 = ${v.velocity * v.velocity}` }, { label: 'Substitute', value: `½ × ${v.mass} × ${v.velocity * v.velocity}` }, { label: 'Result', value: `${(0.5 * v.mass * v.velocity * v.velocity).toFixed(2)} J` }] }),
  description: 'Kinetic energy is the energy of motion. It equals half the mass times the velocity squared.',
  formula: 'KE = ½mv^2',
  interpretation: 'Kinetic energy is a scalar quantity measured in joules (J). Doubling velocity quadruples kinetic energy.'
}

export default calcDef

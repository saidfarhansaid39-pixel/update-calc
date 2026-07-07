import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'height', label: 'Height', type: 'number', unit: 'm', min: 0, step: '0.1' }],
  compute: (v) => ({ result: v.mass * 9.81 * v.height, label: 'Potential Energy', unit: 'J', steps: [{ label: 'Formula', value: 'PE = mgh' }, { label: 'g', value: '9.81 m/s^2' }, { label: 'Substitute', value: `${v.mass} × 9.81 × ${v.height}` }, { label: 'Result', value: `${(v.mass * 9.81 * v.height).toFixed(2)} J` }] }),
  description: 'Gravitational potential energy is the energy stored by an object due to its height above a reference point. PE = mgh.',
  formula: 'PE = mgh',
  interpretation: 'Potential energy depends on mass, gravitational acceleration (9.81 m/s^2 on Earth), and height. It converts to kinetic energy when the object falls.'
}

export default calcDef

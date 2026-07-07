import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Central Mass M', type: 'number', unit: 'kg', min: 1e20, step: '1e20' }, { name: 'distance', label: 'Distance r', type: 'number', unit: 'm', min: 1e6, step: '1e6' }],
  compute: (v) => { const G = 6.674e-11; const V = -G * v.mass / v.distance; return { result: V, label: 'Gravitational Potential', unit: 'J/kg', steps: [{ label: 'Formula', value: 'V = -GM/r' }, { label: 'G', value: '6.674×10⁻¹¹' }, { label: 'Result', value: `${V.toExponential(4)} J/kg` }] } },
  description: 'Gravitational potential is the gravitational potential energy per unit mass at a point in a gravitational field.',
  formula: 'V = -G·M / r',
  interpretation: 'Potential is negative and approaches zero at infinity. The difference in potential determines the work needed to move a mass between two points. Earth\'s surface potential is about -62.5 MJ/kg.'
}

export default calcDef

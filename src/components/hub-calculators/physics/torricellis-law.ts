import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'height', label: 'Fluid Height h', type: 'number', unit: 'm', min: 0.01, step: '0.01' }],
  compute: (v) => { const ve = Math.sqrt(2 * 9.81 * v.height); return { result: ve, label: 'Efflux Velocity', unit: 'm/s', steps: [{ label: 'Formula', value: 'v = √(2gh)' }, { label: 'g', value: '9.81 m/s²' }, { label: 'Result', value: `${ve.toFixed(2)} m/s (${(ve * 3.6).toFixed(1)} km/h)` }] } },
  description: 'Torricelli\'s Law: the exit speed of a fluid from a hole at depth h is the same as the speed of an object in free fall from height h. v = √(2gh).',
  formula: 'v = √(2gh)',
  interpretation: 'The efflux velocity depends only on the height of fluid above the hole, not on the fluid density. This follows from Bernoulli\'s equation and conservation of energy. At h = 1 m, v ≈ 4.43 m/s.'
}

export default calcDef

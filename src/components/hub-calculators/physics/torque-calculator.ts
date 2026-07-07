import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'distance', label: 'Lever Arm', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.force * v.distance, label: 'Torque', unit: 'N·m', steps: [{ label: 'Formula', value: 'τ = rF (θ = 90°)' }, { label: 'Substitute', value: `${v.distance} × ${v.force}` }, { label: 'Result', value: `${(v.force * v.distance).toFixed(2)} N·m` }] }),
  description: 'Torque is the rotational equivalent of force. It equals force times lever arm length at perpendicular application.',
  formula: 'τ = r × F',
  interpretation: 'Torque produces angular acceleration. A longer lever arm increases torque for the same applied force.'
}

export default calcDef

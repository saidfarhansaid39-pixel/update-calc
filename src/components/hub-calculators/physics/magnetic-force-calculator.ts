import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), field: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Charge', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 0.1, step: '0.1' }, { name: 'field', label: 'Magnetic Field', type: 'number', unit: 'T', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.charge * v.velocity * v.field, label: 'Magnetic Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = qvB (θ = 90°)' }, { label: 'Substitute', value: `${v.charge} × ${v.velocity} × ${v.field}` }, { label: 'Result', value: `${(v.charge * v.velocity * v.field).toExponential(4)} N` }] }),
  description: 'The Lorentz force on a moving charge in a magnetic field: F = qvBsin(θ). This calculator assumes θ = 90° for maximum force.',
  formula: 'F = qvBsin(θ)',
  interpretation: 'The magnetic force is perpendicular to both the velocity and magnetic field directions. It does no work on the particle.'
}

export default calcDef

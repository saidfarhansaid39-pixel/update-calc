import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ u: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), v: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), t: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'u', label: 'Initial Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'v', label: 'Final Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 't', label: 'Time', type: 'number', unit: 's', min: 0.01, step: '0.01' }],
  compute: (v) => ({ result: (v.u + v.v) * v.t / 2, label: 'Displacement', unit: 'm', steps: [{ label: 'Formula', value: 's = ½(u+v)t' }, { label: 'Substitute', value: `½(${v.u}+${v.v})×${v.t}` }, { label: 'Result', value: `${((v.u + v.v) * v.t / 2).toFixed(2)} m` }] }),
  description: 'One-dimensional kinematics using displacement calculated from initial and final velocities over time.',
  formula: 's = ½(u + v)t',
  interpretation: 'This SUVAT equation gives displacement when initial and final velocities and time are known, assuming constant acceleration.'
}

export default calcDef

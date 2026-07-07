import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'height', label: 'Height', type: 'number', unit: 'm', min: 0.1, step: '0.1' }],
  compute: (v) => { const t = Math.sqrt(2 * v.height / 9.81); const vf = 9.81 * t; return { result: t, label: 'Time to Impact', unit: 's', steps: [{ label: 'Formula', value: 't = sqrt(2h/g)' }, { label: 'Height', value: `${v.height} m` }, { label: 'Time', value: `${t.toFixed(3)} s` }, { label: 'Impact Velocity', value: `${vf.toFixed(2)} m/s` }] } },
  description: 'Free fall calculates the time to reach the ground from a given height, ignoring air resistance.',
  formula: 't = sqrt(2h/g), v = gt',
  interpretation: 'In free fall, all objects accelerate at 9.81 m/s^2 regardless of mass. Air resistance is ignored in this ideal model.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), angle: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 90 }, '0-90') }),
  fields: [{ name: 'velocity', label: 'Initial Velocity', type: 'number', unit: 'm/s', min: 0.1, step: '0.1' }, { name: 'angle', label: 'Launch Angle', type: 'number', unit: 'degrees', min: 1, max: 89, step: '1' }],
  compute: (v) => { const rad = v.angle * Math.PI / 180; const range = v.velocity * v.velocity * Math.sin(2 * rad) / 9.81; const maxH = (v.velocity * v.velocity * Math.sin(rad) * Math.sin(rad)) / (2 * 9.81); const time = 2 * v.velocity * Math.sin(rad) / 9.81; return { result: range, label: 'Range', unit: 'm', steps: [{ label: 'Range', value: `${range.toFixed(2)} m` }, { label: 'Max Height', value: `${maxH.toFixed(2)} m` }, { label: 'Time of Flight', value: `${time.toFixed(2)} s` }] } },
  description: 'Projectile motion describes the trajectory of an object launched at an angle under gravity, assuming no air resistance.',
  formula: 'R = v0^2sin(2θ)/g',
  interpretation: 'The range is maximized at a 45° launch angle. The trajectory is parabolic in ideal conditions.'
}

export default calcDef

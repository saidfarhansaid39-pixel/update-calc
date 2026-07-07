import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vx: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), vy: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), t: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'vx', label: 'Horizontal Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'vy', label: 'Vertical Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 't', label: 'Time', type: 'number', unit: 's', min: 0.01, step: '0.01' }],
  compute: (v) => { const rx = v.vx * v.t; const ry = v.vy * v.t - 0.5 * 9.81 * v.t * v.t; const r = Math.sqrt(rx * rx + ry * ry); return { result: r, label: 'Resultant Displacement', unit: 'm', steps: [{ label: 'Horiz. displacement', value: `${rx.toFixed(2)} m` }, { label: 'Vert. displacement', value: `${ry.toFixed(2)} m` }, { label: 'Resultant', value: `${r.toFixed(2)} m` }] } },
  description: 'Two-dimensional kinematics combining horizontal constant velocity with vertical constant acceleration (gravity).',
  formula: 'r = sqrt((vₓt)^2 + (vᵧt - ½gt^2)^2)',
  interpretation: 'In 2D projectile motion, horizontal and vertical components are independent. Gravity only affects vertical motion.'
}

export default calcDef

import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vx: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), vy: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), t: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'vx', label: 'Horizontal Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'vy', label: 'Vertical Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 't', label: 'Time', type: 'number', unit: 's', min: 0.01, step: '0.01' }],
  defaults: { velocity: '10', time: '5' },
  presets: [
    { label: 'Car braking (20 m/s → 0, 5 s)', values: { velocity: '20', time: '5' } },
    { label: 'Free fall 1 s', values: { time: '1' } },
    { label: 'High-speed train (50 m/s, 30 s)', values: { velocity: '50', time: '30' } },
  ],
  compute: (v) => { const rx = v.vx * v.t; const ry = v.vy * v.t - 0.5 * 9.81 * v.t * v.t; const r = Math.sqrt(rx * rx + ry * ry); return { result: r, label: 'Resultant Displacement', unit: 'm', steps: [{ label: 'Horiz. displacement', value: `${rx.toFixed(2)} m` }, { label: 'Vert. displacement', value: `${ry.toFixed(2)} m` }, { label: 'Resultant', value: `${r.toFixed(2)} m` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Kinematics equations describe all motion from subatomic particles to galaxies. Car safety systems use these for braking distance calculations.' },
        { label: 'Common Values', value: 'Walking speed: 1.4 m/s. Running speed: 3-6 m/s. Highway speed: 29 m/s (105 km/h). Free fall: 9.81 m/s².' },
        { label: 'Precision Tip', value: 'Define your coordinate system and sign conventions first. Velocity and acceleration can be negative depending on direction.' },
        { label: 'Related Formula', value: 'The four kinematic equations assume constant acceleration. For varying acceleration, use calculus: v = ∫a dt, s = ∫v dt.' },
        { label: 'Unit Conversion Note', value: 'Convert km/h to m/s: divide by 3.6. Convert mph to m/s: multiply by 0.447. 1 g = 9.81 m/s².' }
      ]} },
  description: 'Two-dimensional kinematics combining horizontal constant velocity with vertical constant acceleration (gravity).',
  formula: 'r = sqrt((vₓt)^2 + (vᵧt - ½gt^2)^2)',
  interpretation: 'In 2D projectile motion, horizontal and vertical components are independent. Gravity only affects vertical motion.'
}

export default calcDef

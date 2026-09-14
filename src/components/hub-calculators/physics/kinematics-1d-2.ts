import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ v0: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), a: z.string().min(1).refine(v => parseFloat(v) !== 0, '≠0'), t: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'v0', label: 'Initial Velocity v₀', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'a', label: 'Acceleration a', type: 'number', unit: 'm/s²', min: -100, step: '0.1' }, { name: 't', label: 'Time t', type: 'number', unit: 's', min: 0.1, step: '0.1' }],
  defaults: { velocity: '10', time: '5' },
  presets: [
    { label: 'Car braking (20 m/s → 0, 5 s)', values: { velocity: '20', time: '5' } },
    { label: 'Free fall 1 s', values: { time: '1' } },
    { label: 'High-speed train (50 m/s, 30 s)', values: { velocity: '50', time: '30' } },
  ],
  compute: (v) => { const vf = v.v0 + v.a * v.t; const d = v.v0 * v.t + 0.5 * v.a * v.t * v.t; return { result: d, label: 'Displacement Δx', unit: 'm', steps: [{ label: 'Formulas', value: 'v = v₀ + at, Δx = v₀t + ½at²' }, { label: 'Final velocity', value: `${vf.toFixed(2)} m/s` }, { label: 'Displacement', value: `${d.toFixed(2)} m` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Kinematics equations describe all motion from subatomic particles to galaxies. Car safety systems use these for braking distance calculations.' },
        { label: 'Common Values', value: 'Walking speed: 1.4 m/s. Running speed: 3-6 m/s. Highway speed: 29 m/s (105 km/h). Free fall: 9.81 m/s².' },
        { label: 'Precision Tip', value: 'Define your coordinate system and sign conventions first. Velocity and acceleration can be negative depending on direction.' },
        { label: 'Related Formula', value: 'The four kinematic equations assume constant acceleration. For varying acceleration, use calculus: v = ∫a dt, s = ∫v dt.' },
        { label: 'Unit Conversion Note', value: 'Convert km/h to m/s: divide by 3.6. Convert mph to m/s: multiply by 0.447. 1 g = 9.81 m/s².' }
      ]} },
  description: 'One-dimensional kinematics equations for constant acceleration. Solves for displacement and final velocity given initial velocity, acceleration, and time.',
  formula: 'v = v₀ + at, Δx = v₀t + ½at²',
  interpretation: 'The SUVAT equations of motion assuming constant acceleration. For free fall near Earth, a = g = 9.81 m/s² downward. Deceleration has negative a.'
}

export default calcDef

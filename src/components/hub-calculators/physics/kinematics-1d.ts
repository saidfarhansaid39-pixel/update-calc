import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ u: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), v: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), t: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'u', label: 'Initial Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 'v', label: 'Final Velocity', type: 'number', unit: 'm/s', min: 0, step: '0.1' }, { name: 't', label: 'Time', type: 'number', unit: 's', min: 0.01, step: '0.01' }],
  defaults: { u: '0', v: '20', t: '5' },
  presets: [
    { label: 'Car braking (20 m/s → 0, 5 s)', values: { u: '20', v: '0', t: '5' } },
    { label: 'Free fall 1 s', values: { time: '1' } },
    { label: 'High-speed train (50 m/s, 30 s)', values: { velocity: '50', time: '30' } },
  ],
  compute: (v) => ({ result: (v.u + v.v) * v.t / 2, label: 'Displacement', unit: 'm', steps: [{ label: 'Formula', value: 's = ½(u+v)t' }, { label: 'Substitute', value: `½(${v.u}+${v.v})×${v.t}` }, { label: 'Result', value: `${((v.u + v.v) * v.t / 2).toFixed(2)} m` }],
      extras: [
        { label: 'Real-World Application', value: 'Kinematics equations describe all motion from subatomic particles to galaxies. Car safety systems use these for braking distance calculations.' },
        { label: 'Common Values', value: 'Walking speed: 1.4 m/s. Running speed: 3-6 m/s. Highway speed: 29 m/s (105 km/h). Free fall: 9.81 m/s².' },
        { label: 'Precision Tip', value: 'Define your coordinate system and sign conventions first. Velocity and acceleration can be negative depending on direction.' },
        { label: 'Related Formula', value: 'The four kinematic equations assume constant acceleration. For varying acceleration, use calculus: v = ∫a dt, s = ∫v dt.' },
        { label: 'Unit Conversion Note', value: 'Convert km/h to m/s: divide by 3.6. Convert mph to m/s: multiply by 0.447. 1 g = 9.81 m/s².' }
      ] }),
  description: 'One-dimensional kinematics using displacement calculated from initial and final velocities over time.',
  formula: 's = ½(u + v)t',
  interpretation: 'This SUVAT equation gives displacement when initial and final velocities and time are known, assuming constant acceleration.'
}

export default calcDef

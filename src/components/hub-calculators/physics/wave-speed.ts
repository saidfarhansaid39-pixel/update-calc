import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ frequency: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'frequency', label: 'Frequency', type: 'number', unit: 'Hz', min: 0.001, step: '0.001' }, { name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { u: '0', v: '20', t: '5' },
  presets: [
    { label: 'Car braking (20 m/s → 0, 5 s)', values: { u: '20', v: '0', t: '5' } },
    { label: 'Free fall 1 s', values: { u: '0', a: '9.81', t: '1' } },
    { label: 'High-speed train (50 m/s, 30 s)', values: { u: '0', a: '1.667', t: '30' } },
  ],
  compute: (v) => ({ result: v.frequency * v.wavelength, label: 'Wave Speed', unit: 'm/s', steps: [{ label: 'Formula', value: 'v = fλ' }, { label: 'Substitute', value: `${v.frequency} × ${v.wavelength}` }, { label: 'Result', value: `${(v.frequency * v.wavelength).toFixed(3)} m/s` }],
      extras: [
        { label: 'Real-World Application', value: 'Kinematics equations describe all motion from subatomic particles to galaxies. Car safety systems use these for braking distance calculations.' },
        { label: 'Common Values', value: 'Walking speed: 1.4 m/s. Running speed: 3-6 m/s. Highway speed: 29 m/s (105 km/h). Free fall: 9.81 m/s².' },
        { label: 'Precision Tip', value: 'Define your coordinate system and sign conventions first. Velocity and acceleration can be negative depending on direction.' },
        { label: 'Related Formula', value: 'The four kinematic equations assume constant acceleration. For varying acceleration, use calculus: v = ∫a dt, s = ∫v dt.' },
        { label: 'Unit Conversion Note', value: 'Convert km/h to m/s: divide by 3.6. Convert mph to m/s: multiply by 0.447. 1 g = 9.81 m/s².' }
      ] }),
  description: 'Wave speed equals frequency times wavelength for all types of waves, including sound, light, and water waves.',
  formula: 'v = f × λ',
  interpretation: 'In a given medium, wave speed is constant. Increasing frequency decreases wavelength proportionally. For sound in air at 20°C, v ≈ 343 m/s.'
}

export default calcDef

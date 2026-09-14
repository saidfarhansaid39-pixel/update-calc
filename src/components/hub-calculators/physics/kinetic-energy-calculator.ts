import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'velocity', label: 'Velocity', type: 'number', unit: 'm/s', min: 0.001, step: '0.001' }],
  defaults: { mass: '70', velocity: '10' },
  presets: [
    { label: 'Running person (70 kg, 5 m/s)', values: { mass: '70', velocity: '5' } },
    { label: 'Car (1500 kg, 27 m/s)', values: { mass: '1500', velocity: '27' } },
    { label: 'Baseball pitch (0.145 kg, 40 m/s)', values: { mass: '0.145', velocity: '40' } },
  ],
  compute: (v) => ({ result: 0.5 * v.mass * v.velocity * v.velocity, label: 'Kinetic Energy', unit: 'J', steps: [{ label: 'Formula', value: 'KE = ½mv^2' }, { label: 'Square velocity', value: `${v.velocity}^2 = ${v.velocity * v.velocity}` }, { label: 'Substitute', value: `½ × ${v.mass} × ${v.velocity * v.velocity}` }, { label: 'Result', value: `${(0.5 * v.mass * v.velocity * v.velocity).toFixed(2)} J` }],
      extras: [
        { label: 'Real-World Application', value: 'Kinetic energy determines stopping distances, impact forces, and energy efficiency. A car at 100 km/h has 4× the KE of one at 50 km/h.' },
        { label: 'Common Values', value: 'Walking: ~245 J (70 kg, 1.4 m/s). Car at 100 km/h: ~579 kJ. Rifle bullet: ~1.3 kJ. 1 kcal (food) = 4184 J.' },
        { label: 'Precision Tip', value: 'KE scales with v² — doubling speed quadruples energy. This is why highway speeds dramatically increase crash severity.' },
        { label: 'Related Formula', value: 'Work-energy theorem: W = ΔKE. Also related to momentum (p = mv): KE = p²/2m.' },
        { label: 'Unit Conversion Note', value: '1 J = 1 kg·m²/s². 1 cal = 4.184 J. 1 kWh = 3.6 MJ. Convert mph to m/s: multiply by 0.447.' }
      ] }),
  description: 'Kinetic energy is the energy of motion. It equals half the mass times the velocity squared.',
  formula: 'KE = ½mv^2',
  interpretation: 'Kinetic energy is a scalar quantity measured in joules (J). Doubling velocity quadruples kinetic energy.'
}

export default calcDef

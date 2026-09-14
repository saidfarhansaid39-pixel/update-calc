import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accel: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'accel', label: 'Acceleration', type: 'number', unit: 'm/s^2', min: 0.001, step: '0.001' }],
  defaults: { mass: '70', accel: '9.81' },
  presets: [
    { label: 'Car (1500 kg, 3 m/s²)', values: { mass: '1500', accel: '3' } },
    { label: 'Bicycle (80 kg, 0.5 m/s²)', values: { mass: '80', accel: '0.5' } },
    { label: 'Baseball (0.145 kg, 100 m/s²)', values: { mass: '0.145', accel: '100' } },
  ],
  compute: (v) => ({ result: v.mass * v.accel, label: 'Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = ma' }, { label: 'Substitute', value: `${v.mass} × ${v.accel}` }, { label: 'Result', value: `${(v.mass * v.accel).toFixed(3)} N` }],
      extras: [
        { label: 'Real-World Application', value: 'Newton\'s second law governs everything from vehicle acceleration to rocket launches. A 1500 kg car accelerating at 3 m/s² needs 4500 N of net force.' },
        { label: 'Precision Tip', value: 'Use net force (sum of all forces) for accurate results. Friction, drag, and other opposing forces reduce net acceleration.' },
        { label: 'Common Values', value: 'g = 9.81 m/s² (Earth gravity). Typical car acceleration: 2-4 m/s². Sports car: 5-8 m/s².' },
        { label: 'Related Formula', value: 'F = ma relates to impulse (FΔt = mΔv), work (W = Fd), and weight (W = mg). All derive from Newton\'s laws.' },
        { label: 'Unit Conversion Note', value: '1 N = 1 kg·m/s². Convert lbf to N: multiply by 4.448. Convert kgf to N: multiply by 9.807.' }
      ] }),
  description: 'Newton\'s Second Law: Force equals mass times acceleration. This calculator computes force given mass and acceleration.',
  formula: 'F = m × a',
  interpretation: 'The resulting force in newtons (N) is the product of mass in kilograms and acceleration in meters per second squared. 1 N = 1 kg·m/s^2.'
}

export default calcDef

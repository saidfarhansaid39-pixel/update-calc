import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }],
  defaults: { force: '100', mass: '10' },
  presets: [
    { label: 'Car (1500 kg, 3 m/s²)', values: { force: '4500', mass: '1500' } },
    { label: 'Bicycle (80 kg, 0.5 m/s²)', values: { force: '40', mass: '80' } },
    { label: 'Baseball (0.145 kg, 100 m/s²)', values: { force: '14.5', mass: '0.145' } },
  ],
  compute: (v) => ({ result: v.force / v.mass, label: 'Acceleration', unit: 'm/s^2', steps: [{ label: 'Formula', value: 'a = F/m' }, { label: 'Substitute', value: `${v.force} / ${v.mass}` }, { label: 'Result', value: `${(v.force / v.mass).toFixed(3)} m/s^2` }],
      extras: [
        { label: 'Real-World Application', value: 'Newton\'s second law governs everything from vehicle acceleration to rocket launches. A 1500 kg car accelerating at 3 m/s² needs 4500 N of net force.' },
        { label: 'Precision Tip', value: 'Use net force (sum of all forces) for accurate results. Friction, drag, and other opposing forces reduce net acceleration.' },
        { label: 'Common Values', value: 'g = 9.81 m/s² (Earth gravity). Typical car acceleration: 2-4 m/s². Sports car: 5-8 m/s².' },
        { label: 'Related Formula', value: 'F = ma relates to impulse (FΔt = mΔv), work (W = Fd), and weight (W = mg). All derive from Newton\'s laws.' },
        { label: 'Unit Conversion Note', value: '1 N = 1 kg·m/s². Convert lbf to N: multiply by 4.448. Convert kgf to N: multiply by 9.807.' }
      ] }),
  description: 'Calculate acceleration from net force and mass using Newton\'s Second Law: a = F/m.',
  formula: 'a = F / m',
  interpretation: 'Acceleration is the rate of change of velocity. A net force of 1 N acting on a 1 kg mass produces an acceleration of 1 m/s^2.'
}

export default calcDef

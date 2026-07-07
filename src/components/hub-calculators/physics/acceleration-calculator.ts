import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.force / v.mass, label: 'Acceleration', unit: 'm/s^2', steps: [{ label: 'Formula', value: 'a = F/m' }, { label: 'Substitute', value: `${v.force} / ${v.mass}` }, { label: 'Result', value: `${(v.force / v.mass).toFixed(3)} m/s^2` }] }),
  description: 'Calculate acceleration from net force and mass using Newton\'s Second Law: a = F/m.',
  formula: 'a = F / m',
  interpretation: 'Acceleration is the rate of change of velocity. A net force of 1 N acting on a 1 kg mass produces an acceleration of 1 m/s^2.'
}

export default calcDef

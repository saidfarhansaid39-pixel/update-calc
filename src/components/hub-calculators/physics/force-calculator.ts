import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accel: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'accel', label: 'Acceleration', type: 'number', unit: 'm/s^2', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.mass * v.accel, label: 'Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = ma' }, { label: 'Substitute', value: `${v.mass} × ${v.accel}` }, { label: 'Result', value: `${(v.mass * v.accel).toFixed(3)} N` }] }),
  description: 'Newton\'s Second Law: Force equals mass times acceleration. This calculator computes force given mass and acceleration.',
  formula: 'F = m × a',
  interpretation: 'The resulting force in newtons (N) is the product of mass in kilograms and acceleration in meters per second squared. 1 N = 1 kg·m/s^2.'
}

export default calcDef

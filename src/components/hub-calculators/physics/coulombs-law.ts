import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ q1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), q2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), r: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'q1', label: 'Charge 1', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'q2', label: 'Charge 2', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'r', label: 'Separation Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const k = 8.988e9; const F = k * v.q1 * v.q2 / (v.r * v.r); return { result: F, label: 'Electrostatic Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = k·q1q2/r^2' }, { label: 'k = 8.988×10⁹', value: '' }, { label: 'Result', value: `${F.toExponential(4)} N` }] } },
  description: 'Coulomb\'s Law gives the electrostatic force between two point charges. Like charges repel, opposite charges attract.',
  formula: 'F = k·|q1q2| / r^2',
  interpretation: 'k = 8.988×10⁹ N·m^2/C^2. The force is inversely proportional to the square of distance. This is analogous to Newton\'s law of gravitation but for electric charges.'
}

export default calcDef

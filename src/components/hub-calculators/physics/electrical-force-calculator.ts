import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), charge2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge1', label: 'Charge 1', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'charge2', label: 'Charge 2', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const k = 8.988e9; const f = k * v.charge1 * v.charge2 / (v.distance * v.distance); return { result: f, label: 'Electrostatic Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = k·q1q2/r^2' }, { label: 'Substitute', value: `${f.toExponential(4)} N` }, { label: 'Result', value: `${f.toExponential(4)} N` }] } },
  description: 'Coulomb\'s Law: the electrostatic force between two charges is proportional to the product of charges and inversely proportional to the square of distance.',
  formula: 'F = k·q1q2/r^2',
  interpretation: 'k = 8.988×10⁹ N·m^2/C^2. Like charges repel, opposite charges attract. The force is analogous to gravity but much stronger.'
}

export default calcDef

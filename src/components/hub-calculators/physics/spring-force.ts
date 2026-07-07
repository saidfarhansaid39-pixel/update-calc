import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ springConstant: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), displacement: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'springConstant', label: 'Spring Constant', type: 'number', unit: 'N/m', min: 0.01, step: '0.01' }, { name: 'displacement', label: 'Displacement from Equilibrium', type: 'number', unit: 'm', min: 0, step: '0.01' }],
  compute: (v) => ({ result: v.springConstant * v.displacement, label: 'Spring Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = kx (Hooke\'s Law)' }, { label: 'Substitute', value: `${v.springConstant} × ${v.displacement}` }, { label: 'Result', value: `${(v.springConstant * v.displacement).toFixed(2)} N` }] }),
  description: 'Hooke\'s Law states the force exerted by a spring is proportional to its displacement from equilibrium.',
  formula: 'F = kx',
  interpretation: 'The negative sign (F = -kx) indicates the force opposes displacement. A stiffer spring (higher k) produces greater restoring force for the same displacement.'
}

export default calcDef

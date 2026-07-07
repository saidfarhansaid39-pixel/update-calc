import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ load: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ropes: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10') }),
  fields: [{ name: 'load', label: 'Load Weight', type: 'number', unit: 'N', min: 1, step: '1' }, { name: 'ropes', label: 'Number of Ropes', type: 'number', unit: '', min: 1, max: 10, step: '1' }],
  compute: (v) => ({ result: v.load / v.ropes, label: 'Required Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = Load/MA' }, { label: 'Ropes', value: `${v.ropes} (mechanical advantage = ${v.ropes})` }, { label: 'Result', value: `${(v.load / v.ropes).toFixed(1)} N` }] }),
  description: 'A pulley system provides mechanical advantage equal to the number of supporting rope segments.',
  formula: 'MA = n, F = Load / n',
  interpretation: 'Each supporting rope reduces the required force by a factor equal to the number of ropes. Friction reduces actual mechanical advantage.'
}

export default calcDef

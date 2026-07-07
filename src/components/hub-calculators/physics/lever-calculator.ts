import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ effortDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), loadDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), load: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'effortDist', label: 'Effort Arm Distance', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'loadDist', label: 'Load Arm Distance', type: 'number', unit: 'm', min: 0.01, step: '0.01' }, { name: 'load', label: 'Load Force', type: 'number', unit: 'N', min: 0.1, step: '0.1' }],
  compute: (v) => ({ result: v.load * v.loadDist / v.effortDist, label: 'Effort Force', unit: 'N', steps: [{ label: 'Formula', value: 'Fₑ·dₑ = Fₗ·dₗ' }, { label: 'MA', value: `${(v.effortDist / v.loadDist).toFixed(2)}×` }, { label: 'Result', value: `${(v.load * v.loadDist / v.effortDist).toFixed(2)} N` }] }),
  description: 'A lever amplifies force by rotating about a fulcrum. Mechanical advantage is the ratio of effort arm to load arm.',
  formula: 'F1d1 = F2d2 (torque balance)',
  interpretation: 'A longer effort arm relative to load arm gives greater mechanical advantage. Class 1 levers have the fulcrum between force and load.'
}

export default calcDef

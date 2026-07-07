import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ normal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), coeff: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'normal', label: 'Normal Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'coeff', label: 'Friction Coefficient', type: 'number', unit: '', min: 0, step: '0.01' }],
  compute: (v) => ({ result: v.normal * v.coeff, label: 'Friction Force', unit: 'N', steps: [{ label: 'Formula', value: 'f = μN' }, { label: 'Substitute', value: `${v.coeff} × ${v.normal}` }, { label: 'Result', value: `${(v.normal * v.coeff).toFixed(3)} N` }] }),
  description: 'Friction force equals the coefficient of friction multiplied by the normal force between two surfaces.',
  formula: 'f = μ × N',
  interpretation: 'Static friction (μs) prevents motion from starting; kinetic friction (μk) opposes ongoing motion. μk is typically less than μs.'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ n1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'n1', label: 'Denser Medium Index', type: 'number', unit: '', min: 1, step: '0.01' }, { name: 'n2', label: 'Less Dense Medium Index', type: 'number', unit: '', min: 1, step: '0.01' }],
  compute: (v) => { const crit = v.n1 > v.n2 ? Math.asin(v.n2 / v.n1) * 180 / Math.PI : 90; return { result: crit, label: 'Critical Angle', unit: 'degrees', steps: [{ label: 'Formula', value: 'θ_c = arcsin(n₂/n₁)' }, { label: 'Result', value: `${crit.toFixed(2)}°` }, { label: 'Condition', value: v.n1 > v.n2 ? 'Total internal reflection possible' : 'No total internal reflection (n₁ ≤ n₂)' }] } },
  description: 'The critical angle is the angle of incidence beyond which light is entirely reflected within the denser medium (total internal reflection).',
  formula: 'θ_c = arcsin(n₂/n₁), n₁ > n₂',
  interpretation: 'Total internal reflection requires n₁ > n₂. Fiber optics relies on TIR to guide light. Water-air critical angle is ~48.6°. Diamond-air critical angle is ~24.4° (causing sparkle).'
}

export default calcDef

import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ m1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), m2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), r: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'm1', label: 'Mass 1', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'm2', label: 'Mass 2', type: 'number', unit: 'kg', min: 0.001, step: '0.001' }, { name: 'r', label: 'Separation Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  compute: (v) => { const G = 6.674e-11; const F = G * v.m1 * v.m2 / (v.r * v.r); return { result: F, label: 'Gravitational Force', unit: 'N', steps: [{ label: 'Formula', value: 'F = Gm₁m₂/r²' }, { label: 'G', value: '6.674×10⁻¹¹ N·m²/kg²' }, { label: 'Result', value: `${F.toExponential(4)} N` }] } },
  description: 'Newton\'s Law of Universal Gravitation: every mass attracts every other mass with a force proportional to the product of masses and inversely proportional to the square of distance.',
  formula: 'F = G·m₁·m₂ / r²',
  interpretation: 'G = 6.674×10⁻¹¹ N·m²/kg². Gravity is the weakest fundamental force but dominates at astronomical scales. Two 1 kg masses 1 m apart experience only 6.67×10⁻¹¹ N of force.'
}

export default calcDef

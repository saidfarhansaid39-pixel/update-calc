import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    p1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    t1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    p2: z.string().optional(),
    v2: z.string().optional(),
    t2: z.string().optional()
}),
  fields: [
    { name: 'p1', label: 'Initial Pressure P₁', type: 'number', unit: 'atm', min: 0.001, step: '0.001' },
    { name: 'v1', label: 'Initial Volume V₁', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
    { name: 't1', label: 'Initial Temperature T₁', type: 'number', unit: 'K', min: 1, step: '1' },
  ],
  compute: (v) => {
    const ratio = v.p1 * v.v1 / v.t1
    return {
      result: ratio, label: 'P₁V₁/T₁', unit: 'atm·L/K',
      steps: [
        { label: 'P₁V₁/T₁', value: `${v.p1} × ${v.v1} / ${v.t1} = ${ratio.toFixed(4)}` },
        { label: 'P₂V₂/T₂', value: `= ${ratio.toFixed(4)} (constant for fixed n)` },
        { label: 'Combined Gas Law', value: 'P₁V₁/T₁ = P₂V₂/T₂' },
      ]
}
  },
  description: 'The Combined Gas Law combines Boyle\'s, Charles\'s, and Gay-Lussac\'s laws into one equation for a fixed amount of gas.',
  formula: 'P₁V₁/T₁ = P₂V₂/T₂',
  interpretation: 'When any two of P, V, or T change, the third adjusts to keep P₁V₁/T₁ constant. If T is constant, it reduces to Boyle\'s law. If P is constant, it reduces to Charles\'s law.'
}

export default calcDef

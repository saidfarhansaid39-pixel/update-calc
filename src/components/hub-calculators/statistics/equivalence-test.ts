import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ est: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), se: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), margin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'est', label: 'Estimated Difference', type: 'number', step: 'any' }, { name: 'se', label: 'Standard Error', type: 'number', min: 0.001, step: 'any' }, { name: 'margin', label: 'Equivalence Margin (Δ)', type: 'number', min: 0.001, step: '0.01' }],
  compute: (v) => { const est = n(v.est); const se = n(v.se); const margin = n(v.margin); const t1 = (est + margin) / se; const t2 = (est - margin) / se; const p1 = 1 - (t1 > 0 ? 0.5 - 0.5 * Math.exp(-0.717 * t1 - 0.416 * t1 * t1) : 1 - (0.5 - 0.5 * Math.exp(-0.717 * (-t1) - 0.416 * (-t1) * (-t1)))); const p2 = t2 > 0 ? 0.5 - 0.5 * Math.exp(-0.717 * t2 - 0.416 * t2 * t2) : 1 - (0.5 - 0.5 * Math.exp(-0.717 * (-t2) - 0.416 * (-t2) * (-t2))); const pMax = Math.max(p1, Math.min(p2, 1)); return { result: pMax, label: 'Max p-value (TOST)', unit: '', steps: [{ label: 'Lower bound test t', value: `${t1.toFixed(4)}` }, { label: 'Upper bound test t', value: `${t2.toFixed(4)}` }, { label: 'Max p', value: `${pMax.toExponential(4)}` }, { label: 'Conclusion', value: pMax < 0.05 ? 'Equivalence concluded' : 'Cannot conclude equivalence' }] } },
  description: 'Equivalence test uses two one-sided tests (TOST) to determine if a treatment is equivalent to a reference within a margin Δ.',
  formula: 'H₀: |θ| ≥ Δ vs H₁: |θ| < Δ. Two t-tests at margins -Δ and +Δ.',
  interpretation: 'If the 90% CI of the difference falls within [-Δ, Δ], equivalence is concluded at α = 0.05.'
}

export default calcDef

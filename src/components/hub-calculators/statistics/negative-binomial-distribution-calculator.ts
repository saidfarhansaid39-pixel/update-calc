import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ r: z.string().min(1).refine(v => parseInt(v) >= 1, '>=1'), prob: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), k: z.string().min(1).refine(v => parseInt(v) >= 0, '>=0') }),
  fields: [{ name: 'r', label: 'Number of Successes (r)', type: 'number', min: 1, step: '1' }, { name: 'prob', label: 'Success Probability (p)', type: 'number', min: 0.001, max: 0.999, step: '0.01' }, { name: 'k', label: 'Total Trials (k)', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const r = Math.round(n(v.r)); const p = n(v.prob); const k = Math.round(n(v.k)); const comb = (n: number, k: number) => { if (k < 0 || k > n) return 0; let c = 1; for (let i = 1; i <= k; i++) c = c * (n - i + 1) / i; return c }; const prob = comb(k - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, k - r); return { result: prob, label: 'P(X = k)', unit: '', steps: [{ label: 'Formula', value: 'P(X=k) = C(k-1,r-1)·p^r·(1-p)^(k-r)' }, { label: 'Probability', value: `${prob.toExponential(4)}` }] } },
  description: 'The negative binomial distribution models the number of trials needed to achieve a specified number of successes.',
  formula: 'P(X = k) = C(k-1, r-1) × p^r × (1-p)^(k-r)',
  interpretation: 'When r = 1, the negative binomial reduces to the geometric distribution.'
}

export default calcDef

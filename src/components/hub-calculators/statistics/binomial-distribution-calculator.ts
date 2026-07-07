import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trials: z.string().min(1).refine(v => { const n = parseInt(v); return n > 0 && n <= 1000 }, '1-1000'), prob: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), successes: z.string().min(1).refine(v => parseInt(v) >= 0, '>=0') }),
  fields: [{ name: 'trials', label: 'Number of Trials (n)', type: 'number', min: 1, max: 1000, step: '1' }, { name: 'prob', label: 'Success Probability (p)', type: 'number', min: 0.001, max: 0.999, step: '0.01' }, { name: 'successes', label: 'Number of Successes (k)', type: 'number', min: 0, step: '1' }],
     compute: (v) => { const trials = Math.round(n(v.trials)); const probVal = n(v.prob); const k = Math.round(n(v.successes)); const comb = (nVal: number, kVal: number) => { if (kVal < 0 || kVal > nVal) return 0; let r = 1; for (let i = 1; i <= kVal; i++) r = r * (nVal - i + 1) / i; return r }; const prob = comb(trials, k) * Math.pow(probVal, k) * Math.pow(1 - probVal, trials - k); return { result: prob, label: 'P(X = k)', unit: '', steps: [{ label: 'Formula', value: 'P(X=k) = C(n,k)·p^k·(1-p)^(n-k)' }, { label: 'Combinations', value: `C(${trials},${k}) = ${comb(trials, k)}` }, { label: 'Probability', value: `${prob.toExponential(4)}` }] } },
  description: 'The binomial distribution models the number of successes in n independent Bernoulli trials with constant success probability p.',
  formula: 'P(X = k) = C(n,k) × p^k × (1-p)^(n-k)',
  interpretation: 'Mean = np, Variance = np(1-p). The binomial approaches normal for large n.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ N: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), K: z.string().min(1).refine(v => parseInt(v) >= 0, '>=0'), n: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), k: z.string().min(1).refine(v => parseInt(v) >= 0, '>=0') }),
  fields: [{ name: 'N', label: 'Population Size (N)', type: 'number', min: 1, step: '1' }, { name: 'K', label: 'Successes in Population (K)', type: 'number', min: 0, step: '1' }, { name: 'n', label: 'Sample Size (n)', type: 'number', min: 1, step: '1' }, { name: 'k', label: 'Observed Successes (k)', type: 'number', min: 0, step: '1' }],
  compute: (v) => { const N = Math.round(n(v.N)); const K = Math.round(n(v.K)); const samp = Math.round(n(v.n)); const k = Math.round(n(v.k)); const comb = (n: number, k: number) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - i + 1) / i; return r }; const prob = comb(K, k) * comb(N - K, samp - k) / comb(N, samp); return { result: prob, label: 'P(X = k)', unit: '', steps: [{ label: 'Formula', value: 'P(X=k) = C(K,k)·C(N-K,n-k)/C(N,n)' }, { label: 'Probability', value: `${prob.toExponential(4)}` }] } },
  description: 'The hypergeometric distribution models sampling without replacement from a finite population with two types.',
  formula: 'P(X = k) = C(K,k) × C(N-K, n-k) / C(N,n)',
  interpretation: 'Unlike the binomial, trials are dependent (without replacement). Used in quality control and card games.'
}

export default calcDef

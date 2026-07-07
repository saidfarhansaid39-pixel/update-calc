import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ prob: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), k: z.string().min(1).refine(v => parseInt(v) >= 1, '>=1') }),
  fields: [{ name: 'prob', label: 'Success Probability (p)', type: 'number', min: 0.001, max: 0.999, step: '0.01' }, { name: 'k', label: 'Trial of First Success (k)', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const p = n(v.prob); const k = Math.round(n(v.k)); const prob = Math.pow(1 - p, k - 1) * p; const mean = 1 / p; return { result: prob, label: 'P(X = k)', unit: '', steps: [{ label: 'Formula', value: 'P(X=k) = (1-p)^(k-1)·p' }, { label: 'Probability', value: `${prob.toExponential(4)}` }, { label: 'Mean', value: `${mean.toFixed(4)}` }] } },
  description: 'The geometric distribution models the number of trials until the first success in independent Bernoulli trials.',
  formula: 'P(X = k) = (1-p)^(k-1) × p',
  interpretation: 'Mean = 1/p. The geometric is memoryless: the probability of success on the next trial is always p.'
}

export default calcDef

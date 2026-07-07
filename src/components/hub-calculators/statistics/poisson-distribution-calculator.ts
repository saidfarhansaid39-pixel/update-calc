import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ lambda: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), k: z.string().min(1).refine(v => parseInt(v) >= 0, '>=0') }),
  fields: [{ name: 'lambda', label: 'Rate (λ)', type: 'number', min: 0.001, step: '0.1' }, { name: 'k', label: 'Events (k)', type: 'number', min: 0, step: '1' }],
  compute: (v) => { const lambda = n(v.lambda); const k = Math.round(n(v.k)); let fact = 1; for (let i = 2; i <= k; i++) fact *= i; const prob = Math.exp(-lambda) * Math.pow(lambda, k) / fact; return { result: prob, label: 'P(X = k)', unit: '', steps: [{ label: 'Formula', value: 'P(X=k) = e^(-λ)·λ^k/k!' }, { label: 'Probability', value: `${prob.toExponential(4)}` }] } },
  description: 'The Poisson distribution models the number of events occurring in a fixed interval when events occur independently at a constant average rate.',
  formula: 'P(X = k) = e^(-λ) · λ^k / k!',
  interpretation: 'Mean = λ, Variance = λ. Used for rare events, queueing theory, and radioactive decay.'
}

export default calcDef

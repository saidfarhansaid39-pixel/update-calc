import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ prior: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), likelihood: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), evidence: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1') }),
  fields: [{ name: 'prior', label: 'Prior P(H)', type: 'number', min: 0.001, max: 0.999, step: '0.01' }, { name: 'likelihood', label: 'Likelihood P(E|H)', type: 'number', min: 0.001, max: 0.999, step: '0.01' }, { name: 'evidence', label: 'Evidence P(E)', type: 'number', min: 0.001, max: 0.999, step: '0.01' }],
  compute: (v) => { const posterior = n(v.prior) * n(v.likelihood) / n(v.evidence); const priorOdds = n(v.prior) / (1 - n(v.prior)); const postOdds = posterior / (1 - posterior); const bf = priorOdds > 0 ? postOdds / priorOdds : 0; return { result: posterior, label: 'Posterior P(H|E)', unit: '', steps: [{ label: 'Bayes Theorem', value: 'P(H|E) = P(E|H)·P(H)/P(E)' }, { label: 'Posterior', value: `${posterior.toExponential(4)}` }, { label: 'Bayes Factor', value: `${bf.toExponential(4)}` }] } },
  description: 'Bayes\' Theorem updates the probability of a hypothesis based on new evidence. P(H|E) = P(E|H)P(H)/P(E).',
  formula: 'P(H|E) = P(E|H) × P(H) / P(E)',
  interpretation: 'The posterior probability combines prior beliefs with observed evidence. Bayes Factor > 3 indicates substantial evidence for H.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ prior: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), posterior: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1') }),
  fields: [{ name: 'prior', label: 'Prior Probability P(H₁)', type: 'number', min: 0.001, max: 0.999, step: '0.05' }, { name: 'posterior', label: 'Posterior P(H₁|D)', type: 'number', min: 0.001, max: 0.999, step: '0.05' }],
  compute: (v) => { const prior = n(v.prior); const post = n(v.posterior); const priorOdds = prior / (1 - prior); const postOdds = post / (1 - post); const bf = priorOdds > 0 ? postOdds / priorOdds : 0; return { result: bf, label: 'Bayes Factor BF₁₀', unit: '', steps: [{ label: 'Prior odds', value: `${priorOdds.toExponential(4)}` }, { label: 'Posterior odds', value: `${postOdds.toExponential(4)}` }, { label: 'BF₁₀', value: `${bf.toExponential(4)}` }, { label: 'Evidence', value: bf >= 100 ? 'Decisive' : bf >= 30 ? 'Very strong' : bf >= 10 ? 'Strong' : bf >= 3 ? 'Substantial' : bf >= 1 ? 'Anecdotal' : 'Negative (supports H₀)' }] } },
  description: 'The Bayes Factor quantifies the evidence for one hypothesis relative to another. BF₁₀ = P(D|H₁)/P(D|H₀).',
  formula: 'BF₁₀ = (Posterior odds) / (Prior odds)',
  interpretation: 'BF > 3: substantial evidence for H₁, BF > 10: strong, BF > 100: decisive. BF < 1/3 supports H₀.'
}

export default calcDef

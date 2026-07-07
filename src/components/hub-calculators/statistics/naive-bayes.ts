import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ prior: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), likelihoodPos: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), likelihoodNeg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'prior', label: 'Prior P(Class)', type: 'number', min: 0.01, max: 0.99, step: '0.05' }, { name: 'likelihoodPos', label: 'Likelihood P(Feature|Class)', type: 'number', min: 0.001, step: '0.01' }, { name: 'likelihoodNeg', label: 'Likelihood P(Feature|Not Class)', type: 'number', min: 0.001, step: '0.01' }],
  compute: (v) => { const prior = n(v.prior); const lPos = n(v.likelihoodPos); const lNeg = n(v.likelihoodNeg); const evidence = prior * lPos + (1 - prior) * lNeg; const posterior = evidence > 0 ? (prior * lPos) / evidence : 0; return { result: posterior, label: 'Posterior P(Class|Feature)', unit: '', steps: [{ label: 'Prior', value: `${prior.toFixed(4)}` }, { label: 'Evidence', value: `${evidence.toExponential(4)}` }, { label: 'Posterior', value: `${posterior.toExponential(4)}` }] } },
  description: 'Naive Bayes classifier applies Bayes\' theorem with the "naive" assumption of conditional independence between features.',
  formula: 'P(C|F) = P(C)P(F|C) / P(F), where P(F) = Σ P(C)P(F|C)',
  interpretation: 'Despite the naive assumption, NB performs well in text classification and spam filtering. Requires minimal training data.'
}

export default calcDef

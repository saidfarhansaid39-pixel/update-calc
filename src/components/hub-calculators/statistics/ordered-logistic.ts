import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ thresholds: z.string().min(1, 'Required'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), beta: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required') }),
  fields: [{ name: 'thresholds', label: 'Thresholds (comma separated)', type: 'number', step: 'any' }, { name: 'beta', label: 'Coefficient β', type: 'number', step: 'any' }, { name: 'x', label: 'Predictor x', type: 'number', step: 'any' }],
  compute: (v) => { const thresh = parseList(v.thresholds); const beta = n(v.beta); const x = n(v.x); if (thresh.length < 1) return { result: 'Need ≥1 threshold', label: '', unit: '', steps: [] }; const cumProbs = thresh.map(t => 1 / (1 + Math.exp(-(t - beta * x)))); const probs = [cumProbs[0]]; for (let i = 1; i < cumProbs.length; i++) probs.push(cumProbs[i] - cumProbs[i - 1]); probs.push(1 - cumProbs[cumProbs.length - 1]); return { result: probs.map(p => p.toFixed(4)).join(', '), label: 'Cumulative Probabilities', unit: '', steps: [{ label: 'Categories', value: `${thresh.length + 1}` }, { label: 'Probabilities', value: probs.map((p, i) => `C${i + 1}:${(p * 100).toFixed(1)}%`).join(', ') }] } },
  description: 'Ordered logistic regression models ordinal outcomes using cumulative logits with proportional odds assumption.',
  formula: 'P(Y ≤ j) = 1 / (1 + exp(-(θⱼ - βx)))',
  interpretation: 'The proportional odds assumption means β is constant across thresholds. Positive β increases odds of higher categories.'
}

export default calcDef

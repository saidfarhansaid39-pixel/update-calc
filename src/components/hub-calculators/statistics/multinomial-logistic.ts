import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ coeffs: z.string().min(1, 'Required'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required') }),
  fields: [{ name: 'coeffs', label: 'Coefficients (comma separated, one per category)', type: 'number', step: 'any' }, { name: 'x', label: 'Predictor x', type: 'number', step: 'any' }],
  compute: (v) => { const coeffs = parseList(v.coeffs); const x = n(v.x); if (coeffs.length < 1) return { result: 'Need ≥1 coefficient', label: '', unit: '', steps: [] }; const logits = coeffs.map(c => c * x); const expLogits = logits.map(l => Math.exp(l)); const sumExp = expLogits.reduce((a, b) => a + b, 0) + 1; const probs = expLogits.map(e => e / sumExp); const refProb = 1 / sumExp; return { result: `[${probs.map(p => p.toFixed(4)).join(', ')}, ref:${refProb.toFixed(4)}]`, label: 'Class Probabilities', unit: '', steps: [{ label: 'Categories', value: `${coeffs.length + 1} (incl. reference)` }, { label: 'Probabilities', value: probs.map((p, i) => `C${i + 1}:${(p * 100).toFixed(1)}%`).join(', ') + `, Ref:${(refProb * 100).toFixed(1)}%` }] } },
  description: 'Multinomial logistic regression models nominal outcomes with more than two categories using a reference category.',
  formula: 'P(Y=j) = exp(βⱼx) / (1 + Σexp(βₖx)), reference P(Y=0) = 1 / (1 + Σexp(βₖx))',
  interpretation: 'Each category has its own coefficient vector. The reference category serves as the baseline for comparisons.'
}

export default calcDef

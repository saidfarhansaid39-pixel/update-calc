import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ beta: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), beta0: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required') }),
  fields: [{ name: 'beta', label: 'Coefficient (β)', type: 'number', step: 'any' }, { name: 'beta0', label: 'Intercept (β₀)', type: 'number', step: 'any' }, { name: 'x', label: 'Predictor Value', type: 'number', step: 'any' }],
  compute: (v) => { const b = n(v.beta); const b0 = n(v.beta0); const x = n(v.x); const logit = b0 + b * x; const prob = 1 / (1 + Math.exp(-logit)); const odds = Math.exp(logit); const or = Math.exp(b); return { result: prob, label: 'P(Y=1)', unit: '', steps: [{ label: 'Logit (z)', value: `${logit.toFixed(4)}` }, { label: 'Odds', value: `${odds.toFixed(4)}` }, { label: 'Probability', value: `${prob.toFixed(4)}` }, { label: 'Odds Ratio (e^β)', value: `${or.toFixed(4)}` }] } },
  description: 'Logistic regression models the log-odds of a binary outcome as a linear function of predictors.',
  formula: 'P(Y=1) = 1/(1+e^(-(β₀+βx))), OR = e^β',
  interpretation: 'OR > 1: increased odds per unit x. OR < 1: decreased odds. OR = 1: no effect. Probability ranges 0-1.'
}

export default calcDef

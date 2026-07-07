import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ coeff: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), intercept: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), x: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required') }),
  fields: [{ name: 'coeff', label: 'Coefficient (β)', type: 'number', step: 'any' }, { name: 'intercept', label: 'Intercept (β₀)', type: 'number', step: 'any' }, { name: 'x', label: 'Predictor (x)', type: 'number', step: 'any' }],
  compute: (v) => { const b = n(v.coeff); const b0 = n(v.intercept); const x = n(v.x); const logit = b0 + b * x; const prob = 1 / (1 + Math.exp(-logit)); const odds = Math.exp(logit); return { result: prob, label: 'P(Y=1)', unit: '', steps: [{ label: 'Logit', value: `${logit.toFixed(4)}` }, { label: 'Odds', value: `${odds.toFixed(4)}` }, { label: 'Probability', value: `${prob.toFixed(4)}` }] } },
  description: 'Logistic regression models binary outcomes using the logistic function. Probability = 1/(1+e^(-z)) where z = β₀ + βx.',
  formula: 'P(Y=1) = 1 / (1 + e^(-(β₀ + βx)))',
  interpretation: 'Odds ratio = e^β. Positive β increases probability as x increases. Used for classification and risk prediction.'
}

export default calcDef

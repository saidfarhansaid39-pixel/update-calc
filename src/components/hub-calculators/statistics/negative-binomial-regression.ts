import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mean: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), variance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'mean', label: 'Observed Mean', type: 'number', min: 0, step: 'any' }, { name: 'variance', label: 'Observed Variance', type: 'number', min: 0.001, step: 'any' }],
  compute: (v) => { const mu = n(v.mean); const varVal = n(v.variance); const theta = varVal > mu ? mu * mu / (varVal - mu) : 0; const dispersion = theta > 0 ? 1 / theta : 0; return { result: theta, label: 'Overdispersion (θ)', unit: '', steps: [{ label: 'Mean', value: `${mu.toFixed(4)}` }, { label: 'Variance', value: `${varVal.toFixed(4)}` }, { label: 'θ', value: `${theta.toFixed(4)}` }, { label: 'Dispersion (1/θ)', value: `${dispersion.toExponential(4)}` }] } },
  description: 'Negative binomial regression handles overdispersed count data where variance exceeds the mean.',
  formula: 'Var(Y) = μ + μ²/θ, where θ is the dispersion parameter',
  interpretation: 'An overdispersion parameter > 0 indicates the data are more dispersed than Poisson. Small θ indicates strong overdispersion.'
}

export default calcDef

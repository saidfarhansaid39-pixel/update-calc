import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ shape: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), scale: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), x: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [{ name: 'shape', label: 'Shape (k)', type: 'number', min: 0.01, step: '0.1' }, { name: 'scale', label: 'Scale (λ)', type: 'number', min: 0.01, step: '0.1' }, { name: 'x', label: 'x', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const k = n(v.shape); const lambda = n(v.scale); const x = n(v.x); const pdf = x >= 0 ? (k / lambda) * Math.pow(x / lambda, k - 1) * Math.exp(-Math.pow(x / lambda, k)) : 0; const hazard = (k / lambda) * Math.pow(x / lambda, k - 1); return { result: pdf, label: 'PDF', unit: '', steps: [{ label: 'PDF', value: `${pdf.toExponential(4)}` }, { label: 'Hazard', value: `${hazard.toExponential(4)}` }] } },
  description: 'The Weibull distribution models failure times and survival data. Used extensively in reliability engineering.',
  formula: 'f(x) = (k/λ)(x/λ)^(k-1)e^(-(x/λ)^k)',
  interpretation: 'k < 1: decreasing failure rate, k = 1: constant failure rate (exponential), k > 1: increasing failure rate.'
}

export default calcDef

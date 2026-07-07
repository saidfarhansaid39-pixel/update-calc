import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ shape: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), x: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [{ name: 'shape', label: 'Shape (k)', type: 'number', min: 0.01, step: '0.1' }, { name: 'rate', label: 'Rate (θ)', type: 'number', min: 0.01, step: '0.1' }, { name: 'x', label: 'x', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const k = n(v.shape); const theta = n(v.rate); const x = n(v.x); const lnPdf = (k - 1) * Math.log(x) - x / theta - k * Math.log(theta) - lgamma(k); const pdf = Math.exp(lnPdf); const mean = k * theta; return { result: pdf, label: 'PDF', unit: '', steps: [{ label: 'PDF', value: `${pdf.toExponential(4)}` }, { label: 'Mean', value: `${mean.toFixed(4)}` }] }; function lgamma(z: number): number { return (z - 0.5) * Math.log(z + 4.5) - (z + 4.5) + 0.9189385332 } },
  description: 'The gamma distribution is a flexible distribution for positive continuous data. Sum of k independent exponential variables.',
  formula: 'f(x) = x^(k-1)e^(-x/θ) / (θ^k · Γ(k)) for x > 0',
  interpretation: 'When k = 1, gamma reduces to exponential distribution. When k = ν/2 and θ = 2, gamma becomes chi-square with ν DF.'
}

export default calcDef

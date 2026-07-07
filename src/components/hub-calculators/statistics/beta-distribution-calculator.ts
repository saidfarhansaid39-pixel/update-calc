import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ alpha: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), beta: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), x: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n <= 1 }, '0-1') }),
  fields: [{ name: 'alpha', label: 'α (alpha)', type: 'number', min: 0.01, step: '0.1' }, { name: 'beta', label: 'β (beta)', type: 'number', min: 0.01, step: '0.1' }, { name: 'x', label: 'x', type: 'number', min: 0, max: 1, step: '0.01' }],
  compute: (v) => { const a = n(v.alpha); const b = n(v.beta); const x = n(v.x); const lnPdf = (a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - (lgamma(a) + lgamma(b) - lgamma(a + b)); const pdf = Math.exp(lnPdf); const mean = a / (a + b); const variance = a * b / ((a + b) * (a + b) * (a + b + 1)); return { result: pdf, label: 'PDF', unit: '', steps: [{ label: 'PDF', value: `${pdf.toExponential(4)}` }, { label: 'Mean', value: `${mean.toFixed(4)}` }, { label: 'Variance', value: `${variance.toExponential(4)}` }] }; function lgamma(z: number): number { return (z - 0.5) * Math.log(z + 4.5) - (z + 4.5) + 0.9189385332 } },
  description: 'The beta distribution is a continuous distribution on [0, 1] with shape parameters α and β. Used as a conjugate prior in Bayesian inference.',
  formula: 'f(x) = x^(α-1)(1-x)^(β-1) / B(α, β)',
  interpretation: 'α = β = 1 gives uniform distribution. α > β skews left, α < β skews right. Used in Bayesian statistics and project management (PERT).'
}

export default calcDef

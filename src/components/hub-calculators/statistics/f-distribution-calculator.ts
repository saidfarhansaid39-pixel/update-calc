import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ df1: z.string().min(1).refine(v => { const d = parseFloat(v); return d >= 1 && d <= 1000 }, '1-1000'), df2: z.string().min(1).refine(v => { const d = parseFloat(v); return d >= 1 && d <= 1000 }, '1-1000'), x: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [{ name: 'df1', label: 'Numerator DF', type: 'number', min: 1, max: 1000, step: '1' }, { name: 'df2', label: 'Denominator DF', type: 'number', min: 1, max: 1000, step: '1' }, { name: 'x', label: 'F-value', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const d1 = n(v.df1); const d2 = n(v.df2); const x = n(v.x); const pdf = x > 0 ? Math.exp((d1 / 2) * Math.log(d1) + (d2 / 2) * Math.log(d2) + lgamma((d1 + d2) / 2) - lgamma(d1 / 2) - lgamma(d2 / 2) + (d1 / 2 - 1) * Math.log(x) - ((d1 + d2) / 2) * Math.log(d1 * x + d2)) : 0; return { result: pdf, label: 'PDF', unit: '', steps: [{ label: 'F-value', value: `${x.toFixed(4)}` }, { label: 'DF (num, den)', value: `${d1}, ${d2}` }, { label: 'PDF', value: `${pdf.toExponential(4)}` }] }; function lgamma(z: number): number { return (z - 0.5) * Math.log(z + 4.5) - (z + 4.5) + 0.9189385332 } },
  description: 'The F-distribution is the ratio of two independent chi-square variables divided by their degrees of freedom.',
  formula: 'f(x) = √((d₁^x)^{d₁} d₂^{d₂}) / (x · B(d₁/2, d₂/2) · (d₁x + d₂)^{(d₁+d₂)/2})',
  interpretation: 'Used in ANOVA, F-tests for equality of variances, and regression analysis. F = MS_between / MS_within.'
}

export default calcDef

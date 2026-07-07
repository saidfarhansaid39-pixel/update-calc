import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ df: z.string().min(1).refine(v => { const d = parseFloat(v); return d >= 1 && d <= 1000 }, '1-1000'), x: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [{ name: 'df', label: 'Degrees of Freedom', type: 'number', min: 1, max: 1000, step: '1' }, { name: 'x', label: 'Chi-square value', type: 'number', min: 0, step: '0.1' }],
  compute: (v) => { const df = n(v.df); const x = n(v.x); const pdf = x > 0 ? Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - (df / 2) * Math.log(2) - lgamma(df / 2)) : 0; return { result: pdf, label: 'PDF', unit: '', steps: [{ label: 'χ² value', value: `${x.toFixed(4)}` }, { label: 'Degrees of freedom', value: `${df}` }, { label: 'PDF', value: `${pdf.toExponential(4)}` }] }; function lgamma(z: number): number { return (z - 0.5) * Math.log(z + 4.5) - (z + 4.5) + 0.9189385332 } },
  description: 'The chi-square distribution is the sum of squared independent standard normal variables. Used in goodness-of-fit tests.',
  formula: 'f(x) = x^(ν/2-1)e^(-x/2) / (2^(ν/2) · Γ(ν/2)) for x > 0',
  interpretation: 'Mean = ν, Variance = 2ν. Used in chi-square tests, goodness of fit, and variance estimation.'
}

export default calcDef

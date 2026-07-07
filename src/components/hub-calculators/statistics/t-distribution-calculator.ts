import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ df: z.string().min(1).refine(v => { const d = parseFloat(v); return d >= 1 && d <= 1000 }, '1-1000'), t: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required') }),
  fields: [{ name: 'df', label: 'Degrees of Freedom', type: 'number', min: 1, max: 1000, step: '1' }, { name: 't', label: 't-value', type: 'number', step: '0.1' }],
  compute: (v) => { const df = n(v.df); const t = n(v.t); const pdf = Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2)) / (Math.sqrt(df * Math.PI) * Math.pow(1 + t * t / df, (df + 1) / 2)); return { result: pdf, label: 'PDF', unit: '', steps: [{ label: 't-value', value: `${t.toFixed(4)}` }, { label: 'Degrees of freedom', value: `${df}` }, { label: 'PDF', value: `${pdf.toExponential(4)}` }] }; function lgamma(z: number): number { return (z - 0.5) * Math.log(z + 4.5) - (z + 4.5) + 0.9189385332 } },
  description: 'Student\'s t-distribution is used in hypothesis testing when sample size is small and population standard deviation is unknown.',
  formula: 'f(t) = Γ((ν+1)/2) / (√(νπ) · Γ(ν/2)) · (1 + t²/ν)^(-(ν+1)/2)',
  interpretation: 'As degrees of freedom increase, the t-distribution approaches the standard normal. Used for t-tests and confidence intervals.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sampleMean: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), hypMean: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), sampleStd: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'sampleMean', label: 'Sample Mean', type: 'number', step: 'any' }, { name: 'hypMean', label: 'Hypothesized Mean', type: 'number', step: 'any' }, { name: 'sampleStd', label: 'Sample Std Dev', type: 'number', min: 0.001, step: 'any' }, { name: 'n', label: 'Sample Size', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const se = n(v.sampleStd) / Math.sqrt(n(v.n)); const t = (n(v.sampleMean) - n(v.hypMean)) / se; const df = Math.round(n(v.n)) - 1; return { result: t, label: 't-Statistic', unit: '', steps: [{ label: 'Formula', value: 't = (x̄ - μ₀) / (s/√n)' }, { label: 'SE', value: `${se.toFixed(4)}` }, { label: 't', value: `${t.toFixed(4)}` }, { label: 'DF', value: `${df}` }] } },
  description: 'One-sample t-test compares a sample mean to a hypothesized population mean when population standard deviation is unknown.',
  formula: 't = (x̄ - μ₀) / (s / √n) with df = n-1',
  interpretation: 'The t-statistic follows a t-distribution with n-1 degrees of freedom. Used when σ is unknown.'
}

export default calcDef

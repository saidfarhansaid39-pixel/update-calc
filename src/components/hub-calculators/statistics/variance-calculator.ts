import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), type: z.enum(['population', 'sample']).default('sample') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Sample (N-1)', value: 'sample' }, { label: 'Population (N)', value: 'population' }] }],
  compute: (v) => {
    const nums = parseList(v.values)
    const N = nums.length
    const mean = nums.reduce((a, b) => a + b, 0) / N
    const denom = v.type === 'population' ? N : N - 1
    const ss = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0)
    const variance = denom > 0 ? ss / denom : 0
    const sd = Math.sqrt(variance)
    const cv = mean > 0 ? (sd / mean) * 100 : 0
    const min = Math.min(...nums)
    const max = Math.max(...nums)
    const range = max - min
    return {
      result: variance, label: 'Variance', unit: '',
      steps: [
        { label: 'Data points (N)', value: `${N}` },
        { label: 'Mean (x̄)', value: mean.toFixed(4) },
        { label: 'Sum of squared deviations', value: ss.toFixed(4) },
        { label: 'Denominator', value: `${denom} (${v.type})` },
        { label: 'Variance', value: variance.toFixed(4) },
        { label: 'Standard deviation (σ or s)', value: sd.toFixed(4) },
      ],
      extras: [
        { label: 'Count (N)', value: N },
        { label: 'Mean', value: mean.toFixed(4) },
        { label: 'Variance', value: variance.toFixed(4) },
        { label: 'Standard deviation', value: sd.toFixed(4) },
        { label: 'Coefficient of variation', value: cv.toFixed(2) + '%' },
        { label: 'Range', value: `${min.toFixed(4)} — ${max.toFixed(4)} (${range.toFixed(4)})` },
        { label: 'Sum of squares (SS)', value: ss.toFixed(4) },
        { label: 'Type', value: v.type === 'population' ? 'Population (σ², divide by N)' : 'Sample (s², divide by N-1)' },
        { label: 'Bessel\'s correction', value: v.type === 'sample' ? 'Using N-1 for unbiased estimate' : 'Using N for population' },
        { label: 'Empirical rule', value: sd > 0 ? `≈68% data within ${(mean - sd).toFixed(2)}-${(mean + sd).toFixed(2)}, ≈95% within ${(mean - 2 * sd).toFixed(2)}-${(mean + 2 * sd).toFixed(2)}` : 'N/A (SD = 0)' },
      ],
    }
  },
  description: 'Variance measures the spread of data from the mean. Sample variance uses (N-1) for unbiased estimation (Bessel\'s correction). Includes SD, CV, and empirical rule.',
  formula: 'σ² = Σ(xᵢ - μ)²/N (population) | s² = Σ(xᵢ - x̄)²/(n-1) (sample) | SD = √Variance',
  interpretation: 'Variance is in squared units of the original data. Standard deviation (square root) restores original units. CV = SD/mean × 100% for relative dispersion.'
}

export default calcDef

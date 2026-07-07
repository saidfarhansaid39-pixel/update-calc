import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), type: z.enum(['population', 'sample']).default('sample') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Sample (N-1)', value: 'sample' }, { label: 'Population (N)', value: 'population' }] }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const denom = v.type === 'population' ? nums.length : nums.length - 1; const variance = denom > 0 ? nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / denom : 0; return { result: variance, label: 'Variance', unit: '', steps: [{ label: 'Mean', value: `${mean.toFixed(4)}` }, { label: `Sum of squared deviations`, value: `${nums.reduce((acc, x) => acc + (x - mean) ** 2, 0).toFixed(4)}` }, { label: `Divide by ${denom}`, value: `${variance.toFixed(4)}` }] } },
  description: 'Variance measures the spread of data from the mean. Sample variance uses (N-1) for unbiased estimation (Bessel\'s correction).',
  formula: 'σ² = Σ(xᵢ - μ)²/N, s² = Σ(xᵢ - x̄)²/(n-1)',
  interpretation: 'Variance is in squared units of the original data. Standard deviation (square root) restores original units.'
}

export default calcDef

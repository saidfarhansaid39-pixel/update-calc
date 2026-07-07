import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), type: z.enum(['population', 'sample']).default('sample') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Sample (N-1)', value: 'sample' }, { label: 'Population (N)', value: 'population' }] }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const denom = v.type === 'population' ? nums.length : nums.length - 1; const std = denom > 0 ? Math.sqrt(nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / denom) : 0; return { result: std, label: 'Standard Deviation', unit: '', steps: [{ label: 'Mean', value: `${mean.toFixed(4)}` }, { label: 'Variance', value: `${(std * std).toFixed(4)}` }, { label: 'Std Dev', value: `${std.toFixed(4)}` }] } },
  description: 'Standard deviation is the square root of variance. It measures dispersion in the original units of the data.',
  formula: 'σ = √(σ²), s = √(s²)',
  interpretation: 'In a normal distribution, ~68% of data falls within 1σ, ~95% within 2σ, and ~99.7% within 3σ of the mean.'
}

export default calcDef

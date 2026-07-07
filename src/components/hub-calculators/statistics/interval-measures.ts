import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const sorted = [...nums].sort((a, b) => a - b); const mid = Math.floor(sorted.length / 2); const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]; const std = Math.sqrt(nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (nums.length - 1)); return { result: `Mean:${mean.toFixed(4)} SD:${std.toFixed(4)}`, label: 'Interval Measures', unit: '', steps: [{ label: 'Mean', value: `${mean.toFixed(4)}` }, { label: 'Median', value: `${median.toFixed(4)}` }, { label: 'Std Dev', value: `${std.toFixed(4)}` }] } },
  description: 'Interval scale measures are appropriate for data with equal intervals but no true zero. Mean, median, and standard deviation are valid.',
  formula: 'x̄ = Σxᵢ/n, s = √(Σ(xᵢ-x̄)²/(n-1))',
  interpretation: 'Temperature in Celsius/Fahrenheit is interval data. Ratios are not meaningful (20°C is not twice as hot as 10°C).'
}

export default calcDef

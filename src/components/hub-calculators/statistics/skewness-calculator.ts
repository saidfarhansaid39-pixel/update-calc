import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const n = nums.length; const m2 = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n; const m3 = nums.reduce((acc, x) => acc + (x - mean) ** 3, 0) / n; const skew = m2 > 0 ? m3 / Math.pow(m2, 1.5) : 0; const adj = Math.sqrt(n * (n - 1)) / (n - 2) * skew; return { result: adj, label: 'Skewness (adjusted)', unit: '', steps: [{ label: 'Raw skewness', value: `${skew.toFixed(4)}` }, { label: 'Adjusted (sample)', value: `${adj.toFixed(4)}` }, { label: 'Interpretation', value: adj > 0 ? 'Positively skewed (right tail)' : adj < 0 ? 'Negatively skewed (left tail)' : 'Approximately symmetric' }] } },
  description: 'Skewness measures the asymmetry of a distribution. Positive skew = longer right tail, negative skew = longer left tail.',
  formula: 'g₁ = (√(n(n-1))/(n-2)) × m₃ / m₂^(3/2)',
  interpretation: '|skewness| > 1 indicates substantial asymmetry. Normal distribution has skewness = 0.'
}

export default calcDef

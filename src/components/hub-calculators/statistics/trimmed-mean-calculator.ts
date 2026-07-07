import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), trimPercent: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n < 50 }, '0-50') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'trimPercent', label: 'Trim % (each side)', type: 'number', min: 0, max: 49, step: '1' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const pct = n(v.trimPercent) / 100; const trim = Math.floor(nums.length * pct); const trimmed = nums.slice(trim, nums.length - trim); const mean = trimmed.reduce((a, b) => a + b, 0) / trimmed.length; return { result: mean, label: 'Trimmed Mean', unit: '', steps: [{ label: 'Original count', value: `${nums.length}` }, { label: 'Trimmed count', value: `${trimmed.length}` }, { label: 'Trimmed mean', value: `${mean.toFixed(4)}` }] } },
  description: 'The trimmed mean removes a percentage of the smallest and largest values before calculating the mean. It reduces outlier influence.',
  formula: 'x̄ₜ = Σxᵢ / n after removing k% from each end',
  interpretation: 'A 10% trimmed mean removes the bottom 10% and top 10% of values. The median is a 50% trimmed mean.'
}

export default calcDef

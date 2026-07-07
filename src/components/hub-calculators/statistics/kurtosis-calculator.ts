import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const n = nums.length; const m2 = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n; const m4 = nums.reduce((acc, x) => acc + (x - mean) ** 4, 0) / n; const kurt = m2 > 0 ? m4 / (m2 * m2) : 0; const excess = kurt - 3; return { result: excess, label: 'Excess Kurtosis', unit: '', steps: [{ label: 'Raw kurtosis', value: `${kurt.toFixed(4)}` }, { label: 'Excess kurtosis', value: `${excess.toFixed(4)}` }, { label: 'Interpretation', value: excess > 0 ? 'Leptokurtic (heavy tails)' : excess < 0 ? 'Platykurtic (light tails)' : 'Mesokurtic (normal-like)' }] } },
  description: 'Kurtosis measures the "tailedness" of a distribution. Excess kurtosis = kurtosis - 3 (normal distribution = 0).',
  formula: 'Excess kurtosis = m₄ / m₂² - 3',
  interpretation: 'Leptokurtic distributions have more outliers. Platykurtic distributions have fewer. Normal distribution has excess kurtosis = 0.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const lower = nums.slice(0, Math.floor(nums.length / 2)); const upper = nums.slice(Math.ceil(nums.length / 2)); const q1 = lower.length % 2 === 0 ? (lower[lower.length / 2 - 1] + lower[lower.length / 2]) / 2 : lower[Math.floor(lower.length / 2)]; const q3 = upper.length % 2 === 0 ? (upper[upper.length / 2 - 1] + upper[upper.length / 2]) / 2 : upper[Math.floor(upper.length / 2)]; const iqr = q3 - q1; const lowerFence = q1 - 1.5 * iqr; const upperFence = q3 + 1.5 * iqr; return { result: iqr, label: 'IQR', unit: '', steps: [{ label: 'Q1', value: `${q1.toFixed(4)}` }, { label: 'Q3', value: `${q3.toFixed(4)}` }, { label: 'IQR = Q3 - Q1', value: `${iqr.toFixed(4)}` }, { label: 'Fences', value: `${lowerFence.toFixed(2)} to ${upperFence.toFixed(2)}` }] } },
  description: 'The interquartile range (IQR) is the range of the middle 50% of data. It is robust to outliers.',
  formula: 'IQR = Q₃ - Q₁',
  interpretation: 'The IQR is used to identify outliers (1.5×IQR rule) and is a key component of box plots.'
}

export default calcDef

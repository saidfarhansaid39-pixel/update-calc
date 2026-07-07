import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const q2 = nums.length % 2 === 0 ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2 : nums[Math.floor(nums.length / 2)]; const lower = nums.slice(0, Math.floor(nums.length / 2)); const upper = nums.slice(Math.ceil(nums.length / 2)); const q1 = lower.length % 2 === 0 ? (lower[lower.length / 2 - 1] + lower[lower.length / 2]) / 2 : lower[Math.floor(lower.length / 2)]; const q3 = upper.length % 2 === 0 ? (upper[upper.length / 2 - 1] + upper[upper.length / 2]) / 2 : upper[Math.floor(upper.length / 2)]; return { result: `Q1:${q1.toFixed(2)} Q2:${q2.toFixed(2)} Q3:${q3.toFixed(2)}`, label: 'Quartiles', unit: '', steps: [{ label: 'Q1 (25th)', value: `${q1.toFixed(4)}` }, { label: 'Q2 (50th/Median)', value: `${q2.toFixed(4)}` }, { label: 'Q3 (75th)', value: `${q3.toFixed(4)}` }, { label: 'IQR', value: `${(q3 - q1).toFixed(4)}` }] } },
  description: 'Quartiles divide sorted data into four equal parts. Q1 = 25th percentile, Q2 = median (50th), Q3 = 75th percentile.',
  formula: 'Q₁, Q₂ (median), Q₃',
  interpretation: 'The interquartile range (IQR = Q₃ - Q₁) measures the spread of the middle 50% of data and is robust to outliers.'
}

export default calcDef

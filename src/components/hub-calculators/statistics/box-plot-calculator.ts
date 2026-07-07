import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const min = nums[0]; const max = nums[nums.length - 1]; const q2 = nums.length % 2 === 0 ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2 : nums[Math.floor(nums.length / 2)]; const lower = nums.slice(0, Math.floor(nums.length / 2)); const upper = nums.slice(Math.ceil(nums.length / 2)); const q1 = lower.length % 2 === 0 ? (lower[lower.length / 2 - 1] + lower[lower.length / 2]) / 2 : lower[Math.floor(lower.length / 2)]; const q3 = upper.length % 2 === 0 ? (upper[upper.length / 2 - 1] + upper[upper.length / 2]) / 2 : upper[Math.floor(upper.length / 2)]; const iqr = q3 - q1; const lowerFence = q1 - 1.5 * iqr; const upperFence = q3 + 1.5 * iqr; const outliers = nums.filter(x => x < lowerFence || x > upperFence); return { result: `IQR:${iqr.toFixed(2)} Outliers:${outliers.length}`, label: 'Box Plot Stats', unit: '', steps: [{ label: 'Q1, Median, Q3', value: `${q1.toFixed(2)}, ${q2.toFixed(2)}, ${q3.toFixed(2)}` }, { label: 'IQR', value: `${iqr.toFixed(4)}` }, { label: 'Fences', value: `${lowerFence.toFixed(2)} to ${upperFence.toFixed(2)}` }, { label: 'Outliers', value: outliers.length > 0 ? outliers.join(', ') : 'None' }] } },
  description: 'A box plot visualizes the five-number summary with fences at Q₁ - 1.5×IQR and Q₃ + 1.5×IQR to identify outliers.',
  formula: 'IQR = Q₃ - Q₁, Fences = Q₁ - 1.5×IQR, Q₃ + 1.5×IQR',
  interpretation: 'Points outside the fences are considered outliers. Whiskers extend to the furthest non-outlier points.'
}

export default calcDef

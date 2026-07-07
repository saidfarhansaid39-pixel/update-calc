import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const mid = Math.floor(nums.length / 2); const median = nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid]; return { result: median, label: 'Median', unit: '', steps: [{ label: 'Sorted values', value: nums.join(', ') }, { label: nums.length % 2 === 0 ? 'Average of middle two' : 'Middle value', value: `${median.toFixed(4)}` }] } },
  description: 'The median is the middle value when data is ordered. It is robust to outliers.',
  formula: 'Median = x̃ = middle value of ordered data',
  interpretation: 'The median is preferred over the mean for skewed distributions. It represents the 50th percentile.'
}

export default calcDef

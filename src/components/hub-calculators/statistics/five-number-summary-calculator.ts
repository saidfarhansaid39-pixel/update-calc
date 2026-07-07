import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const min = nums[0]; const max = nums[nums.length - 1]; const q2 = nums.length % 2 === 0 ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2 : nums[Math.floor(nums.length / 2)]; const lower = nums.slice(0, Math.floor(nums.length / 2)); const upper = nums.slice(Math.ceil(nums.length / 2)); const q1 = lower.length % 2 === 0 ? (lower[lower.length / 2 - 1] + lower[lower.length / 2]) / 2 : lower[Math.floor(lower.length / 2)]; const q3 = upper.length % 2 === 0 ? (upper[upper.length / 2 - 1] + upper[upper.length / 2]) / 2 : upper[Math.floor(upper.length / 2)]; const iqr = q3 - q1; return { result: `Min:${min} Q1:${q1.toFixed(2)} Med:${q2.toFixed(2)} Q3:${q3.toFixed(2)} Max:${max}`, label: 'Five-Number Summary', unit: '', steps: [{ label: 'Min', value: `${min}` }, { label: 'Q1', value: `${q1.toFixed(4)}` }, { label: 'Median', value: `${q2.toFixed(4)}` }, { label: 'Q3', value: `${q3.toFixed(4)}` }, { label: 'Max', value: `${max}` }, { label: 'IQR', value: `${iqr.toFixed(4)}` }] } },
  description: 'The five-number summary consists of minimum, Q1, median, Q3, and maximum. It provides a complete overview of data distribution.',
  formula: 'Min, Q₁, Median, Q₃, Max',
  interpretation: 'Box plots visualize the five-number summary. Outliers are typically defined as values beyond Q₁ - 1.5×IQR or Q₃ + 1.5×IQR.'
}

export default calcDef

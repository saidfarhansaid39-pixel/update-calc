import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), percentile: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'percentile', label: 'Percentile', type: 'number', min: 0, max: 100, step: '1' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const p = n(v.percentile); const idx = (p / 100) * (nums.length - 1); const lower = Math.floor(idx); const frac = idx - lower; const val = nums[lower] + frac * (nums[Math.min(lower + 1, nums.length - 1)] - nums[lower]); return { result: val, label: `P${p}`, unit: '', steps: [{ label: 'Sorted data', value: nums.join(', ') }, { label: 'Index', value: `${(p / 100)} × ${nums.length - 1} = ${idx.toFixed(2)}` }, { label: 'Percentile value', value: `${val.toFixed(4)}` }] } },
  description: 'The P-th percentile is the value below which P% of the data falls. Use linear interpolation between adjacent data points.',
  formula: 'Index = (P/100)(n-1), value = linear interpolation',
  interpretation: 'Percentiles are commonly used in standardized testing and growth charts. The median is the 50th percentile.'
}

export default calcDef

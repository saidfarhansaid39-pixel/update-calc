import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ values: z.string().min(1, 'Required'), p: z.string().min(1).refine(v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100, '0-100') }),
    fields: [textField('values', 'Data (comma-separated)'), numField('p', 'Percentile (0-100)')],
    defaults: { values: '10, 20, 30, 40, 50', p: '75' },
    compute: (v) => {
      const nums = String(v.values || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x)).sort((a, b) => a - b)
      if (nums.length === 0) return { result: 'No data', label: 'Error' }
      const p = n(v.p); const rank = (p / 100) * (nums.length - 1); const lower = Math.floor(rank); const upper = Math.ceil(rank)
      const result = lower === upper ? nums[lower] : nums[lower] + (rank - lower) * (nums[upper] - nums[lower])
      return { result: result.toFixed(4), label: `${p}th percentile`, steps: [step('Sorted', nums.join(', ')), step('Rank index', rank.toFixed(2)), step('Percentile', result.toFixed(4))] }
    },
    formula: 'P = value at rank = (p/100) x (n-1). Linear interpolation between adjacent values.',
    description: 'Calculate the percentile rank of a data set.',
    interpretation: 'The value below which a given percentage of data falls.'
}

export default calcDef

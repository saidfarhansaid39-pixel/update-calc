import { z } from 'zod'
import { n, step, numField, selectField, num2Schema, num3Schema, textField, fact, gcd, ni } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    schema: z.object({ values: z.string().min(1, 'Required') }),
    fields: [textField('values', 'Data (comma-separated)')],
    defaults: { values: '10, 20, 30, 40, 50, 60, 70' },
    compute: (v) => {
      const nums = String(v.values || '').split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x)).sort((a, b) => a - b)
      if (nums.length === 0) return { result: 'No data', label: 'Error' }
      const mid = (arr: number[]) => { const m = Math.floor(arr.length / 2); return arr.length % 2 === 0 ? (arr[m - 1] + arr[m]) / 2 : arr[m] }
      const q1 = mid(nums.slice(0, Math.floor(nums.length / 2)))
      const q2 = mid(nums)
      const q3 = mid(nums.slice(Math.ceil(nums.length / 2)))
      return { result: `Q1=${q1.toFixed(2)}, Q2=${q2.toFixed(2)}, Q3=${q3.toFixed(2)}`, label: 'Quartiles', steps: [step('Sorted', nums.join(', ')), step('Q1 (25th)', q1.toFixed(2)), step('Q2 (median)', q2.toFixed(2)), step('Q3 (75th)', q3.toFixed(2))], extras: [{ label: 'IQR', value: q3 - q1 }] }
    },
    formula: 'Q1 = median of lower half, Q2 = median, Q3 = median of upper half.',
    description: 'Calculate the quartiles (Q1, Q2, Q3) of a data set.',
    interpretation: 'Quartiles divide data into four equal parts.'
}

export default calcDef

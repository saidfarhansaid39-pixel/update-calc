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
      const q3 = mid(nums.slice(Math.ceil(nums.length / 2)))
      const iqr = q3 - q1; const lower = q1 - 1.5 * iqr; const upper = q3 + 1.5 * iqr
      return { result: iqr.toFixed(4), label: 'IQR', steps: [step('Q1', q1.toFixed(4)), step('Q3', q3.toFixed(4)), step('IQR = Q3 - Q1', iqr.toFixed(4)), step('Lower fence', lower.toFixed(4)), step('Upper fence', upper.toFixed(4))] }
    },
    formula: 'IQR = Q3 - Q1. Fences: Q1 - 1.5xIQR, Q3 + 1.5xIQR.',
    description: 'Calculate the interquartile range (IQR).',
    interpretation: 'The IQR measures statistical dispersion, robust to outliers.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const sorted = [...nums].sort((a, b) => a - b); const range = sorted[sorted.length - 1] - sorted[0]; return { result: range, label: 'Range', unit: '', steps: [{ label: 'Min', value: `${sorted[0]}` }, { label: 'Max', value: `${sorted[sorted.length - 1]}` }, { label: 'Range', value: `${range.toFixed(4)}` }] } },
  description: 'The range is the difference between the maximum and minimum values in a dataset.',
  formula: 'Range = max(x) - min(x)',
  interpretation: 'Range is a simple measure of dispersion but is highly sensitive to outliers.'
}

export default calcDef

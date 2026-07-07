import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const rms = Math.sqrt(nums.reduce((acc, x) => acc + x * x, 0) / nums.length); return { result: rms, label: 'RMS', unit: '', steps: [{ label: 'Count', value: `${nums.length}` }, { label: 'Sum of squares', value: `${nums.reduce((acc, x) => acc + x * x, 0).toFixed(4)}` }, { label: 'RMS', value: `${rms.toFixed(4)}` }] } },
  description: 'The root mean square (RMS) is the square root of the mean of squared values. Also called the quadratic mean.',
  formula: 'RMS = √(Σxᵢ² / n)',
  interpretation: 'RMS is used for AC voltage, signal processing, and when dealing with positive and negative values.'
}

export default calcDef

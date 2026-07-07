import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values); const mean = nums.reduce((a, b) => a + b, 0) / nums.length; return { result: mean, label: 'Mean', unit: '', steps: [{ label: 'Count', value: `${nums.length}` }, { label: 'Sum', value: `${nums.reduce((a, b) => a + b, 0).toFixed(4)}` }, { label: 'Mean', value: `${mean.toFixed(4)}` }] } },
  description: 'The arithmetic mean is the sum of all values divided by the count of values. It measures central tendency.',
  formula: 'x̄ = Σxᵢ / n',
  interpretation: 'The mean is sensitive to outliers. A single extreme value can significantly shift the mean.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated, >0)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).filter(x => x > 0); const recipSum = nums.reduce((acc, x) => acc + 1 / x, 0); const hm = nums.length / recipSum; return { result: hm, label: 'Harmonic Mean', unit: '', steps: [{ label: 'Count', value: `${nums.length}` }, { label: 'Sum of reciprocals', value: `${recipSum.toFixed(4)}` }, { label: 'Harmonic mean', value: `${hm.toFixed(4)}` }] } },
  description: 'The harmonic mean is the reciprocal of the arithmetic mean of reciprocals. Used for averaging rates and ratios.',
  formula: 'HM = n / Σ(1/xᵢ)',
  interpretation: 'Harmonic mean ≤ geometric mean ≤ arithmetic mean. Used for average speed (distance/time) and in finance (P/E ratios).'
}

export default calcDef

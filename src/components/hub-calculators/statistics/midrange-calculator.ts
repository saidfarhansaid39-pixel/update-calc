import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).sort((a, b) => a - b); const mid = (nums[0] + nums[nums.length - 1]) / 2; return { result: mid, label: 'Midrange', unit: '', steps: [{ label: 'Min', value: `${nums[0]}` }, { label: 'Max', value: `${nums[nums.length - 1]}` }, { label: 'Midrange', value: `${mid.toFixed(4)}` }] } },
  description: 'The midrange is the average of the minimum and maximum values. It is a simple measure of central tendency.',
  formula: 'Midrange = (min + max) / 2',
  interpretation: 'The midrange is very sensitive to outliers. It is rarely used in modern statistics due to this sensitivity.'
}

export default calcDef

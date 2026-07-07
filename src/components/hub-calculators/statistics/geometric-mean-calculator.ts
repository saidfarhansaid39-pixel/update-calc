import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated, >0)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).filter(x => x > 0); const logSum = nums.reduce((acc, x) => acc + Math.log(x), 0); const gm = Math.exp(logSum / nums.length); return { result: gm, label: 'Geometric Mean', unit: '', steps: [{ label: 'Count', value: `${nums.length}` }, { label: 'Product', value: `exp(${logSum.toFixed(4)})` }, { label: 'Geometric mean', value: `${gm.toFixed(4)}` }] } },
  description: 'The geometric mean is the nth root of the product of n numbers. It is used for growth rates, ratios, and log-normal data.',
  formula: 'GM = (Πxᵢ)^(1/n) = exp(Σln(xᵢ)/n)',
  interpretation: 'Geometric mean is always ≤ arithmetic mean. Used for compound growth rates, investment returns, and biological data.'
}

export default calcDef

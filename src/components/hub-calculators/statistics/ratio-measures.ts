import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated, >0)', type: 'number', step: 'any' }],
  compute: (v) => { const nums = parseList(v.values).filter(x => x > 0); if (nums.length === 0) return { result: 0, label: 'Ratio Measures', unit: '', steps: [] }; const mean = nums.reduce((a, b) => a + b, 0) / nums.length; const logSum = nums.reduce((acc, x) => acc + Math.log(x), 0); const gm = Math.exp(logSum / nums.length); const sorted = [...nums].sort((a, b) => a - b); const mid = Math.floor(sorted.length / 2); const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]; return { result: `GM:${gm.toFixed(4)} Median:${median.toFixed(4)}`, label: 'Ratio Measures', unit: '', steps: [{ label: 'Arithmetic mean', value: `${mean.toFixed(4)}` }, { label: 'Geometric mean', value: `${gm.toFixed(4)}` }, { label: 'Median', value: `${median.toFixed(4)}` }] } },
  description: 'Ratio scale measures support all arithmetic operations including ratios. Geometric mean is particularly appropriate for ratio data.',
  formula: 'GM = (Πxᵢ)^(1/n), Median = Q₂',
  interpretation: 'Ratio data has a true zero. Geometric mean is preferred when values span orders of magnitude (e.g., concentrations, rates).'
}

export default calcDef

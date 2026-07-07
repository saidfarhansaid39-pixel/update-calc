import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ values: z.string().min(1, 'Required'), weights: z.string().min(1, 'Required') }),
  fields: [{ name: 'values', label: 'Values (comma separated)', type: 'number', step: 'any' }, { name: 'weights', label: 'Weights (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const vals = parseList(v.values); const wts = parseList(v.weights); if (vals.length !== wts.length) return { result: 'Error: mismatched lengths', label: '', unit: '', steps: [] }; const sumW = wts.reduce((a, b) => a + b, 0); const weighted = vals.reduce((acc, x, i) => acc + x * wts[i], 0); const mean = sumW > 0 ? weighted / sumW : 0; return { result: mean, label: 'Weighted Mean', unit: '', steps: [{ label: 'Sum of weights', value: `${sumW.toFixed(4)}` }, { label: 'Weighted sum', value: `${weighted.toFixed(4)}` }, { label: 'Weighted mean', value: `${mean.toFixed(4)}` }] } },
  description: 'The weighted mean assigns different importance (weights) to each value before averaging.',
  formula: 'x̄_w = Σ(wᵢ × xᵢ) / Σwᵢ',
  interpretation: 'Weights are relative importance values. Common in grade calculation (weighted assignments) and survey analysis.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ observed: z.string().min(1, 'Required'), rows: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), cols: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'observed', label: 'Observed (comma separated, row-major)', type: 'number', step: 'any' }, { name: 'rows', label: 'Rows', type: 'number', min: 2, step: '1' }, { name: 'cols', label: 'Columns', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const obs = parseList(v.observed); const r = Math.round(n(v.rows)); const c = Math.round(n(v.cols)); if (obs.length !== r * c) return { result: `Need ${r * c} values`, label: '', unit: '', steps: [] }; const rowSums = Array(r).fill(0); const colSums = Array(c).fill(0); let grand = 0; obs.forEach((o, i) => { const ri = Math.floor(i / c); const ci = i % c; rowSums[ri] += o; colSums[ci] += o; grand += o }); const expected = obs.map((o, i) => { const ri = Math.floor(i / c); const ci = i % c; return rowSums[ri] * colSums[ci] / grand }); const chi2 = obs.reduce((acc, o, i) => acc + (expected[i] > 0 ? ((o - expected[i]) ** 2) / expected[i] : 0), 0); const df = (r - 1) * (c - 1); return { result: chi2, label: 'χ² Independence', unit: '', steps: [{ label: 'Rows × Cols', value: `${r} × ${c}` }, { label: 'χ²', value: `${chi2.toFixed(4)}` }, { label: 'DF', value: `${df}` }] } },
  description: 'Chi-square test of independence tests whether two categorical variables are independent in a contingency table.',
  formula: 'χ² = Σ((Oᵢⱼ - Eᵢⱼ)² / Eᵢⱼ), Eᵢⱼ = row_total × col_total / grand_total',
  interpretation: 'A significant χ² indicates association. Expected frequencies ≥ 5 is recommended for validity.'
}

export default calcDef

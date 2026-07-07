import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ observed: z.string().min(1, 'Required'), rows: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), cols: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'observed', label: 'Observed (comma separated, row-major)', type: 'number', step: 'any' }, { name: 'rows', label: 'Rows', type: 'number', min: 2, step: '1' }, { name: 'cols', label: 'Columns', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const obs = parseList(v.observed); const r = Math.round(n(v.rows)); const c = Math.round(n(v.cols)); if (obs.length !== r * c) return { result: `Need ${r * c} values`, label: '', unit: '', steps: [] }; const rowSums = Array(r).fill(0); const colSums = Array(c).fill(0); let grandTotal = 0; obs.forEach((o, i) => { const ri = Math.floor(i / c); const ci = i % c; rowSums[ri] += o; colSums[ci] += o; grandTotal += o }); const expected = obs.map((o, i) => { const ri = Math.floor(i / c); const ci = i % c; return rowSums[ri] * colSums[ci] / grandTotal }); const chi2 = obs.reduce((acc, o, i) => acc + ((o - expected[i]) ** 2) / expected[i], 0); const df = (r - 1) * (c - 1); return { result: chi2, label: 'χ²', unit: '', steps: [{ label: 'Rows', value: `${r}` }, { label: 'Columns', value: `${c}` }, { label: 'χ²', value: `${chi2.toFixed(4)}` }, { label: 'DF', value: `${df}` }] } },
  description: 'Contingency table analysis computes expected frequencies and chi-square statistic for R×C tables under independence.',
  formula: 'Eᵢⱼ = (row total × col total) / grand total, χ² = Σ(O-E)²/E',
  interpretation: 'The chi-square test determines whether rows and columns are independent. Expected frequencies ≥ 5 is a validity condition.'
}

export default calcDef

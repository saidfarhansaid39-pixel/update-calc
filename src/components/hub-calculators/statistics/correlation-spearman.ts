import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const rank = (arr: number[]) => { const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v); const ranks = Array(arr.length); sorted.forEach((item, idx) => { let j = idx; while (j + 1 < sorted.length && sorted[j + 1].v === item.v) j++; const avg = (idx + 1 + j + 1) / 2; for (let k = idx; k <= j; k++) ranks[sorted[k].i] = avg; return j }); return ranks }; const rX = rank(x); const rY = rank(y); const d2 = rX.reduce((acc, rx, i) => acc + (rx - rY[i]) ** 2, 0); const rho = 1 - (6 * d2) / (x.length * (x.length * x.length - 1)); return { result: rho, label: 'Spearman ρ', unit: '', steps: [{ label: 'N pairs', value: `${x.length}` }, { label: 'Σd²', value: `${d2.toFixed(4)}` }, { label: 'ρ', value: `${rho.toFixed(4)}` }] } },
  description: 'Spearman\'s rank correlation coefficient (ρ) measures monotonic relationships using ranked data. It is robust to outliers.',
  formula: 'ρ = 1 - 6Σdᵢ² / (n(n²-1)) where dᵢ = rank difference',
  interpretation: 'ρ = +1: perfect monotonic increase, ρ = -1: perfect monotonic decrease. Less sensitive to outliers than Pearson.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required') }),
  fields: [{ name: 'x', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'y', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.x); const y = parseList(v.y); if (x.length !== y.length || x.length < 3) return { result: 'Need ≥3 pairs', label: '', unit: '', steps: [] }; const rank = (arr: number[]) => { const sorted = arr.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v); const ranks = Array(arr.length); sorted.forEach((item, idx, arr2) => { let j = idx; while (j + 1 < arr2.length && arr2[j + 1].v === item.v) j++; const avg = (idx + 1 + j + 1) / 2; for (let k = idx; k <= j; k++) ranks[arr2[k].i] = avg }); return ranks }; const rX = rank(x); const rY = rank(y); const n = x.length; const d2 = rX.reduce((acc, rx, i) => acc + (rx - rY[i]) ** 2, 0); const tiesX = n * (n * n - 1) - (() => { const f: Record<number, number> = {}; x.forEach(v => { f[v] = (f[v] || 0) + 1 }); return Object.values(f).reduce((s, t) => s + t * (t * t - 1), 0) })(); const tiesY = n * (n * n - 1) - (() => { const f: Record<number, number> = {}; y.forEach(v => { f[v] = (f[v] || 0) + 1 }); return Object.values(f).reduce((s, t) => s + t * (t * t - 1), 0) })(); const rho = (n * (n * n - 1) / 2 - d2 - (tiesX + tiesY) / 2) / Math.sqrt((n * (n * n - 1) / 2 - tiesX) * (n * (n * n - 1) / 2 - tiesY)); return { result: rho, label: "Spearman's ρ (tie-corrected)", unit: '', steps: [{ label: 'N', value: `${n}` }, { label: 'Σd²', value: `${d2.toFixed(4)}` }, { label: 'ρ (corrected)', value: `${rho.toFixed(4)}` }] } },
  description: "Spearman's rank correlation with correction for tied ranks.",
  formula: 'ρ = (Σ(Rx- Rx̄)(Ry- Rȳ)) / √(Σ(Rx- Rx̄)² Σ(Ry- Rȳ)²)',
  interpretation: 'Measures monotonic association. Tie correction matters when many values are identical.'
}

export default calcDef

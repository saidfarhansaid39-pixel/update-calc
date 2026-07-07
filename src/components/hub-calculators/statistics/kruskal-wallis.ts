import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ g1: z.string().min(1, 'Required'), g2: z.string().min(1, 'Required'), g3: z.string().min(1, 'Required') }),
  fields: [{ name: 'g1', label: 'Group 1 (comma separated)', type: 'number', step: 'any' }, { name: 'g2', label: 'Group 2 (comma separated)', type: 'number', step: 'any' }, { name: 'g3', label: 'Group 3 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const gs = [parseList(v.g1), parseList(v.g2), parseList(v.g3)].filter(g => g.length > 0); if (gs.length < 2) return { result: 'Need ≥2 groups', label: '', unit: '', steps: [] }; const all = gs.flat().map((x, i) => ({ v: x, origIdx: i })); const sorted = [...all].sort((a, b) => a.v - b.v); sorted.forEach((item, idx, arr) => { let j = idx; while (j + 1 < arr.length && arr[j + 1].v === item.v) j++; const avgRank = (idx + 1 + j + 1) / 2; for (let k = idx; k <= j; k++) arr[k].origIdx = avgRank }); const N = sorted.length; let rankIdx = 0; const rankSums = gs.map(g => { const start = rankIdx; rankIdx += g.length; let sum = 0; for (let i = start; i < start + g.length; i++) sum += (sorted.find((_, idx) => idx === i) || { origIdx: 0 }).origIdx; return sum }); const H = (12 / (N * (N + 1))) * rankSums.reduce((acc, r, i) => acc + r * r / gs[i].length, 0) - 3 * (N + 1); const df = gs.length - 1; return { result: H, label: 'Kruskal-Wallis H', unit: '', steps: [{ label: 'Groups', value: `${gs.length}` }, { label: 'Total N', value: `${N}` }, { label: 'H', value: `${H.toFixed(4)}` }, { label: 'DF', value: `${df}` }] } },
  description: 'Kruskal-Wallis is a non-parametric alternative to one-way ANOVA testing whether samples come from the same distribution.',
  formula: 'H = (12/N(N+1))Σ(Rᵢ²/nᵢ) - 3(N+1) ~ χ²(k-1)',
  interpretation: 'A significant H indicates at least one group stochastically dominates another. Post-hoc Dunn tests identify specific pairs.'
}

export default calcDef

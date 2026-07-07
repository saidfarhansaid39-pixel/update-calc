import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ group1: z.string().min(1, 'Required'), group2: z.string().min(1, 'Required'), group3: z.string().min(1, 'Required') }),
  fields: [{ name: 'group1', label: 'Group 1 (comma separated)', type: 'number', step: 'any' }, { name: 'group2', label: 'Group 2 (comma separated)', type: 'number', step: 'any' }, { name: 'group3', label: 'Group 3 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const gs = [parseList(v.group1), parseList(v.group2), parseList(v.group3)].filter(g => g.length > 0); if (gs.length < 2) return { result: 'Need ≥2 groups', label: '', unit: '', steps: [] }; const all = gs.flat().map((x, i) => ({ val: x, idx: i })); const sorted = [...all].sort((a, b) => a.val - b.val); sorted.forEach((item, i) => item.idx = i + 1); let rankIdx = 0; for (let i = 0; i < sorted.length; i++) { let j = i; while (j + 1 < sorted.length && sorted[j + 1].val === sorted[i].val) j++; const avgRank = (i + 1 + j + 1) / 2; for (let k = i; k <= j; k++) sorted[k].idx = avgRank; i = j } const N = sorted.length; const allRanks = sorted.map(s => s.idx); const sumRank = allRanks.reduce((a, b) => a + b, 0); const H = gs.reduce((acc, g, gi) => { const ri = gs.slice(0, gi).reduce((s, prev) => s + prev.length, 0); const ranks = g.map((_, j) => allRanks[ri + j]); const rSum = ranks.reduce((a, b) => a + b, 0); return acc + rSum * rSum / g.length }, 0); const Hstat = (12 / (N * (N + 1))) * H - 3 * (N + 1); return { result: Hstat, label: 'H-Statistic', unit: '', steps: [{ label: 'Groups', value: `${gs.length}` }, { label: 'Total N', value: `${N}` }, { label: 'H', value: `${Hstat.toFixed(4)}` }] } },
  description: 'Kruskal-Wallis test is a non-parametric alternative to one-way ANOVA. It tests whether samples come from the same distribution.',
  formula: 'H = (12/N(N+1)) × Σ(Rᵢ²/nᵢ) - 3(N+1)',
  interpretation: 'H follows χ² distribution with k-1 DF. No normality assumption required. Uses ranks instead of raw values.'
}

export default calcDef

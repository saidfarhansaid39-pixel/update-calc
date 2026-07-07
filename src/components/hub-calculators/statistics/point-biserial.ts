import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ group0: z.string().min(1, 'Required'), group1: z.string().min(1, 'Required') }),
  fields: [{ name: 'group0', label: 'Group 0 (comma separated)', type: 'number', step: 'any' }, { name: 'group1', label: 'Group 1 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const g0 = parseList(v.group0); const g1 = parseList(v.group1); if (g0.length < 2 || g1.length < 2) return { result: 'Need ≥2 per group', label: '', unit: '', steps: [] }; const all = [...g0, ...g1]; const n0 = g0.length; const n1 = g1.length; const n = all.length; const m0 = g0.reduce((a, b) => a + b, 0) / n0; const m1 = g1.reduce((a, b) => a + b, 0) / n1; const sd = Math.sqrt(all.reduce((acc, x) => acc + (x - all.reduce((a, b) => a + b, 0) / n) ** 2, 0) / n); const rpb = sd > 0 ? ((m1 - m0) / sd) * Math.sqrt((n1 * n0) / (n * n)) : 0; return { result: rpb, label: 'Point-Biserial r', unit: '', steps: [{ label: 'Group 0 mean', value: `${m0.toFixed(4)}` }, { label: 'Group 1 mean', value: `${m1.toFixed(4)}` }, { label: 'r_pb', value: `${rpb.toFixed(4)}` }] } },
  description: 'Point-biserial correlation measures the strength of association between a binary variable and a continuous variable.',
  formula: 'r_pb = ((M₁ - M₀) / s_y) × √(n₁n₀ / n²)',
  interpretation: 'r_pb ranges from -1 to +1. Squared r_pb equals the proportion of variance in Y explained by group membership.'
}

export default calcDef

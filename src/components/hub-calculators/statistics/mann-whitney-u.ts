import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ group1: z.string().min(1, 'Required'), group2: z.string().min(1, 'Required') }),
  fields: [{ name: 'group1', label: 'Group 1 (comma separated)', type: 'number', step: 'any' }, { name: 'group2', label: 'Group 2 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const g1 = parseList(v.group1); const g2 = parseList(v.group2); if (g1.length < 2 || g2.length < 2) return { result: 'Need >=2 per group', label: '', unit: '', steps: [] }; const all = g1.map((x, i) => ({ v: x, g: 1, i })).concat(g2.map((x, i) => ({ v: x, g: 2, i }))).sort((a, b) => a.v - b.v); all.forEach((item, idx, arr) => { let j = idx; while (j + 1 < arr.length && arr[j + 1].v === item.v) j++; const avg = (idx + 1 + j + 1) / 2; for (let k = idx; k <= j; k++) (arr[k] as any).r = avg; return j }); const r1 = all.filter(x => x.g === 1).reduce((s, x) => s + ((x as any).r || 0), 0); const n1 = g1.length; const n2 = g2.length; const u1 = r1 - n1 * (n1 + 1) / 2; const u2 = n1 * n2 - u1; const u = Math.min(u1, u2); const mu = n1 * n2 / 2; const sigma = Math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12); const z = sigma > 0 ? (u - mu) / sigma : 0; return { result: u, label: 'Mann-Whitney U', unit: '', steps: [{ label: 'U1', value: `${u1.toFixed(0)}` }, { label: 'U2', value: `${u2.toFixed(0)}` }, { label: 'U (smaller)', value: `${u.toFixed(0)}` }, { label: 'z', value: `${z.toFixed(4)}` }] } },
  description: 'Mann-Whitney U test is a non-parametric alternative to the independent t-test. It compares medians of two groups.',
  formula: 'U = R₁ - n₁(n₁+1)/2, where R₁ = sum of ranks in group 1',
  interpretation: 'The U statistic follows a known distribution under H₀. For large samples, z approximates a normal distribution.'
}

export default calcDef

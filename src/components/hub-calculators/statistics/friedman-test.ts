import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ condition1: z.string().min(1, 'Required'), condition2: z.string().min(1, 'Required'), condition3: z.string().min(1, 'Required') }),
  fields: [{ name: 'condition1', label: 'Condition 1 (comma separated)', type: 'number', step: 'any' }, { name: 'condition2', label: 'Condition 2 (comma separated)', type: 'number', step: 'any' }, { name: 'condition3', label: 'Condition 3 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const c1 = parseList(v.condition1); const c2 = parseList(v.condition2); const c3 = parseList(v.condition3); if (c1.length !== c2.length || c1.length !== c3.length || c1.length < 2) return { result: 'Need ≥2 subjects', label: '', unit: '', steps: [] }; const k = 3; const b = c1.length; const rankRow = (a: number, b: number, c: number) => { const arr = [a, b, c]; const sorted = [...arr].sort((x, y) => x - y); return arr.map(v => { const idx = sorted.indexOf(v); let j = idx; while (j + 1 < sorted.length && sorted[j + 1] === v) j++; return (idx + 1 + j + 1) / 2 }) }; const rankSums = [0, 0, 0]; for (let i = 0; i < b; i++) { const ranks = rankRow(c1[i], c2[i], c3[i]); rankSums[0] += ranks[0]; rankSums[1] += ranks[1]; rankSums[2] += ranks[2] }; const Q = (12 / (b * k * (k + 1))) * rankSums.reduce((acc, r) => acc + r * r, 0) - 3 * b * (k + 1); return { result: Q, label: 'Friedman Q', unit: '', steps: [{ label: 'Rank sums', value: rankSums.map(r => r.toFixed(1)).join(', ') }, { label: 'Q', value: `${Q.toFixed(4)}` }, { label: 'Subjects', value: `${b}` }] } },
  description: 'Friedman test is a non-parametric alternative to repeated measures ANOVA for matched or paired data.',
  formula: 'Q = 12/(bk(k+1)) × ΣRⱼ² - 3b(k+1)',
  interpretation: 'Q approximately follows χ² with k-1 DF. Used for randomized block designs when normality is violated.'
}

export default calcDef

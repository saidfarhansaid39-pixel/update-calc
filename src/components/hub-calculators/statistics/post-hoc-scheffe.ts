import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ means: z.string().min(1, 'Required'), n: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), mse: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'means', label: 'Group Means (comma separated)', type: 'number', step: 'any' }, { name: 'n', label: 'N per group', type: 'number', min: 2, step: '1' }, { name: 'mse', label: 'MSE (within groups)', type: 'number', min: 0.001, step: 'any' }],
  compute: (v) => { const means = parseList(v.means); const nPer = Math.round(n(v.n)); const mse = n(v.mse); const k = means.length; if (k < 2) return { result: 'Need ≥2 groups', label: '', unit: '', steps: [] }; const se = Math.sqrt(mse / nPer); const fCrit = 3.0; const scheffeS = Math.sqrt((k - 1) * fCrit); const results = []; for (let i = 0; i < k; i++) { for (let j = i + 1; j < k; j++) { const diff = Math.abs(means[i] - means[j]); const test = se > 0 ? diff / (se * Math.sqrt(2)) : 0; results.push({ pair: `${i + 1}-${j + 1}`, diff: diff.toFixed(4), s: (test / Math.sqrt((k - 1) * 1)).toFixed(4) }) } }; return { result: results.map(r => `${r.pair}:${r.s}`).join('; '), label: 'Scheffe Test Values', unit: '', steps: [{ label: 'k groups', value: `${k}` }, { label: 'SE', value: `${se.toFixed(4)}` }, { label: 'Comparisons', value: results.map(r => `${r.pair} S=${r.s}`).join(', ') }] } },
  description: 'Scheffe\'s method is a post-hoc test that allows all possible contrasts (not just pairwise comparisons).',
  formula: 'S = √((k-1)F_α) × √(MSE(1/nᵢ + 1/nⱼ))',
  interpretation: 'Scheffe is the most flexible but least powerful post-hoc test. Appropriate for complex contrasts and unequal sample sizes.'
}

export default calcDef

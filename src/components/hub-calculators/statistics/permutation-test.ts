import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ group1: z.string().min(1, 'Required'), group2: z.string().min(1, 'Required') }),
  fields: [{ name: 'group1', label: 'Group 1 (comma separated)', type: 'number', step: 'any' }, { name: 'group2', label: 'Group 2 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const g1 = parseList(v.group1); const g2 = parseList(v.group2); if (g1.length < 2 || g2.length < 2) return { result: 'Need ≥2 per group', label: '', unit: '', steps: [] }; const obsDiff = g1.reduce((a, b) => a + b, 0) / g1.length - g2.reduce((a, b) => a + b, 0) / g2.length; const combined = [...g1, ...g2]; const nPerm = 1000; let extreme = 0; for (let p = 0; p < nPerm; p++) { for (let i = combined.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [combined[i], combined[j]] = [combined[j], combined[i]] }; const permM1 = combined.slice(0, g1.length).reduce((a, b) => a + b, 0) / g1.length; const permM2 = combined.slice(g1.length).reduce((a, b) => a + b, 0) / g2.length; if (Math.abs(permM1 - permM2) >= Math.abs(obsDiff)) extreme++ }; const pVal = extreme / nPerm; return { result: pVal, label: 'Permutation p-value', unit: '', steps: [{ label: 'Observed difference', value: `${obsDiff.toFixed(4)}` }, { label: 'Permutations', value: `${nPerm}` }, { label: 'p-value', value: `${pVal.toFixed(4)}` }] } },
  description: 'The permutation test (randomization test) computes the p-value by reshuffling group labels and recalculating the test statistic.',
  formula: 'p = (count(|perm_diff| ≥ |obs_diff|) + 1) / (N_perm + 1)',
  interpretation: 'A non-parametric test that makes no distributional assumptions. More permutations yield more precise p-values.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ group1: z.string().min(1, 'Required'), group2: z.string().min(1, 'Required') }),
  fields: [{ name: 'group1', label: 'Group 1 (comma separated)', type: 'number', step: 'any' }, { name: 'group2', label: 'Group 2 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const g1 = parseList(v.group1); const g2 = parseList(v.group2); if (g1.length < 2 || g2.length < 2) return { result: 'Need ≥2 per group', label: '', unit: '', steps: [] }; const obsDiff = g1.reduce((a, b) => a + b, 0) / g1.length - g2.reduce((a, b) => a + b, 0) / g2.length; const combined = [...g1, ...g2]; const nRand = 1000; let extreme = 0; for (let r = 0; r < nRand; r++) { const shuffled = [...combined]; for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] }; const rm1 = shuffled.slice(0, g1.length).reduce((a, b) => a + b, 0) / g1.length; const rm2 = shuffled.slice(g1.length).reduce((a, b) => a + b, 0) / g2.length; if (Math.abs(rm1 - rm2) >= Math.abs(obsDiff)) extreme++ }; const pVal = (extreme + 1) / (nRand + 1); return { result: pVal, label: 'Randomization p-value', unit: '', steps: [{ label: 'Observed difference', value: `${obsDiff.toFixed(4)}` }, { label: 'Randomizations', value: `${nRand}` }, { label: 'p-value', value: `${pVal.toFixed(4)}` }] } },
  description: 'The randomization test is a non-parametric test that assesses significance by repeatedly randomizing data assignments.',
  formula: 'p = (count(random_diff ≥ |obs_diff|) + 1) / (N + 1)',
  interpretation: 'Also called a permutation test. Suitable when parametric assumptions are violated. The null is that groups are exchangeable.'
}

export default calcDef

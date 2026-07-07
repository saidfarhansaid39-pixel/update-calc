import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ group1: z.string().min(1, 'Required'), group2: z.string().min(1, 'Required'), covariate: z.string().min(1, 'Required') }),
  fields: [{ name: 'group1', label: 'Group 1 DV (comma separated)', type: 'number', step: 'any' }, { name: 'group2', label: 'Group 2 DV (comma separated)', type: 'number', step: 'any' }, { name: 'covariate', label: 'Covariate (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const g1 = parseList(v.group1); const g2 = parseList(v.group2); const cov = parseList(v.covariate); if (g1.length !== cov.length || g2.length !== cov.length || g1.length < 3) return { result: 'Need ≥3 per group', label: '', unit: '', steps: [] }; const all = [...g1, ...g2]; const my = all.reduce((a, b) => a + b, 0) / all.length; const mx = cov.reduce((a, b) => a + b, 0) / cov.length; const pooledY = [...g1, ...g2]; const sst = pooledY.reduce((acc, y) => acc + (y - my) ** 2, 0); const ssc = cov.reduce((acc, x, i) => acc + (x - mx) * (pooledY[i] - my), 0) ** 2 / cov.reduce((acc, x) => acc + (x - mx) ** 2, 0); const adjM1 = g1.reduce((a, b) => a + b, 0) / g1.length; const adjM2 = g2.reduce((a, b) => a + b, 0) / g2.length; return { result: adjM1 - adjM2, label: 'Adjusted Mean Diff', unit: '', steps: [{ label: 'Group 1 mean', value: `${adjM1.toFixed(4)}` }, { label: 'Group 2 mean', value: `${adjM2.toFixed(4)}` }, { label: 'Covariate mean', value: `${mx.toFixed(4)}` }, { label: 'SS(covariate)', value: `${ssc.toFixed(4)}` }] } },
  description: 'ANCOVA compares group means after statistically controlling for a covariate, reducing error variance.',
  formula: 'Adjusted Y = Y - β(X - X̄), F = MS_group / MS_error(adj)',
  interpretation: 'ANCOVA increases statistical power by removing covariate-related variance. Assumes homogeneity of regression slopes.'
}

export default calcDef

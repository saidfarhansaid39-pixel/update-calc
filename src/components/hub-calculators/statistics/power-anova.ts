import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ k: z.string().min(1).refine(v => { const k = parseInt(v); return k >= 2 && k <= 20 }, '2-20'), n: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), f: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'k', label: 'Number of Groups', type: 'number', min: 2, max: 20, step: '1' }, { name: 'n', label: 'N per Group', type: 'number', min: 2, step: '1' }, { name: 'f', label: 'Effect Size f', type: 'number', min: 0.01, step: '0.05' }, { name: 'alpha', label: 'Alpha (α)', type: 'number', min: 0.001, max: 0.1, step: '0.005' }],
  compute: (v) => { const k = Math.round(n(v.k)); const nPerGroup = Math.round(n(v.n)); const f = n(v.f); const alpha = n(v.alpha); const ncp = nPerGroup * k * f * f; const df1 = k - 1; const df2 = k * (nPerGroup - 1); const fCrit = 2.71; const z = (ncp - df1 - 2) / Math.sqrt(2 * (df1 + 2 * ncp)); const power = 1 - (z > -4 ? 0.5 * Math.exp(-z * z / 2) / (0.5 + 0.5 * Math.sqrt(1 - Math.exp(-z * z * 2 / Math.PI))) : 1); return { result: Math.max(0.01, Math.min(0.99, power)), label: 'Power (ANOVA)', unit: '', steps: [{ label: 'N per group', value: `${nPerGroup}` }, { label: 'Effect f', value: `${f}` }, { label: 'NCP', value: `${ncp.toFixed(4)}` }, { label: 'Power', value: `${Math.max(0.01, Math.min(0.99, power)).toFixed(4)}` }] } },
  description: 'Power analysis for one-way ANOVA calculates the probability of detecting a true difference among group means.',
  formula: 'ncp = nkf², where f = σ_between / σ_within. Power = P(F > F_crit | ncp)',
  interpretation: 'Cohen\'s f: 0.1 (small), 0.25 (medium), 0.4 (large). Power ≥ 0.80 is conventional target.'
}

export default calcDef

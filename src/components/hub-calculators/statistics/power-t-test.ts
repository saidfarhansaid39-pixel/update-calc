import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ d: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'd', label: 'Effect Size (Cohen\'s d)', type: 'number', min: 0.01, step: '0.1' }, { name: 'n', label: 'N per Group', type: 'number', min: 2, step: '1' }, { name: 'alpha', label: 'Alpha (α)', type: 'number', min: 0.001, max: 0.1, step: '0.005' }],
  compute: (v) => { const d = n(v.d); const nPerGroup = Math.round(n(v.n)); const alpha = n(v.alpha); const ncp = d * Math.sqrt(nPerGroup / 2); const df = 2 * nPerGroup - 2; const zAlpha = 1.6449; const zBeta = ncp - zAlpha; const power = 1 - (zBeta > -4 ? 0.5 * Math.exp(-zBeta * zBeta / 2) / (0.5 + 0.5 * Math.sqrt(1 - Math.exp(-zBeta * zBeta * 2 / Math.PI))) : 1); const neededN = Math.ceil(2 * ((1.96 + 0.84) / d) ** 2); return { result: Math.max(0.01, Math.min(0.99, power)), label: 'Power (t-test)', unit: '', steps: [{ label: "Cohen's d", value: `${d}` }, { label: 'N per group', value: `${nPerGroup}` }, { label: 'Power', value: `${Math.max(0.01, Math.min(0.99, power)).toFixed(4)}` }, { label: 'N needed for 80% power', value: `${neededN}` }] } },
  description: 'Power analysis for independent two-sample t-test calculates the probability of detecting a true difference between group means.',
  formula: 'ncp = d × √(n/2), Power = P(t\'_df(ncp) > t_α,df)',
  interpretation: '80% power with α=0.05 requires n ≈ 64 per group for medium effect (d=0.5) and n ≈ 393 for small effect (d=0.2).'
}

export default calcDef

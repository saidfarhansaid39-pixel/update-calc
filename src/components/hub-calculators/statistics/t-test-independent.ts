import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mean1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), mean2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), std1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), std2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n1: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), n2: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'mean1', label: 'Mean (Group 1)', type: 'number', step: 'any' }, { name: 'mean2', label: 'Mean (Group 2)', type: 'number', step: 'any' }, { name: 'std1', label: 'Std Dev (Group 1)', type: 'number', min: 0.001, step: 'any' }, { name: 'std2', label: 'Std Dev (Group 2)', type: 'number', min: 0.001, step: 'any' }, { name: 'n1', label: 'N (Group 1)', type: 'number', min: 2, step: '1' }, { name: 'n2', label: 'N (Group 2)', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const pooledVar = ((n(v.n1) - 1) * n(v.std1) ** 2 + (n(v.n2) - 1) * n(v.std2) ** 2) / (n(v.n1) + n(v.n2) - 2); const se = Math.sqrt(pooledVar * (1 / n(v.n1) + 1 / n(v.n2))); const t = ((n(v.mean1) - n(v.mean2))) / se; const df = n(v.n1) + n(v.n2) - 2; return { result: t, label: 't-Statistic (equal var)', unit: '', steps: [{ label: 'Difference', value: `${(n(v.mean1) - n(v.mean2)).toFixed(4)}` }, { label: 'Pooled var', value: `${pooledVar.toFixed(4)}` }, { label: 't', value: `${t.toFixed(4)}` }, { label: 'DF', value: `${df}` }] } },
  description: 'Independent t-test (Student\'s) compares means of two groups assuming equal variances.',
  formula: 't = (x̄₁ - x̄₂) / (s_p √(1/n₁ + 1/n₂))',
  interpretation: 'Assumes equal variances. If violated, use Welch\'s t-test which does not assume equal variance.'
}

export default calcDef

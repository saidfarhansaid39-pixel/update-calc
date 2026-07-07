import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ var1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), var2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n1: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), n2: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'var1', label: 'Variance 1', type: 'number', min: 0.001, step: 'any' }, { name: 'var2', label: 'Variance 2', type: 'number', min: 0.001, step: 'any' }, { name: 'n1', label: 'Sample Size 1', type: 'number', min: 2, step: '1' }, { name: 'n2', label: 'Sample Size 2', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const f = n(v.var1) / n(v.var2); const df1 = n(v.n1) - 1; const df2 = n(v.n2) - 1; return { result: f, label: 'F-Statistic', unit: '', steps: [{ label: 'F = s₁²/s₂²', value: `${f.toFixed(4)}` }, { label: 'DF (num, den)', value: `${df1}, ${df2}` }] } },
  description: 'F-test compares two variances to test if they are significantly different.',
  formula: 'F = s₁² / s₂²',
  interpretation: 'F ≈ 1 suggests equal variances. F > critical value rejects H₀ of equal variances. Used in ANOVA and equality of variance tests.'
}

export default calcDef

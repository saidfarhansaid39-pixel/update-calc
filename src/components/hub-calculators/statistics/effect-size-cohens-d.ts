import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mean1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), mean2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), sd1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sd2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n1: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), n2: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'mean1', label: 'Mean (Group 1)', type: 'number', step: 'any' }, { name: 'mean2', label: 'Mean (Group 2)', type: 'number', step: 'any' }, { name: 'sd1', label: 'Std Dev (Group 1)', type: 'number', min: 0.001, step: 'any' }, { name: 'sd2', label: 'Std Dev (Group 2)', type: 'number', min: 0.001, step: 'any' }, { name: 'n1', label: 'N (Group 1)', type: 'number', min: 2, step: '1' }, { name: 'n2', label: 'N (Group 2)', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const pooledSD = Math.sqrt(((n(v.n1) - 1) * n(v.sd1) ** 2 + (n(v.n2) - 1) * n(v.sd2) ** 2) / (n(v.n1) + n(v.n2) - 2)); const d = (n(v.mean1) - n(v.mean2)) / pooledSD; return { result: d, label: "Cohen's d", unit: '', steps: [{ label: 'Difference', value: `${(n(v.mean1) - n(v.mean2)).toFixed(4)}` }, { label: 'Pooled SD', value: `${pooledSD.toFixed(4)}` }, { label: "Cohen's d", value: `${d.toFixed(4)}` }, { label: 'Interpretation', value: Math.abs(d) >= 0.8 ? 'Large' : Math.abs(d) >= 0.5 ? 'Medium' : Math.abs(d) >= 0.2 ? 'Small' : 'Very small' }] } },
  description: "Cohen's d is a standardized measure of effect size for the difference between two group means.",
  formula: "d = (x̄₁ - x̄₂) / s_pooled, where s_pooled = √(((n₁-1)s₁² + (n₂-1)s₂²)/(n₁+n₂-2))",
  interpretation: "|d| = 0.2: small, 0.5: medium, 0.8: large. d = 1 means the groups differ by one pooled standard deviation."
}

export default calcDef

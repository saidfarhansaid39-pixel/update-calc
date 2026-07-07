import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mean1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), mean2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), sd1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sd2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n1: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), n2: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'mean1', label: 'Mean (Group 1)', type: 'number', step: 'any' }, { name: 'mean2', label: 'Mean (Group 2)', type: 'number', step: 'any' }, { name: 'sd1', label: 'Std Dev (Group 1)', type: 'number', min: 0.001, step: 'any' }, { name: 'sd2', label: 'Std Dev (Group 2)', type: 'number', min: 0.001, step: 'any' }, { name: 'n1', label: 'N (Group 1)', type: 'number', min: 2, step: '1' }, { name: 'n2', label: 'N (Group 2)', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const pooledSD = Math.sqrt(((n(v.n1) - 1) * n(v.sd1) ** 2 + (n(v.n2) - 1) * n(v.sd2) ** 2) / (n(v.n1) + n(v.n2) - 2)); const g = (n(v.mean1) - n(v.mean2)) / pooledSD; const df = n(v.n1) + n(v.n2) - 2; const c = 1 - 3 / (4 * df - 1); const gAdj = g * c; return { result: gAdj, label: "Hedges' g", unit: '', steps: [{ label: "Cohen's d", value: `${g.toFixed(4)}` }, { label: 'Correction factor', value: `${c.toFixed(4)}` }, { label: "Hedges' g", value: `${gAdj.toFixed(4)}` }, { label: 'Interpretation', value: Math.abs(gAdj) >= 0.8 ? 'Large' : Math.abs(gAdj) >= 0.5 ? 'Medium' : Math.abs(gAdj) >= 0.2 ? 'Small' : 'Very small' }] } },
  description: "Hedges' g is a standardized effect size that corrects Cohen's d for small sample bias.",
  formula: "g = d × (1 - 3/(4(n₁+n₂) - 9)), where d = (x̄₁ - x̄₂)/s_pooled",
  interpretation: "Hedges' g is preferred over Cohen's d for small samples (n < 20). The correction factor approaches 1 as n increases."
}

export default calcDef

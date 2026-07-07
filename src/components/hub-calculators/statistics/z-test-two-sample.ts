import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mean1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), mean2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), std1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), std2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n1: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), n2: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'mean1', label: 'Mean (Group 1)', type: 'number', step: 'any' }, { name: 'mean2', label: 'Mean (Group 2)', type: 'number', step: 'any' }, { name: 'std1', label: 'Std Dev (Group 1)', type: 'number', min: 0.001, step: 'any' }, { name: 'std2', label: 'Std Dev (Group 2)', type: 'number', min: 0.001, step: 'any' }, { name: 'n1', label: 'N (Group 1)', type: 'number', min: 2, step: '1' }, { name: 'n2', label: 'N (Group 2)', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const se = Math.sqrt(n(v.std1) ** 2 / n(v.n1) + n(v.std2) ** 2 / n(v.n2)); const z = ((n(v.mean1) - n(v.mean2))) / se; return { result: z, label: 'Z-Statistic', unit: '', steps: [{ label: 'Difference', value: `${(n(v.mean1) - n(v.mean2)).toFixed(4)}` }, { label: 'SE', value: `${se.toFixed(4)}` }, { label: 'z', value: `${z.toFixed(4)}` }] } },
  description: 'Two-sample z-test compares means of two independent groups when population variances are known.',
  formula: 'z = (x̄₁ - x̄₂) / √(σ₁²/n₁ + σ₂²/n₂)',
  interpretation: 'Used when both population standard deviations are known. For unknown σ, use t-test instead.'
}

export default calcDef

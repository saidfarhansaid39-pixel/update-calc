import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mean1: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), mean2: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), std1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), std2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n1: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), n2: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'mean1', label: 'Mean (Group 1)', type: 'number', step: 'any' }, { name: 'mean2', label: 'Mean (Group 2)', type: 'number', step: 'any' }, { name: 'std1', label: 'Std Dev (Group 1)', type: 'number', min: 0.001, step: 'any' }, { name: 'std2', label: 'Std Dev (Group 2)', type: 'number', min: 0.001, step: 'any' }, { name: 'n1', label: 'N (Group 1)', type: 'number', min: 2, step: '1' }, { name: 'n2', label: 'N (Group 2)', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const se = Math.sqrt(n(v.std1) ** 2 / n(v.n1) + n(v.std2) ** 2 / n(v.n2)); const t = (n(v.mean1) - n(v.mean2)) / se; const dfNum = (n(v.std1) ** 2 / n(v.n1) + n(v.std2) ** 2 / n(v.n2)) ** 2; const dfDen = ((n(v.std1) ** 2 / n(v.n1)) ** 2 / (n(v.n1) - 1)) + ((n(v.std2) ** 2 / n(v.n2)) ** 2 / (n(v.n2) - 1)); const df = Math.round(dfNum / dfDen); return { result: t, label: 't-Statistic (Welch)', unit: '', steps: [{ label: 'Difference', value: `${(n(v.mean1) - n(v.mean2)).toFixed(4)}` }, { label: 'SE', value: `${se.toFixed(4)}` }, { label: 't', value: `${t.toFixed(4)}` }, { label: 'DF (Welch)', value: `${df}` }] } },
  description: 'Two-sample t-test (Welch\'s) compares means of two independent groups assuming unequal variances.',
  formula: 't = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂)',
  interpretation: 'A significant t-value suggests the two populations have different means. Welch\'s test does not assume equal variances.'
}

export default calcDef

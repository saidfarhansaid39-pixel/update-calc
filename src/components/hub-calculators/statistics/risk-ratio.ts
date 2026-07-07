import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ exposedCases: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), exposedTotal: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), unexposedCases: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), unexposedTotal: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [{ name: 'exposedCases', label: 'Exposed + Outcome', type: 'number', min: 0, step: '1' }, { name: 'exposedTotal', label: 'Exposed Total', type: 'number', min: 1, step: '1' }, { name: 'unexposedCases', label: 'Unexposed + Outcome', type: 'number', min: 0, step: '1' }, { name: 'unexposedTotal', label: 'Unexposed Total', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const a = n(v.exposedCases); const n1 = n(v.exposedTotal); const c = n(v.unexposedCases); const n0 = n(v.unexposedTotal); const risk1 = n1 > 0 ? a / n1 : 0; const risk0 = n0 > 0 ? c / n0 : 0; const rr = risk0 > 0 ? risk1 / risk0 : 0; const logRR = Math.log(rr); const se = Math.sqrt(1 / a - 1 / n1 + 1 / c - 1 / n0); const ciLow = Math.exp(logRR - 1.96 * se); const ciHigh = Math.exp(logRR + 1.96 * se); return { result: rr, label: 'Risk Ratio', unit: '', steps: [{ label: 'Risk in exposed', value: `${(risk1 * 100).toFixed(2)}%` }, { label: 'Risk in unexposed', value: `${(risk0 * 100).toFixed(2)}%` }, { label: 'RR', value: `${rr.toFixed(4)}` }, { label: '95% CI', value: `[${ciLow.toFixed(4)}, ${ciHigh.toFixed(4)}]` }] } },
  description: 'Risk ratio (relative risk) compares the probability of an outcome between exposed and unexposed groups in cohort studies.',
  formula: 'RR = (a/n₁) / (c/n₀)',
  interpretation: 'RR > 1: increased risk with exposure, RR < 1: protective effect. RR = 1: no association.'
}

export default calcDef

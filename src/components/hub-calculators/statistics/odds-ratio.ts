import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ exposedCases: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), exposedControls: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), unexposedCases: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), unexposedControls: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [{ name: 'exposedCases', label: 'Exposed + Disease', type: 'number', min: 0, step: '1' }, { name: 'exposedControls', label: 'Exposed + No Disease', type: 'number', min: 0, step: '1' }, { name: 'unexposedCases', label: 'Unexposed + Disease', type: 'number', min: 0, step: '1' }, { name: 'unexposedControls', label: 'Unexposed + No Disease', type: 'number', min: 0, step: '1' }],
  compute: (v) => { const a = n(v.exposedCases); const b = n(v.exposedControls); const c = n(v.unexposedCases); const d = n(v.unexposedControls); const or = b > 0 && c > 0 ? (a * d) / (b * c) : 0; const logOr = Math.log(or); const se = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d); const ciLow = Math.exp(logOr - 1.96 * se); const ciHigh = Math.exp(logOr + 1.96 * se); return { result: or, label: 'Odds Ratio', unit: '', steps: [{ label: '2×2 table', value: `[[${a},${b}],[${c},${d}]]` }, { label: 'OR', value: `${or.toFixed(4)}` }, { label: '95% CI', value: `[${ciLow.toFixed(4)}, ${ciHigh.toFixed(4)}]` }] } },
  description: 'Odds ratio measures the association between exposure and outcome in case-control studies.',
  formula: 'OR = (a × d) / (b × c)',
  interpretation: 'OR > 1: positive association, OR < 1: protective effect, OR = 1: no association. OR approximates RR for rare diseases.'
}

export default calcDef

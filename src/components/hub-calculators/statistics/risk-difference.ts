import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ exposedCases: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), exposedTotal: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), unexposedCases: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), unexposedTotal: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [{ name: 'exposedCases', label: 'Exposed + Outcome', type: 'number', min: 0, step: '1' }, { name: 'exposedTotal', label: 'Exposed Total', type: 'number', min: 1, step: '1' }, { name: 'unexposedCases', label: 'Unexposed + Outcome', type: 'number', min: 0, step: '1' }, { name: 'unexposedTotal', label: 'Unexposed Total', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const a = n(v.exposedCases); const n1 = n(v.exposedTotal); const c = n(v.unexposedCases); const n0 = n(v.unexposedTotal); const risk1 = n1 > 0 ? a / n1 : 0; const risk0 = n0 > 0 ? c / n0 : 0; const rd = risk1 - risk0; const se = Math.sqrt(risk1 * (1 - risk1) / n1 + risk0 * (1 - risk0) / n0); const ciLow = rd - 1.96 * se; const ciHigh = rd + 1.96 * se; return { result: rd, label: 'Risk Difference', unit: '', steps: [{ label: 'Risk exposed', value: `${(risk1 * 100).toFixed(2)}%` }, { label: 'Risk unexposed', value: `${(risk0 * 100).toFixed(2)}%` }, { label: 'RD', value: `${(rd * 100).toFixed(2)}%` }, { label: '95% CI', value: `[${(ciLow * 100).toFixed(2)}%, ${(ciHigh * 100).toFixed(2)}%]` }] } },
  description: 'Risk difference (attributable risk) is the absolute difference in risk between exposed and unexposed groups.',
  formula: 'RD = Risk_exposed - Risk_unexposed',
  interpretation: 'RD > 0: excess risk due to exposure. Number Needed to Treat/Harm = 1/|RD|. RD has direct public health relevance.'
}

export default calcDef

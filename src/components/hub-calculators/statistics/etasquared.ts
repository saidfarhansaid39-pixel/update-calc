import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ssBetween: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), ssTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dfEffect: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1'), dfError: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1') }),
  fields: [{ name: 'ssBetween', label: 'SS (effect)', type: 'number', min: 0, step: 'any' }, { name: 'ssTotal', label: 'SS (total)', type: 'number', min: 0.001, step: 'any' }, { name: 'dfEffect', label: 'DF (effect)', type: 'number', min: 1, step: '1' }, { name: 'dfError', label: 'DF (error)', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const eta2 = n(v.ssBetween) / n(v.ssTotal); const ssError = n(v.ssTotal) - n(v.ssBetween); const partialEta2 = ssError > 0 ? n(v.ssBetween) / (n(v.ssBetween) + ssError) : 0; const omega2 = (n(v.ssBetween) - n(v.dfEffect) * (ssError / n(v.dfError))) / (n(v.ssTotal) + ssError / n(v.dfError)); return { result: eta2, label: 'η²', unit: '', steps: [{ label: 'η²', value: `${eta2.toExponential(4)}` }, { label: 'Partial η²', value: `${partialEta2.toExponential(4)}` }, { label: 'ω² (unbiased)', value: `${omega2.toExponential(4)}` }] } },
  description: 'Eta-squared measures the proportion of variance explained by an effect in ANOVA.',
  formula: 'η² = SS_effect / SS_total, Partial η² = SS_effect / (SS_effect + SS_error)',
  interpretation: 'η² = 0.01 (small), 0.06 (medium), 0.14 (large). Partial η² is preferred in multi-factor designs.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ssEffect: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), ssError: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0') }),
  fields: [{ name: 'ssEffect', label: 'SS (effect)', type: 'number', min: 0, step: 'any' }, { name: 'ssError', label: 'SS (error)', type: 'number', min: 0, step: 'any' }],
  compute: (v) => { const num = Math.max(0, n(v.ssEffect)); const den = num + n(v.ssError); const peta2 = den > 0 ? num / den : 0; return { result: peta2, label: 'Partial η²', unit: '', steps: [{ label: 'SS effect', value: `${num.toFixed(4)}` }, { label: 'SS error', value: `${n(v.ssError).toFixed(4)}` }, { label: 'Partial η²', value: `${peta2.toExponential(4)}` }, { label: 'Interpretation', value: peta2 >= 0.14 ? 'Large' : peta2 >= 0.06 ? 'Medium' : peta2 >= 0.01 ? 'Small' : 'Negligible' }] } },
  description: 'Partial eta-squared measures the proportion of variance explained by an effect after removing other effects.',
  formula: 'Partial η² = SS_effect / (SS_effect + SS_error)',
  interpretation: 'Partial η² = 0.01: small, 0.06: medium, 0.14: large. Commonly reported in ANOVA and MANOVA results.'
}

export default calcDef

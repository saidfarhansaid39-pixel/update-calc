import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ssEffect: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), ssTotal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'ssEffect', label: 'SS (effect)', type: 'number', min: 0, step: 'any' }, { name: 'ssTotal', label: 'SS (total)', type: 'number', min: 0.001, step: 'any' }],
  compute: (v) => { const eta2 = n(v.ssEffect) / n(v.ssTotal); return { result: eta2, label: 'η²', unit: '', steps: [{ label: 'SS effect', value: `${n(v.ssEffect).toFixed(4)}` }, { label: 'SS total', value: `${n(v.ssTotal).toFixed(4)}` }, { label: 'η²', value: `${eta2.toExponential(4)}` }, { label: 'Interpretation', value: eta2 >= 0.14 ? 'Large' : eta2 >= 0.06 ? 'Medium' : eta2 >= 0.01 ? 'Small' : 'Negligible' }] } },
  description: 'Eta-squared (η²) measures the proportion of total variance explained by an effect in ANOVA. It is a standardized effect size.',
  formula: 'η² = SS_effect / SS_total',
  interpretation: 'η² = 0.01: small, 0.06: medium, 0.14: large effect. Partial η² is preferred for multi-factor designs.'
}

export default calcDef

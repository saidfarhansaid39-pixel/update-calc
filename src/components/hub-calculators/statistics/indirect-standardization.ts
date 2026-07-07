import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ observed: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), expected: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'observed', label: 'Observed Cases', type: 'number', min: 0, step: '1' }, { name: 'expected', label: 'Expected Cases', type: 'number', min: 0.001, step: '0.1' }],
  compute: (v) => { const obs = n(v.observed); const exp = n(v.expected); const smr = exp > 0 ? obs / exp : 0; return { result: smr, label: 'Standardized Mortality Ratio', unit: '', steps: [{ label: 'Observed', value: `${obs}` }, { label: 'Expected', value: `${exp.toFixed(4)}` }, { label: 'SMR', value: `${smr.toFixed(4)}` }, { label: 'Interpretation', value: smr > 1 ? 'More cases than expected' : smr < 1 ? 'Fewer cases than expected' : 'Same as expected' }] } },
  description: 'Indirect standardization computes the Standardized Mortality Ratio (SMR) = observed / expected cases.',
  formula: 'SMR = Observed / Expected',
  interpretation: 'SMR > 1 indicates excess risk compared to the reference population. SMR < 1 indicates lower risk.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ exposure: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), offset: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'exposure', label: 'Event Count', type: 'number', min: 0, step: '1' }, { name: 'offset', label: 'Person-Time (offset)', type: 'number', min: 0.001, step: 'any' }],
  compute: (v) => { const events = n(v.exposure); const personTime = n(v.offset); const rate = personTime > 0 ? events / personTime : 0; const se = personTime > 0 ? Math.sqrt(events) / personTime : 0; return { result: rate, label: 'Incidence Rate', unit: '', steps: [{ label: 'Events', value: `${events}` }, { label: 'Person-time', value: `${personTime.toFixed(4)}` }, { label: 'Rate', value: `${rate.toExponential(4)}` }, { label: 'SE of log(rate)', value: `${se.toExponential(4)}` }] } },
  description: 'Poisson regression models count data and incidence rates using a log-linear relationship.',
  formula: 'log(λ) = β₀ + β₁x + log(offset), λ = expected count',
  interpretation: 'The exponentiated coefficient exp(β) is the incidence rate ratio. Assumes mean = variance (equidispersion).'
}

export default calcDef

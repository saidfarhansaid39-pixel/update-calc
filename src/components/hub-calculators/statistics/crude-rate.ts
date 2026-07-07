import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ events: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), population: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [{ name: 'events', label: 'Number of Events', type: 'number', min: 0, step: '1' }, { name: 'population', label: 'Population Size', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const events = n(v.events); const pop = n(v.population); const rate = pop > 0 ? (events / pop) * 100000 : 0; return { result: rate, label: 'Crude Rate (per 100,000)', unit: '', steps: [{ label: 'Events', value: `${events}` }, { label: 'Population', value: `${pop}` }, { label: 'Rate', value: `${rate.toFixed(4)}` }] } },
  description: 'Crude rate is the total number of events divided by the total population, often expressed per 100,000.',
  formula: 'Crude Rate = (Events / Population) × 100,000',
  interpretation: 'Crude rates do not account for age or other confounders. Standardization is needed for fair group comparisons.'
}

export default calcDef

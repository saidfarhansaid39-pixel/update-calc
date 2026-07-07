import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ crudeRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), stdPopulation: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), studyPopulation: z.string().min(1).refine(v => parseInt(v) > 0, '>0') }),
  fields: [{ name: 'crudeRate', label: 'Crude Rate (per 1000)', type: 'number', min: 0, step: '0.1' }, { name: 'stdPopulation', label: 'Standard Pop (% of total)', type: 'number', min: 1, max: 100, step: '1' }, { name: 'studyPopulation', label: 'Study Pop (% of total)', type: 'number', min: 1, max: 100, step: '1' }],
  compute: (v) => { const adjRate = n(v.crudeRate) * n(v.stdPopulation) / n(v.studyPopulation); return { result: adjRate, label: 'Directly Standardized Rate', unit: 'per 1000', steps: [{ label: 'Crude rate', value: `${n(v.crudeRate).toFixed(2)}` }, { label: 'Standardization factor', value: `${(n(v.stdPopulation) / n(v.studyPopulation)).toFixed(4)}` }, { label: 'Adjusted rate', value: `${adjRate.toFixed(4)}` }] } },
  description: 'Direct standardization adjusts crude rates to a standard population distribution, enabling fair comparisons between groups with different age structures.',
  formula: 'Adjusted Rate = Σ(crude_rate_i × std_pop_i) / Σ(study_pop_i)',
  interpretation: 'Standardized rates remove confounding by population structure. Useful for comparing mortality or disease rates across regions.'
}

export default calcDef

import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ inflation: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), outputGap: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required') }),
  fields: [{ name: 'inflation', label: 'Inflation Rate (%)', type: 'number', step: '0.1' }, { name: 'outputGap', label: 'Output Gap (%)', type: 'number', step: '0.1' }],
  compute: (v) => { const pi = n(v.inflation); const yGap = n(v.outputGap); const rStar = 2; const piStar = 2; const fedFundsRate = rStar + piStar + 0.5 * (pi - piStar) + 0.5 * yGap; return { result: fedFundsRate, label: 'Recommended Fed Funds Rate', unit: '%', steps: [{ label: 'Real neutral rate', value: `${rStar}%` }, { label: 'Inflation gap', value: `${(pi - piStar).toFixed(2)}%` }, { label: 'Output gap', value: `${yGap.toFixed(2)}%` }, { label: 'Policy rate', value: `${fedFundsRate.toFixed(2)}%` }] } },
  description: 'The Taylor Rule prescribes the federal funds rate based on inflation and output gaps relative to targets.',
  formula: 'i = r* + π* + 0.5(π - π*) + 0.5(y - y*)',
  interpretation: 'When inflation is above target, the rule recommends raising rates. When output gap is negative, it recommends lowering rates.'
}

export default calcDef

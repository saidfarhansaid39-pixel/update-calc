import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    censusN: z.string().refine(v => parseInt(v) > 0, '>0'),
    sexRatio: z.string().optional()
}),
  fields: [
    { name: 'censusN', label: 'Census Population Size (Nc)', type: 'number', min: 1, step: '1' },
    { name: 'sexRatio', label: 'Sex Ratio (M:F, optional)', type: 'number', min: 0.01, step: '0.1' },
  ],
  compute: (v) => {
    const sexRatioVal = v.sexRatio || 1
    const males = v.censusN * sexRatioVal / (1 + sexRatioVal)
    const females = v.censusN / (1 + sexRatioVal)
    const ne = v.sexRatio && v.sexRatio > 0 ? (4 * males * females) / (males + females) : v.censusN
    return {
      result: ne, label: 'Effective Population Size (Ne)', unit: 'individuals',
      steps: [
        { label: 'Census size (Nc)', value: `${v.censusN}` },
        { label: 'Sex ratio (M:F)', value: `${sexRatioVal.toFixed(1)}` },
        { label: 'Estimated Ne', value: `${Math.round(ne)}` },
        { label: 'Ne/Nc ratio', value: `${(ne / v.censusN).toFixed(3)}` },
      ]
}
  },
  description: 'Effective population size (Ne) is the size of an ideal population that would lose genetic diversity at the same rate as the actual population. Ne is usually smaller than census size.',
  formula: 'Ne = 4NmNf / (Nm + Nf) for unequal sex ratios. In general: Ne << Nc due to variance in reproductive success.',
  interpretation: 'Ne/Nc ratios are typically 0.1-0.5 in natural populations. Small Ne increases genetic drift and inbreeding. Ne > 50 needed for short-term, > 500 for long-term conservation.'
}

export default calcDef

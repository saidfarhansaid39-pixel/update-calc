import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    nests: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    successful: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    exposureDays: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'nests', label: 'Total Nests Monitored', type: 'number', min: 1, step: '1' },
    { name: 'successful', label: 'Successful Nests (≥1 fledgling)', type: 'number', min: 0, step: '1' },
    { name: 'exposureDays', label: 'Exposure Days (for Mayfield)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const apparentSuccess = v.nests > 0 ? v.successful / v.nests * 100 : 0
    let mayfieldSurvival = 0
    let mayfieldSuccess = 0
    if (v.exposureDays && v.exposureDays > 0) {
      const failures = v.nests - v.successful
      const dsr = 1 - (failures / v.exposureDays)
      mayfieldSurvival = dsr
      const nestingPeriod = 25
      mayfieldSuccess = dsr ** nestingPeriod * 100
    }
    return {
      result: apparentSuccess, label: 'Apparent Nest Success', unit: '%',
      steps: [
        { label: 'Total nests', value: `${v.nests}` },
        { label: 'Successful nests', value: `${v.successful}` },
        { label: 'Apparent success', value: `${apparentSuccess.toFixed(1)}%` },
        ...(v.exposureDays && v.exposureDays > 0 ? [
          { label: 'Exposure days', value: `${v.exposureDays}` },
          { label: 'Daily survival rate', value: mayfieldSurvival.toFixed(4) },
          { label: 'Mayfield success (25 days)', value: `${(mayfieldSuccess).toFixed(1)}%` },
        ] : []),
      ]
}
  },
  description: 'Nesting success can be calculated as apparent success (successful/total) or Mayfield method (daily survival rate accounting for exposure days for a more accurate estimate).',
  formula: 'Apparent = Successful / Total × 100% | DSR = 1 - (Failures / Exposure days) | Mayfield = DSR^Nesting period',
  interpretation: 'Mayfield method is preferred as it accounts for nests found at different stages. Apparent success overestimates true success. Typical DSR: 0.90-0.98.'
}

export default calcDef

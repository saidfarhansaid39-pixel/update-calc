import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    v1: z.string().refine(v => parseFloat(v) > 0, '>0'),
    v2: z.string().refine(v => parseFloat(v) > 0, '>0'),
    daysBetween: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'v1', label: 'Initial Volume (mm³)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'v2', label: 'Final Volume (mm³)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'daysBetween', label: 'Days Between Measurements', type: 'number', min: 0.1, step: '0.5' },
  ],
  compute: (v) => {
    const growthRate = Math.log(v.v2 / v.v1) / v.daysBetween
    const doublingTime = growthRate > 0 ? Math.LN2 / growthRate : Infinity
    return {
      result: doublingTime, label: 'Tumor Doubling Time', unit: 'days',
      steps: [
        { label: 'Initial volume', value: `${v.v1} mm³` },
        { label: 'Final volume', value: `${v.v2} mm³` },
        { label: 'Growth rate r = ln(V2/V1)/days', value: `${growthRate.toFixed(4)} day?¹` },
        { label: 'Doubling time = ln(2)/r', value: `${doublingTime === Infinity ? 'No growth' : `${doublingTime.toFixed(1)} days`}` },
        { label: 'T/C ratio', value: `Volume ratio = ${(v.v2 / v.v1).toFixed(2)}×` },
      ]
}
  },
  description: 'Tumor growth rate and doubling time quantify how quickly a tumor is growing. Exponential growth is assumed for early-stage tumors.',
  formula: 'Growth rate r = ln(V2/V1) / ?t | Doubling time = ln(2) / r | T/C = V2(treated) / V2(control)',
  interpretation: 'Shorter doubling time = faster growth (more aggressive). Human solid tumors: 30-200 days. Mouse xenografts: 2-10 days. T/C < 0.42 is considered anti-tumor activity per NCI standards.'
}

export default calcDef

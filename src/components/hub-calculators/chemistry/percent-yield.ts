import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    actual: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    theoretical: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'actual', label: 'Actual Yield', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
    { name: 'theoretical', label: 'Theoretical Yield', type: 'number', unit: 'g', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const pct = v.actual / v.theoretical * 100
    return {
      result: pct, label: 'Percent Yield', unit: '%',
      steps: [
        { label: 'Actual yield', value: `${v.actual} g` },
        { label: 'Theoretical yield', value: `${v.theoretical} g` },
        { label: '% yield = (actual / theoretical) × 100%', value: `${pct.toFixed(2)}%` },
      ]
}
  },
  description: 'Percent yield compares the actual amount of product obtained from a reaction to the theoretical maximum amount predicted by stoichiometry.',
  formula: '% yield = (actual yield / theoretical yield) × 100%',
  interpretation: 'Yields below 100% are expected due to side reactions, incomplete reactions, and purification losses. Yields above 100% indicate impurities. Good lab yields range from 60-95%.'
}

export default calcDef

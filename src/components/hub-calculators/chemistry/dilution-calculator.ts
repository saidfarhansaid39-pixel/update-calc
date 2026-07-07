import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    c1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'c1', label: 'Initial Concentration', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'v1', label: 'Initial Volume', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
    { name: 'v2', label: 'Final Volume', type: 'number', unit: 'mL', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const c2 = v.c1 * v.v1 / v.v2
    return {
      result: c2, label: 'Final Concentration', unit: 'M',
      steps: [
        { label: 'C₁', value: `${v.c1} M` },
        { label: 'V₁', value: `${v.v1} mL` },
        { label: 'V₂', value: `${v.v2} mL` },
        { label: 'C₂ = C₁ × V₁ / V₂', value: `${c2.toFixed(4)} M` },
        { label: 'Dilution factor', value: `${(v.v2 / v.v1).toFixed(1)}×` },
      ]
}
  },
  description: 'Dilution calculations use the formula C₁V₁ = C₂V₂, which states that the amount of solute remains constant during dilution.',
  formula: 'C₁V₁ = C₂V₂',
  interpretation: 'The dilution factor is V₂/V₁. For example, diluting 100 mL of 1 M solution to 200 mL gives 0.5 M (2× dilution).'
}

export default calcDef

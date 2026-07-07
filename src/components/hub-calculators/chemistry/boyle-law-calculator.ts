import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    p1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    v2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'p1', label: 'Initial Pressure P₁', type: 'number', unit: 'atm', min: 0.001, step: '0.001' },
    { name: 'v1', label: 'Initial Volume V₁', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
    { name: 'v2', label: 'Final Volume V₂', type: 'number', unit: 'L', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const p2 = v.p1 * v.v1 / v.v2
    return {
      result: p2, label: 'Final Pressure P₂', unit: 'atm',
      steps: [
        { label: 'P₁', value: `${v.p1} atm` },
        { label: 'V₁', value: `${v.v1} L` },
        { label: 'V₂', value: `${v.v2} L` },
        { label: 'P₂ = P₁V₁/V₂', value: `${p2.toFixed(4)} atm` },
        { label: 'Relationship', value: v.v2 > v.v1 ? 'Volume increases, pressure decreases' : 'Volume decreases, pressure increases' },
      ]
}
  },
  description: 'Boyle\'s Law states that for a fixed amount of gas at constant temperature, pressure is inversely proportional to volume.',
  formula: 'P₁V₁ = P₂V₂',
  interpretation: 'When volume doubles, pressure halves (at constant temperature and moles). This inverse relationship is fundamental to gas behavior and pneumatic systems.'
}

export default calcDef

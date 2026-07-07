import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    pTotal: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    p1: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    p2: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'pTotal', label: 'Total Pressure P(total)', type: 'number', unit: 'atm', min: 0.001, step: '0.001' },
    { name: 'p1', label: 'Partial Pressure P₁', type: 'number', unit: 'atm', min: 0.001, step: '0.001' },
    { name: 'p2', label: 'Partial Pressure P₂', type: 'number', unit: 'atm', min: 0.001, step: '0.001' },
  ],
  compute: (v) => {
    const p3 = v.pTotal - v.p1 - v.p2
    const moleFrac1 = v.p1 / v.pTotal
    const moleFrac2 = v.p2 / v.pTotal
    return {
      result: p3, label: 'Remaining Partial Pressure', unit: 'atm',
      steps: [
        { label: 'P(total)', value: `${v.pTotal} atm` },
        { label: 'P₁', value: `${v.p1} atm` },
        { label: 'P₂', value: `${v.p2} atm` },
        { label: 'P₃ = P(total) - P₁ - P₂', value: `${p3.toFixed(4)} atm` },
        { label: 'Mole fraction P₁', value: `${(moleFrac1 * 100).toFixed(1)}%` },
        { label: 'Mole fraction P₂', value: `${(moleFrac2 * 100).toFixed(1)}%` },
      ]
}
  },
  description: 'Dalton\'s Law of Partial Pressures states that the total pressure of a gas mixture equals the sum of the partial pressures of each individual gas.',
  formula: 'P(total) = ΣPᵢ',
  interpretation: 'Each gas in a mixture exerts pressure independently. The partial pressure of a gas is proportional to its mole fraction: Pᵢ = Xᵢ × P(total). This is how breathing works.'
}

export default calcDef

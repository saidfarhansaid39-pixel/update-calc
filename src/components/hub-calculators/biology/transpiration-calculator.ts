import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    leafArea: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    stomatalConductance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    vpd: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'leafArea', label: 'Leaf Area', type: 'number', unit: 'm²', min: 0.001, step: '0.001' },
    { name: 'stomatalConductance', label: 'Stomatal (gs)', type: 'number', unit: 'mol·m?²·s?¹', min: 0.01, step: '0.01' },
    { name: 'vpd', label: 'VPD (Vapor Pressure Deficit)', type: 'number', unit: 'kPa', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const rate = v.stomatalConductance * v.vpd * v.leafArea * 18 * 1e-3
    return {
      result: rate, label: 'Transpiration Rate', unit: 'g·h?¹',
      steps: [
        { label: 'Leaf area', value: `${v.leafArea} m²` },
        { label: 'gs', value: `${v.stomatalConductance} mol·m?²·s?¹` },
        { label: 'VPD', value: `${v.vpd} kPa` },
        { label: 'Transpiration rate', value: `${rate.toFixed(2)} g·h?¹` },
      ]
}
  },
  description: 'Transpiration is the loss of water vapor from plant leaves through stomata. It drives water and nutrient transport from roots to shoots.',
  formula: 'E = gs × VPD × Leaf Area × 18 g/mol (× 10?³ for conversion)',
  interpretation: 'High VPD (dry air) increases transpiration but can cause stomatal closure. Optimal transpiration balances CO2 uptake with water conservation.'
}

export default calcDef

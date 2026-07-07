import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    material: z.string(),
    kg: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'material', label: 'Material Type', type: 'select', options: [
      { label: 'Aluminum', value: 'aluminum' },
      { label: 'Paper / cardboard', value: 'paper' },
      { label: 'Glass', value: 'glass' },
      { label: 'Plastic', value: 'plastic' },
      { label: 'Steel / tin', value: 'steel' },
      { label: 'Electronics', value: 'electronics' },
    ] },
    { name: 'kg', label: 'Amount Recycled', type: 'number', unit: 'kg', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const savings: Record<string, number> = { aluminum: 12, paper: 1.5, glass: 0.6, plastic: 3, steel: 2.5, electronics: 20 }
    const co2Saved = (savings[v.material] || 1) * v.kg
    return {
      result: co2Saved, label: 'CO₂ Saved by Recycling', unit: 'kg',
      steps: [
        { label: 'Material', value: `${v.material}` },
        { label: 'Amount recycled', value: `${v.kg} kg` },
        { label: 'CO₂ saved per kg', value: `${savings[v.material] || 1} kg` },
        { label: 'Total CO₂ saved', value: `${co2Saved.toFixed(1)} kg` },
        { label: 'Equivalent to', value: `${(co2Saved / 8.887).toFixed(1)} gallons of gasoline not burned` },
      ]
}
  },
  description: 'Recycling saves CO₂ emissions compared to producing new materials from virgin resources. Aluminum recycling saves the most CO₂ per kg.',
  formula: 'CO₂ Saved = Amount × Savings Factor | Aluminum: 12, Steel: 2.5, Plastic: 3, Paper: 1.5, Glass: 0.6 kg CO₂/kg',
  interpretation: 'Recycling 1 kg of aluminum saves 12 kg CO₂ — enough to power a laptop for 30 hours. Recycling 1 ton of paper saves 17 trees and 1.5 tons CO₂.'
}

export default calcDef

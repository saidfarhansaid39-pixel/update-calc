import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ floorLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), floorWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), materialPricePerSqFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wastePercent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'floorLength', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'floorWidth', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'materialPricePerSqFt', label: 'Material Price per Sq Ft ($)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'wastePercent', label: 'Waste Factor (%)', type: 'number', min: 0, max: 30, step: '1' },
  ],
  compute: (v) => {
    const area = v.floorLength * v.floorWidth
    const wasteAmount = area * (v.wastePercent / 100)
    const totalSqFt = area + wasteAmount
    const materialCost = totalSqFt * v.materialPricePerSqFt
    return { result: materialCost, label: 'Total Material Cost', unit: '$', steps: [{ label: 'Room Area', value: `${area.toFixed(1)} sq ft` }, { label: 'Waste Allowance', value: `${wasteAmount.toFixed(1)} sq ft` }, { label: 'Total to Buy', value: `${totalSqFt.toFixed(1)} sq ft` }, { label: 'Material Cost', value: `$${materialCost.toFixed(2)}` }] }
  },
  description: 'Calculate flooring material quantities and costs including waste factor. Supports any room shape and material type.',
  formula: 'Total Sq Ft = (L × W) × (1 + Waste%) | Cost = Total Sq Ft × Price/sq ft',
  interpretation: 'Add 5-10% waste for straight layouts, 10-15% for diagonal or complex patterns. Hardwood costs $5-15/sq ft, laminate $2-5, tile $3-10, carpet $2-8 installed.'
}

export default calcDef

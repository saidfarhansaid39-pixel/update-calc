import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ boxes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), furniture: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), largeItems: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), monthsNeeded: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerMonth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'boxes', label: 'Number of Boxes', type: 'number', min: 0, step: '5' },
    { name: 'furniture', label: 'Furniture Pieces', type: 'number', min: 0, step: '1' },
    { name: 'largeItems', label: 'Large/Appliances Items', type: 'number', min: 0, step: '1' },
    { name: 'monthsNeeded', label: 'Months of Storage Needed', type: 'number', min: 1, step: '1' },
    { name: 'costPerMonth', label: 'Monthly Storage Cost ($)', type: 'number', min: 10, step: '25' },
  ],
  compute: (v) => {
    const boxSqft = v.boxes * 0.5
    const furnitureSqft = v.furniture * 4
    const largeSqft = v.largeItems * 8
    const totalSqft = boxSqft + furnitureSqft + largeSqft
    const totalCost = v.costPerMonth * v.monthsNeeded
    const recommendedUnit = totalSqft <= 25 ? '5×5 (25 sq ft)' : totalSqft <= 50 ? '5×10 (50 sq ft)' : totalSqft <= 100 ? '10×10 (100 sq ft)' : '10×15+ (150+ sq ft)'
    return { result: totalSqft, label: 'Storage Space Needed', unit: 'sq ft', steps: [{ label: 'Boxes', value: `${v.boxes} × 0.5 sq ft = ${boxSqft.toFixed(1)} sq ft` }, { label: 'Furniture', value: `${v.furniture} × 4 sq ft = ${furnitureSqft.toFixed(1)} sq ft` }, { label: 'Large Items', value: `${v.largeItems} × 8 sq ft = ${largeSqft.toFixed(1)} sq ft` }, { label: 'Total Space', value: `${totalSqft.toFixed(1)} sq ft` }, { label: 'Recommended Unit', value: recommendedUnit }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)} (${v.monthsNeeded} mo × $${v.costPerMonth.toFixed(2)})` }] }
  },
  description: 'Estimate storage unit size needed based on boxes, furniture, and large items. Get cost projections and unit size recommendations.',
  formula: 'SqFt = Boxes×0.5 + Furniture×4 + Large×8 | TotalCost = Months × MonthlyRate',
  interpretation: '5×5 unit: dorm room/studio items. 5×10: 1-bedroom apartment. 10×10: 2-bedroom. 10×15: 3-bedroom house. 10×20: full house. Leave a walking path. Climate control adds 20-40% to monthly cost.'
}

export default calcDef

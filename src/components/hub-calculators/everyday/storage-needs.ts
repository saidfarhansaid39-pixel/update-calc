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
  defaults: { boxes: '15', furniture: '5', largeItems: '2', monthsNeeded: '6', costPerMonth: '150' },
  presets: [
    { label: 'College Student', values: { boxes: '8', furniture: '3', largeItems: '1', monthsNeeded: '4', costPerMonth: '80' } },
    { label: 'Apartment to House', values: { boxes: '20', furniture: '8', largeItems: '3', monthsNeeded: '3', costPerMonth: '200' } },
    { label: 'Home Renovation', values: { boxes: '30', furniture: '12', largeItems: '5', monthsNeeded: '4', costPerMonth: '250' } },
    { label: 'Downsizing Senior', values: { boxes: '40', furniture: '15', largeItems: '4', monthsNeeded: '12', costPerMonth: '180' } },
  ],
  compute: (v) => {
    const boxSqft = v.boxes * 0.5
    const furnitureSqft = v.furniture * 4
    const largeSqft = v.largeItems * 8
    const totalSqft = boxSqft + furnitureSqft + largeSqft
    const totalCost = v.costPerMonth * v.monthsNeeded
    const recommendedUnit = totalSqft <= 25 ? '5×5 (25 sq ft)' : totalSqft <= 50 ? '5×10 (50 sq ft)' : totalSqft <= 100 ? '10×10 (100 sq ft)' : '10×15+ (150+ sq ft)'
    return { result: totalSqft, label: 'Storage Space Needed', unit: 'sq ft', steps: [{ label: 'Boxes', value: `${v.boxes} × 0.5 sq ft = ${boxSqft.toFixed(1)} sq ft` }, { label: 'Furniture', value: `${v.furniture} × 4 sq ft = ${furnitureSqft.toFixed(1)} sq ft` }, { label: 'Large Items', value: `${v.largeItems} × 8 sq ft = ${largeSqft.toFixed(1)} sq ft` }, { label: 'Total Space', value: `${totalSqft.toFixed(1)} sq ft` }, { label: 'Recommended Unit', value: recommendedUnit }, { label: 'Total Cost', value: `$${totalCost.toFixed(2)} (${v.monthsNeeded} mo × $${v.costPerMonth.toFixed(2)})` }] ,
    extras: [
      { label: 'Unit Size Guide', value: '5×5 (25 sq ft): dorm/studio items. 5×10 (50 sq ft): 1-bedroom apt. 10×10 (100 sq ft): 2-bedroom. 10×15 (150 sq ft): 3-bedroom. 10×20 (200 sq ft): full house' },
      { label: 'Space Estimation Tips', value: 'Standard box: 0.5 sq ft. Armchair/desk: 4 sq ft. Sofa/dresser: 6 sq ft. Bed frame: 8 sq ft. Appliance (fridge/washer): 8 sq ft' },
      { label: 'Vertical Stacking', value: 'Most units have 8-10 ft ceilings. Stack boxes to the ceiling — a 5×10 unit with 8 ft ceilings has 400 cubic ft of usable space' },
      { label: 'Walking Path Required', value: 'Leave at least 3 ft walking path for access. A 10×10 unit actually provides ~70 sq ft of usable storage, not 100 sq ft' },
      { label: 'Cost-Benefit Check', value: 'Estimate replacement value of stored items. If it costs $1,800/yr to store items worth less, consider selling or donating' },
      { label: 'Seasonal Item Strategy', value: 'Store seasonal items (holiday decor, winter clothes) on top or in back. Keep frequently accessed items near the front' },
      { label: 'Climate Control Factor', value: `Add 20-40% to monthly cost for climate control. ${v.monthsNeeded} months at $${v.costPerMonth.toFixed(2)} = $${(v.costPerMonth * v.monthsNeeded * 0.3).toFixed(2)} extra for climate control` },
    ]}
  },
  description: 'Determine the optimal storage unit size based on your boxes, furniture pieces, and large appliances. Get cost projections and specific unit size recommendations.',
  formula: 'TotalSqFt = Boxes × 0.5 + Furniture × 4 + LargeItems × 8. TotalCost = MonthsNeeded × MonthlyRate. Unit recommendation thresholds: 25, 50, 100, 150+ sq ft.',
  interpretation: 'A 5×5 unit fits a dorm room or studio apartment contents. A 5×10 fits a 1-bedroom apartment. A 10×10 fits a 2-bedroom home. A 10×15+ fits a 3-4 bedroom house. The average storage rental lasts 12-18 months, so a 10×10 unit at $150/mo costs $1,800-2,700 total. Before committing, consider selling items you haven\'t used in 6+ months — the storage cost often exceeds the replacement value. Pack efficiently using uniform box sizes and maximize vertical space with shelving.'
}

export default calcDef

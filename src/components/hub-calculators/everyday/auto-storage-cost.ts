import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ascUnitSize: z.string().min(1), ascMonthCount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ascClimateControl: z.string().min(1), ascInsuranceMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ascAccess24hr: z.string().min(1) }),
  fields: [
    { name: 'ascUnitSize', label: 'Unit Size', type: 'select', options: [{ label: 'Small (5×5) - Closet', value: '5x5' }, { label: 'Medium (5×10) - 1BR Apt', value: '5x10' }, { label: 'Large (10×10) - 2BR Apt', value: '10x10' }, { label: 'Extra Large (10×15) - 3BR House', value: '10x15' }, { label: 'Jumbo (10×20) - Full House', value: '10x20' }, { label: 'Super Jumbo (10×30) - Large House', value: '10x30' }] },
    { name: 'ascMonthCount', label: 'Months of Storage', type: 'number', min: 1, step: '1' },
    { name: 'ascClimateControl', label: 'Climate Control', type: 'select', options: [{ label: 'No (standard)', value: 'no' }, { label: 'Yes (+20%)', value: 'yes' }] },
    { name: 'ascInsuranceMonthly', label: 'Insurance per Month ($)', type: 'number', min: 0, step: '5' },
    { name: 'ascAccess24hr', label: '24/7 Access', type: 'select', options: [{ label: 'No (standard hours)', value: 'no' }, { label: 'Yes (+$10/mo)', value: 'yes' }] },
  ],
  defaults: { ascUnitSize: '5x10', ascMonthCount: '6', ascClimateControl: 'no', ascInsuranceMonthly: '10', ascAccess24hr: 'no' },
  presets: [
    { label: 'College Student Summer', values: { ascUnitSize: '5x5', ascMonthCount: '3', ascClimateControl: 'no', ascInsuranceMonthly: '5', ascAccess24hr: 'no' } },
    { label: 'Home Renovation (6 months)', values: { ascUnitSize: '10x10', ascMonthCount: '6', ascClimateControl: 'no', ascInsuranceMonthly: '10', ascAccess24hr: 'yes' } },
    { label: 'Moving Overseas (12 months)', values: { ascUnitSize: '5x10', ascMonthCount: '12', ascClimateControl: 'yes', ascInsuranceMonthly: '15', ascAccess24hr: 'no' } },
    { label: 'Full-House Downsizing', values: { ascUnitSize: '10x20', ascMonthCount: '9', ascClimateControl: 'yes', ascInsuranceMonthly: '15', ascAccess24hr: 'yes' } },
  ],
  compute: (v) => {
    const baseRates: Record<string, number> = { '5x5': 45, '5x10': 65, '10x10': 95, '10x15': 130, '10x20': 170, '10x30': 250 }
    const baseRate = baseRates[v.ascUnitSize] || 95
    const climateAdj = v.ascClimateControl === 'yes' ? 1.2 : 1
    const accessAdj = v.ascAccess24hr === 'yes' ? 10 : 0
    const monthlyRate = baseRate * climateAdj + v.ascInsuranceMonthly + accessAdj
    const adminFee = 25
    const lockFee = 12
    const firstMonth = monthlyRate + adminFee + lockFee
    const totalBill = firstMonth + monthlyRate * (v.ascMonthCount - 1)
    const averageMonthly = totalBill / v.ascMonthCount
    const annualRate = monthlyRate * 12
    return { result: averageMonthly, label: 'Average Monthly Cost', unit: '$', steps: [
      { label: 'Base Rate', value: `${v.ascUnitSize} unit: $${baseRate.toFixed(2)}/mo` },
      { label: 'Climate Control (20%)', value: `$${baseRate.toFixed(2)} × ${climateAdj.toFixed(1)} = $${(baseRate * climateAdj).toFixed(2)}` },
      { label: 'Insurance + 24/7 Access', value: `$${v.ascInsuranceMonthly.toFixed(2)} + $${accessAdj.toFixed(2)} = $${(v.ascInsuranceMonthly + accessAdj).toFixed(2)}` },
      { label: 'Monthly Rate', value: `$${(baseRate * climateAdj).toFixed(2)} + $${(v.ascInsuranceMonthly + accessAdj).toFixed(2)} = $${monthlyRate.toFixed(2)}` },
      { label: 'First Month Fees', value: `$${monthlyRate.toFixed(2)} base + $${adminFee.toFixed(2)} admin + $${lockFee.toFixed(2)} lock = $${firstMonth.toFixed(2)}` },
      { label: 'Remaining Months', value: `${v.ascMonthCount - 1} mo × $${monthlyRate.toFixed(2)} = $${(monthlyRate * (v.ascMonthCount - 1)).toFixed(2)}` },
      { label: 'Total Bill', value: `$${firstMonth.toFixed(2)} + $${(monthlyRate * (v.ascMonthCount - 1)).toFixed(2)} = $${totalBill.toFixed(2)}` },
      { label: 'Average per Month', value: `$${totalBill.toFixed(2)} ÷ ${v.ascMonthCount} = $${averageMonthly.toFixed(2)}` },
      { label: 'Annual Rate (if continued)', value: `$${monthlyRate.toFixed(2)} × 12 = $${annualRate.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Size recommendation", value: "5×5 (45 sqft): boxes only, dorm room. 5×10 (50 sqft): 1BR apartment furniture. 10×10 (100 sqft): 2BR apt. 10×15 (150 sqft): 3BR house. 10×20 (200 sqft): full 4BR house. 10×30 (300 sqft): large house + garage. Pick 1 size up if you're unsure." },
      { label: "Climate control: when it matters", value: "Standard range: 55–85°F. Climate control keeps 60–80°F year-round. Essential for: wood (prevents warping), electronics (prevents solder cracks), photos/documents (prevents yellowing), wine (prevents cork damage). Skip for: metal tools, plastic bins, canned goods." },
      { label: "First-month cost breakdown", value: "Admin fee ($15–35) covers paperwork/account setup. Lock fee ($8–15) gets you a new disc lock (many facilities require their specific lock). Some facilities also charge a $20–50 refundable deposit." },
      { label: "Insurance: what's covered", value: "Your homeowner's/renter's insurance typically covers stored items at 10% of contents value (~$3,000–10,000). Facility insurance ($10–15/mo) covers $2,000–5,000. For valuable items ($20K+), buy a separate inland marine policy." },
      { label: "24/7 access trade-offs", value: "24/7 access (+$10/mo) adds $120/year. Standard hours (typically 6am–9pm) are sufficient for most. Consider: do you need to access your storage during work hours? If not, save the $120/year." },
      { label: "Packing to minimize size", value: "A 10×10 unit holds a 2BR apartment IF packed efficiently. Disassemble bed frames, use uniform 1.5 cu ft boxes, stack vertically, and place heavy items at the bottom. Leave a walking path down the center." },
      { label: "Long-term discount negotiation", value: "Facilities expect negotiation for 6+ month commitments. Ask for: 1 month free on 12-month lease, 10–15% off published rate, waived admin fee. Online-only deals are often 20–30% cheaper than walk-in rates." },
      { label: "Seasonal pricing patterns", value: "Summer (May–August) is peak moving season — rates are 15–25% higher and availability is tight. Winter (November–February) has the best deals: 20–40% off, free first month, and flexible terms. If possible, rent in the off-season." },
    ]}
  },
  description: 'Estimate self-storage costs for any unit size — from a closet-sized 5×5 to a jumbo 10×30 for a full house. Includes climate control, insurance, 24/7 access, and first-month admin + lock fees.',
  formula: 'Monthly = Base × ClimateAdj + Insurance + Access | FirstMonth = Monthly + Admin + Lock | AvgMonthly = (FirstMonth + Monthly × (Months-1)) ÷ Months',
  interpretation: 'A 5×5 unit for 3 months (student storage): ~$60/mo average ($180 total). A 10×10 unit for 6 months with 24/7 access: ~$120/mo ($723 total). A climate-controlled 10×20 for 9 months: ~$215/mo ($1,938 total). Shop around: same-size units vary 30%+ between facilities.'
}

export default calcDef

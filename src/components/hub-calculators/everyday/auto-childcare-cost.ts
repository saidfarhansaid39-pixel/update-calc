import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ childAgeMonths: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), childDaysPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), childHoursPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), childCareType: z.string().min(1), childSiblingDiscount: z.string().min(1) }),
  fields: [
    { name: 'childAgeMonths', label: 'Child Age (months)', type: 'number', min: 0, step: '3' },
    { name: 'childDaysPerWeek', label: 'Days per Week', type: 'number', min: 1, max: 7, step: '1' },
    { name: 'childHoursPerDay', label: 'Hours per Day', type: 'number', min: 2, step: '1' },
    { name: 'childCareType', label: 'Care Type', type: 'select', options: [{ label: 'Daycare Center', value: 'center' }, { label: 'Family Home Daycare', value: 'family' }, { label: 'Nanny (private)', value: 'nanny' }, { label: 'Au Pair', value: 'aupair' }, { label: 'Preschool', value: 'preschool' }] },
    { name: 'childSiblingDiscount', label: 'Sibling Discount', type: 'select', options: [{ label: 'No siblings', value: 'none' }, { label: '10% sibling discount', value: 'pct10' }, { label: '15% sibling discount', value: 'pct15' }] },
  ],
  defaults: { childAgeMonths: '18', childDaysPerWeek: '5', childHoursPerDay: '8', childCareType: 'center', childSiblingDiscount: 'none' },
  presets: [
    { label: 'Infant at Daycare (6mo)', values: { childAgeMonths: '6', childDaysPerWeek: '5', childHoursPerDay: '9', childCareType: 'center', childSiblingDiscount: 'none' } },
    { label: 'Toddler with Nanny (2yr)', values: { childAgeMonths: '24', childDaysPerWeek: '4', childHoursPerDay: '8', childCareType: 'nanny', childSiblingDiscount: 'none' } },
    { label: 'Preschooler (4yr, part-time)', values: { childAgeMonths: '48', childDaysPerWeek: '3', childHoursPerDay: '5', childCareType: 'preschool', childSiblingDiscount: 'none' } },
    { label: 'Two Kids with Sibling Discount', values: { childAgeMonths: '18', childDaysPerWeek: '5', childHoursPerDay: '8', childCareType: 'center', childSiblingDiscount: 'pct10' } },
  ],
  compute: (v) => {
    const rates: Record<string, number> = { center: 12, family: 9, nanny: 22, aupair: 8, preschool: 10 }
    const baseHourly = rates[v.childCareType] || 12
    const ageSurcharge = v.childAgeMonths < 12 ? 1.2 : v.childAgeMonths < 24 ? 1.1 : 1
    const adjustedHourly = baseHourly * ageSurcharge
    const weeklyCost = adjustedHourly * v.childHoursPerDay * v.childDaysPerWeek
    const monthlyCost = weeklyCost * 4.33
    const siblingPct = v.childSiblingDiscount === 'pct10' ? 0.9 : v.childSiblingDiscount === 'pct15' ? 0.85 : 1
    const annualCost = monthlyCost * 12 * siblingPct
    const hourlyWithDiscount = adjustedHourly * siblingPct
    const pctOfIncome = monthlyCost / 5000 * 100
    return { result: monthlyCost, label: 'Monthly Childcare Cost', unit: '$', steps: [
      { label: '1. Base hourly rate', value: `$${baseHourly.toFixed(2)}/hr (${v.childCareType})` },
      { label: '2. Age adjustment factor', value: v.childAgeMonths < 12 ? 'Infant (<12mo): 1.2×' : v.childAgeMonths < 24 ? 'Toddler (12-24mo): 1.1×' : 'Child (>24mo): 1.0×' },
      { label: '3. Adjusted hourly rate', value: `$${baseHourly.toFixed(2)} × ${ageSurcharge.toFixed(1)} = $${adjustedHourly.toFixed(2)}/hr` },
      { label: '4. Weekly cost', value: `$${adjustedHourly.toFixed(2)} × ${v.childHoursPerDay} hrs × ${v.childDaysPerWeek} days = $${weeklyCost.toFixed(2)}` },
      { label: '5. Monthly cost (4.33 wks)', value: `$${weeklyCost.toFixed(2)} × 4.33 = $${monthlyCost.toFixed(2)}` },
      { label: '6. Sibling discount applied', value: v.childSiblingDiscount === 'none' ? 'None' : `${v.childSiblingDiscount === 'pct10' ? '10%' : '15%'} off → $${monthlyCost.toFixed(2)} × ${siblingPct.toFixed(2)} = $${(monthlyCost * siblingPct).toFixed(2)}` },
      { label: '7. Annual cost', value: v.childSiblingDiscount === 'none' ? `$${monthlyCost.toFixed(2)} × 12 = $${annualCost.toFixed(2)}` : `$${(monthlyCost * siblingPct).toFixed(2)} × 12 = $${annualCost.toFixed(2)}` },
      { label: '8. % of median income ($5k/mo)', value: `$${monthlyCost.toFixed(2)} ÷ $5,000 = ${pctOfIncome.toFixed(0)}%` },
    ] ,
    extras: [
      { label: "Care Type Cost Comparison", value: "Family daycare home: $7-10/hr. Daycare center: $10-15/hr. Nanny (private): $18-28/hr + payroll taxes. Au Pair: $8-10/hr (live-in, 45 hrs/wk max). Preschool: $8-12/hr (typically half-day)." },
      { label: "Infant Premium", value: "Infants under 12 months cost 15-25% more due to lower staff-to-infant ratios (1:3 vs 1:6 for toddlers). Many centers have waitlists 6-12 months for infant spots." },
      { label: "Sibling Discounts", value: "Many centers offer 5-15% sibling discounts. Family daycares are more flexible. Nanny agencies typically don't offer sibling discounts but the per-child cost drops significantly (nanny for 2 kids costs ~$25-30/hr total)." },
      { label: "Hidden Costs", value: "Registration fees ($50-200/yr), supply fees ($25-100/yr), late pickup penalties ($1-5/min), field trips ($10-50/event), meals/snacks ($5-15/day if not included). Always ask for full fee schedule." },
      { label: "Tax Benefits", value: "Child and Dependent Care Tax Credit covers up to $3,000 (1 child) or $6,000 (2+) of qualifying expenses. Dependent Care FSA allows up to $5,000 pre-tax. Both significantly reduce net cost." },
      { label: "Staff Ratio Requirements", value: "Infants (<12mo): 1 staff per 3-4 children. Toddlers (12-24mo): 1:5. Preschool (3-5yr): 1:8-10. Ratios vary by state. Lower ratios = higher quality, higher cost." },
      { label: "Waitlist Strategy", value: "Apply to 3-5 centers 3-6 months before needed. Infant spots are most competitive (6-12 month waits common). Visit unannounced and check for cleanliness, staff engagement, and safety." },
      { label: "Nanny vs Daycare Math", value: "Nanny: $22/hr × 40 hrs × 52 wks = $45,760/yr + payroll taxes (~$3,500) = ~$49,000. Daycare: $1,200/mo × 12 = $14,400. Nanny for 2 kids becomes competitive with 2x daycare costs but offers 1-on-1 care." },
    ]}
  },
  description: 'Estimate childcare costs based on child age, care type, hours per day, days per week, and sibling discounts. Compares center, family daycare, nanny, au pair, and preschool.',
  formula: 'Monthly = (Base Rate × Age Factor × Hours/Day × Days/Week) × 4.33 × Sibling Discount | Annual = Monthly × 12 × Disc',
  interpretation: 'Infants cost 20% more than toddlers. Daycare center: $900-1,700/mo. Nanny: $2,500-4,500/mo. Au Pair: $800-1,200/mo. Waitlist infants 6-12 months ahead. Use pre-tax FSA/CDCTC to save $1,000-2,000/yr.'
}

export default calcDef

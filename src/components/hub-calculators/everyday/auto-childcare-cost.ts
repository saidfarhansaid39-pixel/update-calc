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
  compute: (v) => {
    const rates: Record<string, number> = { center: 12, family: 9, nanny: 22, aupair: 8, preschool: 10 }
    const baseHourly = rates[v.childCareType] || 12
    const ageSurcharge = v.childAgeMonths < 12 ? 1.2 : v.childAgeMonths < 24 ? 1.1 : 1
    const adjustedHourly = baseHourly * ageSurcharge
    const weeklyCost = adjustedHourly * v.childHoursPerDay * v.childDaysPerWeek
    const monthlyCost = weeklyCost * 4.33
    const siblingPct = v.childSiblingDiscount === 'pct10' ? 0.9 : v.childSiblingDiscount === 'pct15' ? 0.85 : 1
    const annualCost = monthlyCost * 12 * siblingPct
    return { result: monthlyCost, label: 'Monthly Childcare Cost', unit: '$', steps: [{ label: 'Base Hourly Rate', value: `$${baseHourly.toFixed(2)}/hr` }, { label: 'Age Adjustment', value: `${ageSurcharge.toFixed(1)}×` }, { label: 'Adjusted Hourly', value: `$${adjustedHourly.toFixed(2)}/hr` }, { label: 'Weekly Cost', value: `$${weeklyCost.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }, { label: 'Annual (with sibling)', value: `$${annualCost.toFixed(2)}` }] }
  },
  description: 'Estimate childcare costs based on child age, care type, hours needed, and sibling discounts. Compare daycare, nanny, and au pair options.',
  formula: 'Monthly = (Rate × Age Factor × Hours/Day × Days/Week) × 4.33',
  interpretation: 'Infants (<12mo) cost 20% more than toddlers. Daycare: $800-1500/mo, Nanny: $2500-4000/mo, Au Pair: $800-1000/mo. Childcare is often the single largest family expense after housing.'
}

export default calcDef

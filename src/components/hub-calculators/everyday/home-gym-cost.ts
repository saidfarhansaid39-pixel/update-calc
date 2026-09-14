import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homeGymBudget: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cardioEquip: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), strengthEquip: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), accessoryBudget: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), gymLifeYears: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'homeGymBudget', label: 'Total Budget ($)', type: 'number', min: 100, step: '100' },
    { name: 'cardioEquip', label: 'Cardio Equipment ($)', type: 'number', min: 0, step: '100' },
    { name: 'strengthEquip', label: 'Strength Equipment ($)', type: 'number', min: 0, step: '100' },
    { name: 'accessoryBudget', label: 'Accessories ($)', type: 'number', min: 0, step: '50' },
    { name: 'gymLifeYears', label: 'Equipment Lifespan (years)', type: 'number', min: 1, step: '1' },
  ],
  defaults: { homeGymBudget: "2000", cardioEquip: "600", strengthEquip: "1000", accessoryBudget: "200", gymLifeYears: "10" },
  presets: [
    { label: "Minimalist (Dumbbells + Bench)", values: { homeGymBudget: "500", cardioEquip: "0", strengthEquip: "350", accessoryBudget: "100", gymLifeYears: "10" } },
    { label: "Mid-Range Garage Gym", values: { homeGymBudget: "2500", cardioEquip: "400", strengthEquip: "1600", accessoryBudget: "300", gymLifeYears: "15" } },
    { label: "Premium Home Gym", values: { homeGymBudget: "5000", cardioEquip: "1500", strengthEquip: "2500", accessoryBudget: "500", gymLifeYears: "15" } },
    { label: "Cardio-Focused Setup", values: { homeGymBudget: "3000", cardioEquip: "2000", strengthEquip: "600", accessoryBudget: "200", gymLifeYears: "10" } },
  ],
  compute: (v) => {
    const totalCost = v.cardioEquip + v.strengthEquip + v.accessoryBudget
    const remaining = v.homeGymBudget - totalCost
    const annualCost = totalCost / v.gymLifeYears
    const monthlyCost = annualCost / 12
    const vsGymMonthly = 50
    const vsGymMembership = v.gymLifeYears * 12 * vsGymMonthly
    const savings = vsGymMembership - totalCost
    const breakEvenMonths = vsGymMonthly > 0 ? totalCost / vsGymMonthly : 0
    const cardioPct = totalCost > 0 ? (v.cardioEquip / totalCost) * 100 : 0
    const strengthPct = totalCost > 0 ? (v.strengthEquip / totalCost) * 100 : 0
    return { result: annualCost, label: 'Annual Equipment Cost', unit: '$', steps: [{ label: 'Cardio Equipment', value: `$${v.cardioEquip.toFixed(0)} (${cardioPct.toFixed(0)}% of spend)` }, { label: 'Strength Equipment', value: `$${v.strengthEquip.toFixed(0)} (${strengthPct.toFixed(0)}% of spend)` }, { label: 'Accessories', value: `$${v.accessoryBudget.toFixed(0)}` }, { label: 'Total Setup Cost', value: `$${totalCost.toFixed(0)}` }, { label: 'Budget Remaining', value: `$${remaining.toFixed(0)}` }, { label: 'Annualized Cost', value: `$${annualCost.toFixed(0)}/yr ($${monthlyCost.toFixed(0)}/mo)` }, { label: 'Break-Even vs Gym', value: `${breakEvenMonths.toFixed(0)} months ($${vsGymMonthly}/mo membership)` }, { label: 'Net Savings vs Gym', value: savings >= 0 ? `Save $${savings.toFixed(0)}` : `Cost $${Math.abs(savings).toFixed(0)} more` }] ,
    extras: [
      { label: "Essential Starter Package", value: "Adjustable dumbbells ($200-400), adjustable bench ($150-250), resistance bands ($20-40), yoga mat ($20-40) = $390-730 total" },
      { label: "Garage Gym Core", value: "Power rack ($400-800), Olympic barbell ($150-300), weight plates ($300-800), pull-up bar ($30-80) = $880-1,980" },
      { label: "Cardio Equipment Options", value: "Jump rope ($10-20) → Bike ($200-500) → Rower ($500-1,200) → Treadmill ($1,200-3,000) → Assault Bike ($800-1,500)" },
      { label: "Flooring Protection", value: "Rubber mats (0.5-1 in thick): $2-5/sq ft. Essential for a 100 sq ft garage gym area: $200-500 to protect concrete and equipment." },
      { label: "Maintenance Costs", value: "Budget 5-10% of equipment value annually for maintenance — lubricating chains, replacing cables, tightening bolts." },
      { label: "Space Planning", value: "Minimum floor space: 100 sq ft (10×10). Ceiling clearance: 90+ in for pull-ups and overhead press. Allow 2 ft clearance around equipment." },
      { label: "Used Equipment Savings", value: "Marketplace/Craigslist: 40-60% off retail. Weights and barbells hold value well. Treadmills and ellipticals are heavily discounted used." },
      { label: "Resale Value", value: "Quality brands (Rogue, Rep, Titan, Concept2) retain 60-80% of value. Budget brands lose 80-90%. Buy once, cry once." },
    ]}
  },
  description: 'Plan and compare home gym costs across cardio, strength, and accessories. See how long until your investment breaks even versus a commercial gym membership.',
  formula: 'Annual Cost = Total Equipment ÷ Lifespan Years | Break-Even = Total Cost ÷ ($50/month gym dues) | Savings = (Years × 12 × $50) − Total Cost',
  interpretation: 'A home gym pays for itself in about 3-4 years for a mid-range setup compared to a $50/month commercial gym membership. The real savings compound over time — a $2,500 garage gym that lasts 15 years effectively costs $14/month vs $50/month at a commercial gym. Cardio equipment (treadmills, bikes, rowers) typically needs replacement every 8-12 years, while quality barbells and plates can last a lifetime. Resistance bands and mats are wear items needing replacement every 1-3 years. The best value upgrades in order: adjustable dumbbells → power rack → barbell + plates → rower.'
}

export default calcDef

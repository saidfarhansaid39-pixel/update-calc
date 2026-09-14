import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ homeValueMaintenance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rulePercent: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), homeAge: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'homeValueMaintenance', label: 'Home Value ($)', type: 'number', min: 50000, step: '50000' },
    { name: 'rulePercent', label: 'Rule (% of Home Value)', type: 'number', min: 0.5, max: 5, step: '0.5' },
    { name: 'homeAge', label: 'Home Age (years)', type: 'number', min: 0, step: '5' },
  ],
  defaults: { homeValueMaintenance: "350000", rulePercent: "1", homeAge: "15" },
  presets: [
    { label: "New Build (Under 5yr)", values: { homeValueMaintenance: "450000", rulePercent: "0.5", homeAge: "3" } },
    { label: "Average Suburban Home", values: { homeValueMaintenance: "300000", rulePercent: "1", homeAge: "20" } },
    { label: "Older Character Home", values: { homeValueMaintenance: "400000", rulePercent: "2", homeAge: "50" } },
    { label: "Low-Maintenance Condo", values: { homeValueMaintenance: "250000", rulePercent: "0.75", homeAge: "10" } },
  ],
  compute: (v) => {
    const annualBudget = v.homeValueMaintenance * (v.rulePercent / 100)
    const monthlyBudget = annualBudget / 12
    const ageFactor = v.homeAge < 5 ? 0.7 : v.homeAge < 15 ? 1 : v.homeAge < 30 ? 1.5 : 2
    const adjustedAnnual = annualBudget * ageFactor
    const adjustedMonthly = adjustedAnnual / 12
    const tenYearTotal = adjustedAnnual * 10
    const weeklySetAside = adjustedMonthly / 4.33
    return { result: adjustedAnnual, label: 'Annual Maintenance Budget', unit: '$', steps: [{ label: 'Home Value', value: `$${v.homeValueMaintenance.toLocaleString()}` }, { label: 'Selected Rule', value: `${v.rulePercent}% → $${annualBudget.toFixed(0)}/yr` }, { label: 'Age Category', value: v.homeAge < 5 ? 'New (0-5 yr): 0.7×' : v.homeAge < 15 ? 'Established (5-15 yr): 1×' : v.homeAge < 30 ? 'Mature (15-30 yr): 1.5×' : 'Vintage (30+ yr): 2×' }, { label: 'Age Adjustment Factor', value: `${ageFactor.toFixed(1)}×` }, { label: 'Adjusted Annual Budget', value: `$${adjustedAnnual.toFixed(0)}` }, { label: 'Monthly Set-Aside', value: `$${adjustedMonthly.toFixed(0)}/mo ($${weeklySetAside.toFixed(0)}/wk)` }, { label: '10-Year Reserve Target', value: `$${tenYearTotal.toFixed(0)}` }] ,
    extras: [
      { label: "Age-Based Scaling", value: "New (0-5 yr): 0.7× base | Established (5-15 yr): 1× | Mature (15-30 yr): 1.5× | Vintage (30+ yr): 2× — older homes need more frequent repairs" },
      { label: "Common Major Repairs (Cost)", value: "Roof replacement: $6,000-25,000 | HVAC replacement: $5,000-15,000 | Exterior painting: $3,000-8,000 | Foundation repair: $2,000-20,000" },
      { label: "Seasonal Savings Strategy", value: "Save monthly in a high-yield savings account dedicated to home maintenance. A $300/mo contribution at 4% APY grows to ~$18,000 in 5 years." },
      { label: "Home Warranty vs Savings", value: "Home warranties ($500-800/yr) cover appliance/appliance breakdown but exclude pre-existing and improper installation. Self-insuring via a savings fund often yields better returns." },
      { label: "Inflation on Repairs", value: "Home repair costs rise 4-7% annually vs 2-3% general inflation. Factor in rising material and labor costs when projecting a 5-10 year budget." },
      { label: "Preventative Maintenance ROI", value: "Every $1 spent on preventative maintenance avoids $4-7 in emergency repairs. Annual HVAC tune-ups ($150-300) prevent $3,000-6,000 premature replacement." },
      { label: "DIY vs Pro Cost Comparison", value: "DIY: 30-50% of pro cost for labor but requires tools and skill. Minor plumbing/electrical: $50-300 DIY vs $200-800 pro. Roof/HVAC/foundation: always hire licensed pros." },
      { label: "Tax Deductibility", value: "Home maintenance is not tax-deductible for primary residences. However, home office deductions (proportionate share) and rental properties make maintenance costs deductible." },
    ]}
  },
  description: 'Budget for home maintenance using the flexible percentage rule with automatic age-based adjustments. Set realistic monthly savings targets for both routine upkeep and major repairs.',
  formula: 'Annual Budget = Home Value × (Rule% ÷ 100) × Age Factor (0.7× to 2×) | Monthly = Annual ÷ 12 | 10-Year Reserve = Annual × 10',
  interpretation: 'The 1% rule is a widely recommended baseline: set aside 1% of your home\'s value annually for maintenance and repairs. However, this needs adjustment for home age — new construction needs less (0.5-0.7%), while homes over 15 years need significantly more (1.5-2%). The biggest risks are catastrophic system failures: roof, HVAC, and plumbing. A well-funded maintenance reserve is the difference between a manageable $500 repair and a $10,000 emergency. Treat this as a non-negotiable monthly bill — automate transfers to a dedicated high-yield savings account.'
}

export default calcDef

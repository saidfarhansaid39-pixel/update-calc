import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gymMonthlyFee: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), visitsPerMonth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), annualFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), commuteCostMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'gymMonthlyFee', label: 'Monthly Membership ($)', type: 'number', min: 1, step: '10' },
    { name: 'visitsPerMonth', label: 'Visits per Month', type: 'number', min: 1, step: '1' },
    { name: 'annualFee', label: 'Annual Fee ($)', type: 'number', min: 0, step: '25' },
    { name: 'commuteCostMonthly', label: 'Monthly Commute Cost ($)', type: 'number', min: 0, step: '5' },
  ],
  defaults: { gymMonthlyFee: '40', visitsPerMonth: '12', annualFee: '50', commuteCostMonthly: '20' },
  presets: [
    { label: 'Budget Gym (Planet Fitness)', values: { gymMonthlyFee: '10', visitsPerMonth: '8', annualFee: '49', commuteCostMonthly: '10' } },
    { label: 'Mid-Range Gym (LA Fitness)', values: { gymMonthlyFee: '35', visitsPerMonth: '15', annualFee: '50', commuteCostMonthly: '20' } },
    { label: 'Premium Gym (Equinox)', values: { gymMonthlyFee: '180', visitsPerMonth: '12', annualFee: '200', commuteCostMonthly: '30' } },
    { label: 'Boutique Studio (Yoga/Spin)', values: { gymMonthlyFee: '150', visitsPerMonth: '8', annualFee: '0', commuteCostMonthly: '15' } },
  ],
  compute: (v) => {
    const totalMonthly = v.gymMonthlyFee + v.annualFee / 12 + v.commuteCostMonthly
    const costPerVisit = totalMonthly / v.visitsPerMonth
    const annualTotal = totalMonthly * 12
    const membershipOnlyVisitCost = v.gymMonthlyFee / v.visitsPerMonth
    const extraCostPct = ((costPerVisit - membershipOnlyVisitCost) / membershipOnlyVisitCost) * 100
    const weeklyCost = totalMonthly / 4.33
    const homeGymBreakEven = v.gymMonthlyFee > 0 ? 1500 / totalMonthly : 0
    const annualVisitSavingsVsStudio = (150 - costPerVisit) * v.visitsPerMonth * 12
    return { result: costPerVisit, label: 'True Cost per Visit', unit: '$', steps: [{ label: 'Monthly Membership', value: `$${v.gymMonthlyFee.toFixed(2)}` }, { label: 'Annual Fee (×1/12)', value: `+$${(v.annualFee / 12).toFixed(2)}` }, { label: 'Commute Cost (monthly)', value: `+$${v.commuteCostMonthly.toFixed(2)}` }, { label: 'Total Monthly', value: `$${totalMonthly.toFixed(2)}` }, { label: 'Visits per Month', value: `${v.visitsPerMonth}` }, { label: 'Cost per Visit', value: `$${costPerVisit.toFixed(2)}` }, { label: 'Membership-Only / Visit', value: `$${membershipOnlyVisitCost.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annualTotal.toFixed(2)}/yr` }] ,
    extras: [
      { label: 'Hidden Cost Breakdown', value: `Membership: $${v.gymMonthlyFee.toFixed(2)}. Annual fee amortized: $${(v.annualFee / 12).toFixed(2)}/mo. Commute: $${v.commuteCostMonthly.toFixed(2)}/mo (gas, parking, transit or wear). Total: $${totalMonthly.toFixed(2)}/mo. Of this, $${(v.annualFee / 12 + v.commuteCostMonthly).toFixed(2)}/mo (${extraCostPct.toFixed(0)}%) is hidden costs beyond the membership fee. A gym that seems like $${v.gymMonthlyFee.toFixed(0)}/mo actually costs $${totalMonthly.toFixed(0)}/mo — ${((totalMonthly / v.gymMonthlyFee - 1) * 100).toFixed(0)}% more.` },
      { label: 'Optimal Visit Frequency', value: `At ${v.visitsPerMonth} visits/mo = ${(v.visitsPerMonth / 4.33).toFixed(1)}×/week. Cost: $${costPerVisit.toFixed(2)}/visit. Price per class equivalent: $15-30 for drop-in, $20-35 for boutique. You're saving $${(20 - costPerVisit).toFixed(2)}-$${(30 - costPerVisit).toFixed(2)} per visit vs drop-in rates. Go ${v.visitsPerMonth < 12 ? '2× more to cut cost/visit in half' : '3-4×/week to maximize value at $' + (totalMonthly / (v.visitsPerMonth < 12 ? 12 : Math.max(v.visitsPerMonth, 17))).toFixed(2) + '/visit'}. At 4×/week (17/mo): cost drops to $${(totalMonthly / 17).toFixed(2)}/visit.` },
      { label: 'Home Gym vs Membership Break-Even', value: `Home gym setup: $500-3,000 (adjustable dumbbells $300-500, bench $200-500, rack $500-1,500, cardio $500-2,000). You pay $${totalMonthly.toFixed(2)}/mo for your current gym = $${annualTotal.toFixed(0)}/yr. Home gym break-even: ${homeGymBreakEven.toFixed(1)} months at $1,500 setup. Over 5 years: gym costs ${(annualTotal * 5).toFixed(0)} vs home gym $${(1500 + totalMonthly * 0.3 * 12 * 5).toFixed(0)} (est $10/mo maintenance: wipes, equipment repair). Save ~$${(annualTotal * 5 - (1500 + 600)).toFixed(0)} with home gym. Add convenience value (no commute): priceless.` },
      { label: 'Commute Cost Analysis', value: `Your commute costs $${v.commuteCostMonthly.toFixed(2)}/mo = $${(v.commuteCostMonthly / (v.visitsPerMonth || 1)).toFixed(2)}/visit. Round trip in minutes: assume avg 20 min each way = 40 min/trip × ${v.visitsPerMonth} visits = ${(40 * v.visitsPerMonth / 60).toFixed(0)} hrs/mo commuting. At $20/hr time value: $${(20 * 40 * v.visitsPerMonth / 60).toFixed(0)}/mo in time cost. True cost per visit with time at $20/hr: $${(costPerVisit + 20 * 40 / 60).toFixed(2)}. A closer gym (${v.commuteCostMonthly < 10 ? 'walking distance' : '10 min trip'}) saves $${((v.commuteCostMonthly + 20 * 40 * v.visitsPerMonth / 60) - (5 + 20 * 10 * v.visitsPerMonth / 60)).toFixed(0)}/mo.` },
      { label: 'Annual Fee & Contract Traps', value: `Annual fee: $${v.annualFee.toFixed(0)}/yr = $${(v.annualFee / 12).toFixed(2)}/mo. Typical timing: Jan 1 (post-holiday surge). Some charge Jan + Jul ($50×2 = $100/yr). Negotiate: ask to waive or reduce annual fee — 30% success rate. If you join at an annual fee promotion (new year, summer), you might save $${v.annualFee.toFixed(0)}. Cancel before the fee posts if possible.` },
      { label: 'Per-Visit vs Class-Pass vs Unlimited', value: `Cost/visit: $${costPerVisit.toFixed(2)} vs ClassPass: $15-25/credit per class. On-demand (multi-visit passes): $8-15/visit. If you go ${v.visitsPerMonth}×/mo: ${v.visitsPerMonth <= 4 ? 'a multi-visit pass might be cheaper ($' + (8 * v.visitsPerMonth).toFixed(0) + '-$' + (15 * v.visitsPerMonth).toFixed(0) + ' vs $' + totalMonthly.toFixed(0) + ' for unlimited).' : 'unlimited is likely best value ($' + totalMonthly.toFixed(0) + '/mo for ' + v.visitsPerMonth + ' visits).'} Drop-in rates: $15-30/session. Your savings vs drop-in: $${((20 - costPerVisit) * v.visitsPerMonth).toFixed(0)}-$${((30 - costPerVisit) * v.visitsPerMonth).toFixed(0)}/mo.` },
      { label: 'Total Annual Health Investment', value: `Your total annual gym cost: $${annualTotal.toFixed(0)}. Compare to: preventive health savings from regular exercise. Studies show regular exercise reduces healthcare costs by $$1,500-3,000/yr. Net benefit: $${(2000 - annualTotal).toFixed(0)}-$$${(3000 - annualTotal).toFixed(0)}/yr considering reduced doctor visits, fewer sick days ($380/day avg), and better mental health (reduced therapy costs ~$150/session × 10 sessions = $1,500/yr saved with exercise vs meds).` },
      { label: 'Seasonal Usage & Cancellation Strategy', value: `Avg gym usage: Jan (peak, 2× enrolled), Feb-Mar (high), Apr-Jun (declining), Jul-Aug (low — vacation season), Sep-Oct (return to school), Nov-Dec (low). If you only use the gym ${v.visitsPerMonth}×/mo, consider a 6-month membership (Sep-Feb) + outdoor workouts Mar-Aug. This saves ~$${(annualTotal * 0.4).toFixed(0)}-$${(annualTotal * 0.5).toFixed(0)} annually. Many gyms offer seasonal holds (freeze for $0-10/mo).` },
    ]}
  },
  description: 'Calculate the true cost per visit of a gym membership including monthly fees, annual fees, commute costs, and time value. Compare budget vs premium gyms, evaluate home-gym break-even points, and optimize visit frequency for best value. Includes hidden cost breakdown and health investment ROI.',
  formula: 'True Cost/Visit = (Monthly Fee + Annual Fee÷12 + Monthly Commute) ÷ Visits/Month | Annual Total = True Monthly × 12 | Hidden Cost % = (Annual/12 + Commute) ÷ Monthly Fee | Home Gym Break-Even = $1,500 ÷ Monthly Total | Time Cost/Visit = Round-Trip Min ÷ 60 × $20/hr',
  interpretation: 'A $40/mo gym visited 12×/mo with $50 annual fee and $20 commute costs $5.80/visit — not $3.33 (membership only). Home gym ($1,500 setup) breaks even in ~18 months vs a $40/mo gym. Visiting 12-17×/month (3-4×/week) optimizes per-visit cost. Hidden costs (annual fees, commute, time) add 30-60% to apparent membership cost. Regular exercise saves $1,500-3,000/yr in healthcare costs — making any gym membership a net positive investment in health.'
}

export default calcDef

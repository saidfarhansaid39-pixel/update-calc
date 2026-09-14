import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ children: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hourlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), weeksPerYear: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), overtimePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), employerTaxPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'children', label: 'Number of Children', type: 'number', min: 1, step: '1' },
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 5, step: '5' },
    { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', min: 1, step: '5' },
    { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', min: 1, max: 52, step: '1' },
    { name: 'overtimePct', label: 'Overtime Premium (%)', type: 'number', min: 0, max: 100, step: '10' },
    { name: 'employerTaxPct', label: 'Employer Tax Burden (%)', type: 'number', min: 0, max: 20, step: '2' },
  ],
  defaults: { children: '2', hourlyRate: '20', hoursPerWeek: '30', weeksPerYear: '48', overtimePct: '50', employerTaxPct: '10' },
  presets: [
    { label: 'Part-Time Nanny (after school)', values: { children: '2', hourlyRate: '18', hoursPerWeek: '20', weeksPerYear: '40', overtimePct: '0', employerTaxPct: '10' } },
    { label: 'Full-Time Nanny Share', values: { children: '2', hourlyRate: '15', hoursPerWeek: '40', weeksPerYear: '50', overtimePct: '50', employerTaxPct: '10' } },
    { label: 'Babysitter Date Nights', values: { children: '1', hourlyRate: '22', hoursPerWeek: '6', weeksPerYear: '52', overtimePct: '0', employerTaxPct: '0' } },
    { label: 'Live-In Nanny Full-Time', values: { children: '3', hourlyRate: '12', hoursPerWeek: '45', weeksPerYear: '52', overtimePct: '50', employerTaxPct: '10' } },
  ],
  compute: (v) => {
    const baseWeekly = v.children * v.hourlyRate * v.hoursPerWeek
    const overtimeHours = Math.max(0, v.hoursPerWeek - 40)
    const regHours = v.hoursPerWeek - overtimeHours
    const overtimeMultiplier = 1 + v.overtimePct / 100
    const weeklyWithOvertime = (v.children * v.hourlyRate * regHours) + (v.children * v.hourlyRate * overtimeHours * overtimeMultiplier)
    const weeklyCost = v.overtimePct > 0 && overtimeHours > 0 ? weeklyWithOvertime : baseWeekly
    const monthlyCost = weeklyCost * 4.33
    const annualWages = weeklyCost * v.weeksPerYear
    const employerTaxes = annualWages * (v.employerTaxPct / 100)
    const annualTotal = annualWages + employerTaxes
    const hourlyEffective = annualTotal / (v.hoursPerWeek * v.weeksPerYear * v.children)
    const pctFullTimeMinWage = (hourlyEffective / 7.25) * 100
    return { result: monthlyCost, label: 'Monthly Care Cost', unit: '$', steps: [
      { label: 'Base Rate', value: `$${v.hourlyRate.toFixed(2)}/hr × ${v.children} child${v.children > 1 ? 'ren' : ''} = $${(v.hourlyRate * v.children).toFixed(2)}/hr combined` },
      { label: 'Hours per Week', value: v.overtimePct > 0 && overtimeHours > 0 ? `${regHours} regular + ${overtimeHours} OT @ ${v.overtimePct}% premium` : `${v.hoursPerWeek} hours/week` },
      { label: 'Weekly Cost', value: `$${weeklyCost.toFixed(2)}` },
      { label: 'Monthly Cost (avg)', value: `$${weeklyCost.toFixed(2)} × 4.33 = $${monthlyCost.toFixed(2)}` },
      { label: 'Annual Wages', value: `$${weeklyCost.toFixed(2)} × ${v.weeksPerYear} weeks = $${annualWages.toFixed(2)}` },
      { label: `Employer Taxes (${v.employerTaxPct}%)`, value: `+$${employerTaxes.toFixed(2)} (FICA, unemployment, workers comp)` },
      { label: 'Annual Total (all-in)', value: `$${annualTotal.toFixed(2)}` },
      { label: 'Effective Hourly Rate', value: `$${hourlyEffective.toFixed(2)}/hr/child — ${pctFullTimeMinWage.toFixed(0)}% of federal min wage` },
    ] ,
    extras: [
      { label: 'Nanny vs Daycare Center Math', value: `At $${v.hourlyRate.toFixed(2)}/hr for ${v.hoursPerWeek} hrs/week, you are paying $${weeklyCost.toFixed(2)}/week. Compare to daycare center rates: $200-400/week/child — for ${v.children} children, that's $${(v.children * 300).toFixed(0)}-$${(v.children * 400).toFixed(0)}/week. A nanny is ${weeklyCost > v.children * 350 ? 'comparable to' : 'potentially cheaper than'} center care, with the benefit of 1:1 attention and flexible hours.` },
      { label: 'Overtime Cost Impact', value: overtimeHours > 0 ? `Your ${overtimeHours} OT hours at ${v.overtimePct}% premium add $${((weeklyWithOvertime - baseWeekly) * v.weeksPerYear).toFixed(0)}/year. Consider capping hours at 40/week to avoid OT — or adjust the schedule to stay under the threshold.` : 'Working caregivers over 40 hours/week triggers overtime (1.5× base rate in most states). Even 5 OT hours/week adds 15-25% to your annual nanny cost.' },
      { label: 'Employer Tax Responsibilities', value: `At ${v.employerTaxPct}% ($${employerTaxes.toFixed(2)}/yr), you're paying: Social Security (6.2%), Medicare (1.45%), federal unemployment (0.6% on first $7,000), and state unemployment (2-5%). As a household employer, you must file Schedule H with your taxes and provide a W-2 if you pay over $2,600/year.` },
      { label: 'Dependent Care FSA Strategy', value: `With annual costs of $${annualTotal.toFixed(2)}, max out your Dependent Care FSA at $5,000/year pre-tax. At a 22% tax bracket, that saves $1,100/year in federal taxes plus ~5-7% in FICA — totaling $1,350-1,600/year in savings. Note: FSA funds are use-it-or-lose-it.` },
      { label: 'Nanny Share Economics', value: `Splitting a nanny with another family cuts your cost by 30-45%. Instead of $${weeklyCost.toFixed(2)}/week, a share costs ~$${(weeklyCost * 0.65).toFixed(2)}/week. That saves $${((weeklyCost * 0.35) * v.weeksPerYear).toFixed(0)}/year. The nanny earns more (1.3×-1.5× hourly), and each family pays less.` },
      { label: 'Cost per Child Breakdown', value: `With ${v.children} children, each child costs $${(annualTotal / v.children).toFixed(0)}/year for care. For context: in-state college tuition averages $10,500/year — childcare ${annualTotal / v.children > 10500 ? 'exceeds' : 'is less than'} in-state college costs in many states.` },
      { label: 'Guaranteed Hours Best Practice', value: 'Most nannies require guaranteed hours: you pay for 40 hours/week regardless of whether you use them. This costs 10-15% more annually but ensures reliable availability. Factor that into your budget — it adds $' + `${(weeklyCost * 0.1 * v.weeksPerYear).toFixed(0)}` + '/year at your rate.' },
      { label: 'Summer & Holiday Schedules', value: `Your ${v.weeksPerYear} week schedule means ${52 - v.weeksPerYear} unpaid weeks. If the nanny works through summer but you don't, guaranteed hours still apply. Budget an extra $${((52 - v.weeksPerYear) * weeklyCost * 0.5).toFixed(0)}-${((52 - v.weeksPerYear) * weeklyCost).toFixed(0)} for holiday pay and vacation time (2 weeks paid recommended).` },
    ]}
  },
  description: 'Estimate childcare costs based on hourly rate, hours per week, number of children, and weeks per year — including overtime premiums, employer taxes (FICA, unemployment, workers comp), and nanny share comparisons. Understand the true all-in cost of hiring a caregiver.',
  formula: 'Weekly = Children × Rate × Hours (with OT premium over 40h). Annual = Weekly × Weeks + Employer Taxes (FICA 7.65% + SUI). Effective hourly = Annual Total ÷ (Hours × Weeks × Children).',
  interpretation: 'Nanny rates average $15-25/hr depending on location and experience. Full-time nanny annual cost (including employer taxes) ranges from $35,000-65,000. Daycare centers average $200-400/week per child. Nanny shares cut costs 30-45%. Dependent Care FSAs allow $5,000 pre-tax. Household employers must pay FICA and file Schedule H. Always provide a W-2 for wages over $2,600/year.'
}

export default calcDef

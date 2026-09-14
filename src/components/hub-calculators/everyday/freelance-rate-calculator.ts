import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ desiredSalary: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), billableDaysPerYear: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), businessExpenses: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), profitMargin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'desiredSalary', label: 'Desired Annual Salary ($)', type: 'number', min: 10000, step: '5000' },
    { name: 'billableDaysPerYear', label: 'Billable Days per Year', type: 'number', min: 1, step: '5' },
    { name: 'hoursPerDay', label: 'Billable Hours per Day', type: 'number', min: 1, step: '1' },
    { name: 'businessExpenses', label: 'Annual Business Expenses ($)', type: 'number', min: 0, step: '1000' },
    { name: 'profitMargin', label: 'Desired Profit Margin (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  defaults: { desiredSalary: '80000', billableDaysPerYear: '220', hoursPerDay: '6', businessExpenses: '12000', profitMargin: '20' },
  presets: [
    { label: 'Junior Developer / Designer', values: { desiredSalary: '60000', billableDaysPerYear: '220', hoursPerDay: '5', businessExpenses: '8000', profitMargin: '15' } },
    { label: 'Mid-Level Consultant', values: { desiredSalary: '100000', billableDaysPerYear: '220', hoursPerDay: '6', businessExpenses: '15000', profitMargin: '20' } },
    { label: 'Senior Expert / Agency Owner', values: { desiredSalary: '150000', billableDaysPerYear: '200', hoursPerDay: '5', businessExpenses: '30000', profitMargin: '25' } },
    { label: 'Part-Time Side Hustle', values: { desiredSalary: '30000', billableDaysPerYear: '100', hoursPerDay: '4', businessExpenses: '3000', profitMargin: '10' } },
  ],
  compute: (v) => {
    const totalHours = v.billableDaysPerYear * v.hoursPerDay
    const totalNeeded = v.desiredSalary + v.businessExpenses
    const withProfit = totalNeeded * (1 + v.profitMargin / 100)
    const rate = withProfit / totalHours
    const weeklyRate = rate * v.hoursPerDay * 5
    const monthlyRate = rate * totalHours / 12
    const projectRate10 = rate * 10
    const projectRate40 = rate * 40
    const nonBillablePct = ((260 - v.billableDaysPerYear) / 260) * 100
    const effectiveTaxPct = 0.3
    const afterTaxRate = rate * (1 - effectiveTaxPct)
    return { result: rate, label: 'Hourly Rate', unit: '$/hr', steps: [{ label: 'Desired Salary', value: `$${v.desiredSalary.toFixed(0)}` }, { label: 'Business Expenses', value: `$${v.businessExpenses.toFixed(0)}` }, { label: 'Total Needed Pre-Profit', value: `$${totalNeeded.toFixed(0)}` }, { label: `Profit Margin (${v.profitMargin}%)`, value: `$${(withProfit - totalNeeded).toFixed(0)} added` }, { label: 'Billable Hours/Year', value: `${v.billableDaysPerYear} days × ${v.hoursPerDay} hrs = ${totalHours} hrs` }, { label: 'Hourly Rate to Charge', value: `$${rate.toFixed(2)}/hr` }, { label: 'After-Tax Rate (~30%)', value: `$${afterTaxRate.toFixed(2)}/hr take-home` }, { label: 'Weekly Equivalent', value: `$${weeklyRate.toFixed(2)}/week (5-day)` }] ,
    extras: [
      { label: 'Billable Utilization Rate', value: `${v.billableDaysPerYear} days = ${nonBillablePct.toFixed(0)}% non-billable (admin, marketing, pro dev). Standard billable target: 60-75% of total working days. If full year = 260 weekdays: ${nonBillablePct.toFixed(0)}% non-billable = ${((260 - v.billableDaysPerYear) / 260 * 100).toFixed(0)}%. Ideal: ${v.billableDaysPerYear >= 220 ? 'high — assumes minimal non-billable time. Be realistic: add 20-30 buffer days.' : v.billableDaysPerYear >= 180 ? 'good — 70-85% utilization' : 'low utilization — consider reducing non-billable tasks or raising rate'}. Each 5 extra billable days adds $${(rate * v.hoursPerDay * 5).toFixed(0)} income.` },
      { label: 'Rate Benchmark by Industry', value: `$${rate.toFixed(2)}/hr ${rate < 50 ? '— entry level or administrative' : rate < 75 ? '— typical for junior devs, writers, VA' : rate < 100 ? '— mid-level design, dev, consulting' : rate < 150 ? '— senior specialist (software, marketing)' : rate < 200 ? '— expert consultant or niche specialist' : '— executive/agency owner level'}. For $${v.desiredSalary.toFixed(0)} target: ${v.desiredSalary >= 100000 ? 'senior rates of $100-200/hr' : v.desiredSalary >= 60000 ? 'mid-level $60-100/hr' : 'junior $30-60/hr'} is typical. Compare your $${rate.toFixed(2)}/hr to market: $${(rate * 0.8).toFixed(2)}-$${(rate * 1.2).toFixed(2)} is a reasonable range for your profile.` },
      { label: 'Project Pricing Equivalent', value: `$${rate.toFixed(2)}/hr. Small project (10 hrs) = $${projectRate10.toFixed(0)}. 1-week sprint (40 hrs) = $${projectRate40.toFixed(0)}. Monthly retainer (${(totalHours / 12).toFixed(0)} hrs) = $${(rate * totalHours / 12).toFixed(0)}. Value pricing often yields 2-3× hourly rate. Fixed bids should include 20-30% buffer for scope creep.` },
      { label: 'Expense & Tax Reality Check', value: `Business expenses $${v.businessExpenses.toFixed(0)}/year = ${(v.businessExpenses / v.desiredSalary * 100).toFixed(0)}% of salary. Typical: 10-25%. Self-employment tax: 15.3% + income tax ~15-30% effective = 30-45% total. Your after-tax effective rate: $${afterTaxRate.toFixed(2)}/hr.` },
      { label: 'Rate vs Employee Total Comp', value: `$${rate.toFixed(2)}/hr freelance ≈ $${v.desiredSalary.toFixed(0)} employee salary. Employee total comp = salary + 25-35% overhead (benefits, PTO, 401k match). Equivalent employee total comp: $${(v.desiredSalary * 1.3).toFixed(0)}-$${(v.desiredSalary * 1.35).toFixed(0)}. Value your benefits: health insurance $500-1000/mo.` },
      { label: 'Vacation & Sick Day Impact', value: `Your ${v.billableDaysPerYear} days assumed = 0 days off. Add 15 PTO + 5 sick days: effective billable = ${Math.max(0, v.billableDaysPerYear - 20)} days. Revenue loss of $${(rate * 20 * v.hoursPerDay).toFixed(0)}. To maintain $${v.desiredSalary.toFixed(0)} income with 20 days off: adjust rate accordingly.` },
      { label: 'Annual Earnings Projection', value: `At $${rate.toFixed(2)}/hr × ${totalHours} hrs = $${(rate * totalHours).toFixed(0)} gross. Minus expenses $${v.businessExpenses.toFixed(0)} = $${(rate * totalHours - v.businessExpenses).toFixed(0)} pre-tax. At 30% tax: $${((rate * totalHours - v.businessExpenses) * 0.7).toFixed(0)} take-home. Annual review: increase rate by 10-15% yearly for inflation + experience.` },
    ]}
  },
  description: 'Compute your freelance hourly rate factoring in desired salary, billable days, business expenses, and profit margin. Includes tax impact, industry benchmarks, project pricing equivalents, and vacation-adjusted calculations.',
  formula: 'Rate = (Salary + Expenses) × (1 + Profit%) / (Billable Days × Hours/Day) | After-Tax Rate = Rate × (1 - 0.30) | Weekly = Rate × Hours/Day × 5 | Non-Billable % = (260 - Billable Days) / 260 × 100',
  interpretation: 'Typical billable days: 220-230 per year (accounting for weekends, holidays, sick days, and non-billable admin work). Freelancers should bill 2-3× their desired hourly wage — only 50-70% of working hours are billable. A $100,000 salary target with $12,000 expenses and 20% margin requires ~$75/hr at 220 days × 6 hours. Non-billable time (admin, marketing, professional development) consumes 30-40% of your workweek. Raise rates annually by 10-15% and build a 3-6 month runway buffer. Value-based pricing (per project, not per hour) can increase earnings 2-3×.'
}

export default calcDef

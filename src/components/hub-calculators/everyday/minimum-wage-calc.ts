import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hourlyWage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), overtimeHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), deductions: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'hourlyWage', label: 'Hourly Wage ($)', type: 'number', min: 1, step: '0.25' },
    { name: 'hoursPerWeek', label: 'Regular Hours/Week', type: 'number', min: 1, max: 168, step: '5' },
    { name: 'overtimeHours', label: 'Overtime Hours/Week', type: 'number', min: 0, step: '1' },
    { name: 'taxRate', label: 'Effective Tax Rate (%)', type: 'number', min: 0, max: 50, step: '5' },
    { name: 'deductions', label: 'Weekly Deductions ($)', type: 'number', min: 0, step: '25' },
  ],
  defaults: { hourlyWage: '15', hoursPerWeek: '40', overtimeHours: '0', taxRate: '12', deductions: '50' },
  presets: [
    { label: 'Federal Minimum (full-time)', values: { hourlyWage: '7.25', hoursPerWeek: '40', overtimeHours: '0', taxRate: '10', deductions: '30' } },
    { label: '$15/hr Full-Time', values: { hourlyWage: '15', hoursPerWeek: '40', overtimeHours: '0', taxRate: '12', deductions: '50' } },
    { label: '$25/hr with OT', values: { hourlyWage: '25', hoursPerWeek: '40', overtimeHours: '5', taxRate: '18', deductions: '100' } },
    { label: 'High Earner with Deductions', values: { hourlyWage: '50', hoursPerWeek: '40', overtimeHours: '5', taxRate: '24', deductions: '200' } },
  ],
  compute: (v) => {
    const regularPay = v.hourlyWage * v.hoursPerWeek
    const overtimePay = v.hourlyWage * 1.5 * v.overtimeHours
    const grossWeekly = regularPay + overtimePay
    const grossAnnual = grossWeekly * 52
    const taxes = grossWeekly * (v.taxRate / 100)
    const netWeekly = grossWeekly - taxes - v.deductions
    const netAnnual = netWeekly * 52
    const monthlyTakeHome = netWeekly * 4.33
    const otPremium = v.overtimeHours > 0 ? v.hourlyWage * 1.5 - v.hourlyWage : 0
    const percentToTax = grossAnnual > 0 ? ((v.taxRate) + (v.deductions * 52 / grossAnnual * 100)) : v.taxRate
    return { result: netAnnual, label: 'Net Annual Income', unit: '$', steps: [
      { label: 'Regular Weekly Pay', value: `${v.hoursPerWeek} hrs × $${v.hourlyWage.toFixed(2)} = $${regularPay.toFixed(2)}` },
      { label: 'Overtime Weekly Pay', value: `${v.overtimeHours} hrs × $${(v.hourlyWage * 1.5).toFixed(2)} = $${overtimePay.toFixed(2)}` },
      { label: 'Gross Weekly Total', value: `$${regularPay.toFixed(2)} + $${overtimePay.toFixed(2)} = $${grossWeekly.toFixed(2)}` },
      { label: 'Gross Annual Income', value: `$${grossWeekly.toFixed(2)} × 52 = $${grossAnnual.toFixed(2)}` },
      { label: 'Weekly Taxes', value: `$${grossWeekly.toFixed(2)} × ${v.taxRate}% = -$${taxes.toFixed(2)}` },
      { label: 'Other Deductions', value: `-$${v.deductions.toFixed(2)}/wk` },
      { label: 'Net Weekly (take-home)', value: `$${netWeekly.toFixed(2)}` },
      { label: 'Net Annual (take-home)', value: `$${netAnnual.toFixed(2)}` },
    ] ,
    extras: [
      { label: 'Federal Minimum Wage', value: 'US federal min: $7.25/hr. Many states are higher: CA $16, WA $16.28, NY $15, MA $15. Check your state\'s rate.' },
      { label: 'Living Wage vs Minimum', value: 'The living wage in the US averages $25-30/hr for a family of 4 vs $7.25 federal minimum — a significant gap.' },
      { label: 'OT Premium Value', value: v.overtimeHours > 0 ? `Your OT premium is $${otPremium.toFixed(2)}/hr above base rate — that\'s $${(otPremium * v.overtimeHours * 52).toFixed(0)} extra/year.` : 'Adding just 5 hrs OT/week at 1.5× could add $5,850/yr at $15/hr.' },
      { label: 'Effective Tax Reality', value: `Your ${v.taxRate}% rate + deductions = ~${percentToTax.toFixed(0)}% total effective reduction from gross.` },
      { label: 'Annual Salary Equivalent', value: `$${grossAnnual.toFixed(0)}/yr gross is equivalent to a $${(grossAnnual / 2080).toFixed(2)}/hr salary (assuming 40 hrs × 52 weeks).` },
      { label: 'Paycheck Frequency', value: `Weekly: $${netWeekly.toFixed(2)} | Biweekly: $${(netWeekly * 2).toFixed(2)} | Monthly: $${monthlyTakeHome.toFixed(2)}` },
    ]}
  },
  description: 'Calculate your net (take-home) annual income from an hourly wage. Includes overtime at 1.5×, effective tax rate, and other deductions. See the full breakdown from gross to net on weekly, monthly, and annual bases.',
  formula: 'NetAnnual = ((HourlyWage × RegHours + HourlyWage × 1.5 × OTHours) × 52) × (1 − TaxRate%) − Deductions × 52',
  interpretation: 'The US federal minimum wage is $7.25/hr (set in 2009), but many states have higher minimums up to $16-17/hr. A full-time worker at $15/hr earns ~$31,200/year gross. After ~12% effective taxes and $50/week deductions, take-home is ~$25,200/year ($2,100/month). Overtime at 1.5× significantly boosts income — 5 extra hrs/week at $15/hr adds ~$5,850/year gross. Effective tax rates vary by filing status, state, and deductions.'
}

export default calcDef

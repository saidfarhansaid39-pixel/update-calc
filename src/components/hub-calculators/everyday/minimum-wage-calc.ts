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
  compute: (v) => {
    const regularPay = v.hourlyWage * v.hoursPerWeek
    const overtimePay = v.hourlyWage * 1.5 * v.overtimeHours
    const grossWeekly = regularPay + overtimePay
    const grossAnnual = grossWeekly * 52
    const taxes = grossWeekly * (v.taxRate / 100)
    const netWeekly = grossWeekly - taxes - v.deductions
    const netAnnual = netWeekly * 52
    const monthlyTakeHome = netWeekly * 4.33
    return { result: netAnnual, label: 'Net Annual Income', unit: '$', steps: [{ label: 'Gross Weekly', value: `$${grossWeekly.toFixed(2)} (${v.hoursPerWeek}h reg + ${v.overtimeHours}h OT @ 1.5×)` }, { label: 'Gross Annual', value: `$${grossAnnual.toFixed(2)}` }, { label: 'Weekly Taxes', value: `-$${taxes.toFixed(2)} (${v.taxRate}% effective rate)` }, { label: 'Weekly Deductions', value: `-$${v.deductions.toFixed(2)}` }, { label: 'Net Weekly', value: `$${netWeekly.toFixed(2)}` }, { label: 'Net Monthly', value: `$${monthlyTakeHome.toFixed(2)}` }, { label: 'Net Annual', value: `$${netAnnual.toFixed(2)}` }] }
  },
  description: 'Calculate net annual income from an hourly wage including overtime (1.5×), taxes, and deductions. Understand your true take-home pay.',
  formula: 'NetAnnual = ((Wage×RegHours + Wage×1.5×OTHours) × 52) × (1 - Tax%/100) - Deductions×52',
  interpretation: 'US federal minimum wage: $7.25/hr. Many states have higher minimums ($15-17 in some). OT is 1.5× for hours over 40/week. $15/hr full-time = ~$31,200 gross/year. Effective tax rate varies by bracket and deductions.'
}

export default calcDef

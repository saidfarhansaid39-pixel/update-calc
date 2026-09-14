import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hourlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), totalHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), overhead: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 10, step: '5' },
    { name: 'totalHours', label: 'Billable Hours', type: 'number', min: 1, step: '1' },
    { name: 'overhead', label: 'Overhead %', type: 'number', min: 0, step: '5' },
    { name: 'taxRate', label: 'Tax Rate %', type: 'number', min: 0, max: 50, step: '1' },
  ],
  defaults: { hourlyRate: '75', totalHours: '120', overhead: '30', taxRate: '25' },
  presets: [
    { label: 'Freelance Developer', values: { hourlyRate: '100', totalHours: '160', overhead: '20', taxRate: '25' } },
    { label: 'Business Consultant', values: { hourlyRate: '150', totalHours: '80', overhead: '35', taxRate: '32' } },
    { label: 'Part-Time Designer', values: { hourlyRate: '65', totalHours: '40', overhead: '15', taxRate: '22' } },
    { label: 'Agency Markup', values: { hourlyRate: '200', totalHours: '200', overhead: '50', taxRate: '28' } },
  ],
  compute: (v) => {
    const grossRevenue = v.hourlyRate * v.totalHours
    const overheadCost = grossRevenue * (v.overhead / 100)
    const netBeforeTax = grossRevenue - overheadCost
    const taxes = netBeforeTax * (v.taxRate / 100)
    const netIncome = netBeforeTax - taxes
    const effectiveHourly = v.totalHours > 0 ? netIncome / v.totalHours : 0
    const totalDeductions = overheadCost + taxes
    const deductionPct = grossRevenue > 0 ? (totalDeductions / grossRevenue) * 100 : 0
    return {
      result: netIncome, label: 'Net Income', unit: '$',
      steps: [
        { label: 'Gross Revenue', value: `$${grossRevenue.toFixed(2)}` },
        { label: 'Formula Used', value: `$${v.hourlyRate} × ${v.totalHours} hrs` },
        { label: 'Overhead Deduction', value: `-$${overheadCost.toFixed(2)} (${v.overhead}% of revenue)` },
        { label: 'Net Before Tax', value: `$${netBeforeTax.toFixed(2)}` },
        { label: 'Tax Withholding', value: `-$${taxes.toFixed(2)} (${v.taxRate}% of net)` },
        { label: 'Net Income (Take-Home)', value: `$${netIncome.toFixed(2)}` },
        { label: 'Effective Hourly Rate', value: `$${effectiveHourly.toFixed(2)}/hr take-home` },
        { label: 'Total Deductions', value: `$${totalDeductions.toFixed(2)} (${deductionPct.toFixed(1)}% of gross)` },
      ],
      extras: [
        { label: 'Billable Utilization Target', value: 'Aim for 70-80% of working hours billable. At 40 hrs/week × 48 weeks = 1,920 total hrs, target 1,344-1,536 billable hrs/year.' },
        { label: 'Rate Setting Formula', value: 'Desired net income ÷ (1 - overhead% - tax%) ÷ billable hours. For $100K net at 30% overhead and 25% tax: $100K / 0.45 / 1,440 = $154/hr.' },
        { label: 'Quarterly Estimated Taxes', value: 'Self-employed individuals pay quarterly estimated taxes via Form 1040-ES. Set aside 25-30% of each invoice in a separate account.' },
        { label: 'Retirement Tax Shelter', value: 'SEP IRA allows up to 25% of net self-employment income (max $66,000 in 2023). Contributions reduce taxable income dollar-for-dollar.' },
        { label: 'Health Insurance Deduction', value: 'Self-employed health insurance premiums are deductible above-the-line, reducing both income tax and self-employment tax liability.' },
        { label: 'Non-Billable Time Budget', value: 'Allocate 20-30% of time for admin, marketing, proposals, and professional development. Factor into your hourly rate calculation.' },
        { label: 'Rate Review Cycle', value: 'Evaluate rates every 6-12 months. Increase 5-10% annually for inflation, experience, and improved skills.' },
        { label: 'Emergency Fund Target', value: 'Maintain 3-6 months of gross revenue as cash buffer for slow periods, client gaps, or unexpected business expenses.' },
      ]
    }
  },
  description: 'Calculate net income from billable hours after deducting overhead costs and taxes. Essential for freelancers and consultants to determine true take-home pay and set optimal billing rates.',
  formula: 'Net = (Rate × Hours) × (1 - Overhead%) × (1 - Tax%)',
  interpretation: 'Freelancers should bill at 2-3× desired hourly wage to cover overhead, taxes, and non-billable time. Track all hours in 6-min (0.1 hr) increments. A healthy freelance business keeps overhead below 30% and effective tax rate below 30%.'
}

export default calcDef

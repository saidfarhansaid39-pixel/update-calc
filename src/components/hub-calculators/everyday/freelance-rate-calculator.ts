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
  compute: (v) => {
    const totalHours = v.billableDaysPerYear * v.hoursPerDay
    const totalNeeded = v.desiredSalary + v.businessExpenses
    const withProfit = totalNeeded * (1 + v.profitMargin / 100)
    const rate = withProfit / totalHours
    return { result: rate, label: 'Hourly Rate', unit: '$/hr', steps: [{ label: 'Total Hours', value: `${totalHours} hrs/year` }, { label: 'Income + Expenses', value: `$${totalNeeded.toFixed(0)}` }, { label: 'With Profit Margin', value: `$${withProfit.toFixed(0)}` }, { label: 'Hourly Rate Needed', value: `$${rate.toFixed(2)}/hr` }] }
  },
  description: 'Compute your freelance hourly rate factoring in desired salary, billable days, business expenses, and profit margin.',
  formula: 'Rate = (Salary + Expenses) × (1 + Profit%) / (Days × Hours/Day)',
  interpretation: 'Typical billable days: 220-230 per year (accounting for holidays, sick days, and non-billable work). A rate of $75-150/hr is common for experienced freelancers.'
}

export default calcDef

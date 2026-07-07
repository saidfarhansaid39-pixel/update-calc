import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualIncomeGoal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), billableWeeks: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerWeekBillable: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), overheadPercent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxRatePercent: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'annualIncomeGoal', label: 'Annual Income Goal ($)', type: 'number', min: 10000, step: '5000' },
    { name: 'billableWeeks', label: 'Billable Weeks per Year', type: 'number', min: 1, max: 52, step: '1' },
    { name: 'hoursPerWeekBillable', label: 'Billable Hours per Week', type: 'number', min: 1, step: '1' },
    { name: 'overheadPercent', label: 'Overhead (% of Revenue)', type: 'number', min: 0, max: 60, step: '5' },
    { name: 'taxRatePercent', label: 'Tax Rate (%)', type: 'number', min: 0, max: 50, step: '1' },
  ],
  compute: (v) => {
    const totalBillableHours = v.billableWeeks * v.hoursPerWeekBillable
    const revenueNeeded = v.annualIncomeGoal / (1 - v.taxRatePercent / 100) / (1 - v.overheadPercent / 100)
    const hourlyRate = revenueNeeded / totalBillableHours
    return { result: hourlyRate, label: 'Minimum Hourly Rate', unit: '$/hr', steps: [{ label: 'Billable Hours/Year', value: `${totalBillableHours}` }, { label: 'Revenue Needed', value: `$${revenueNeeded.toFixed(0)}` }, { label: 'Hourly Rate', value: `$${hourlyRate.toFixed(2)}/hr` }] }
  },
  description: 'Calculate your freelance hourly rate based on income goals, billable hours, overhead, and taxes. Ensure your rate covers all costs.',
  formula: 'Rate = Income Goal / (1 - Tax%) / (1 - Overhead%) / (Billable Weeks × Hours/Week)',
  interpretation: 'Freelancers should bill 2-3× their desired hourly wage. Only 50-70% of working hours are billable. Non-billable time includes admin, marketing, and professional development.'
}

export default calcDef

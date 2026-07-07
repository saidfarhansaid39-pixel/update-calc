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
  compute: (v) => {
    const grossRevenue = v.hourlyRate * v.totalHours
    const overheadCost = grossRevenue * (v.overhead / 100)
    const netBeforeTax = grossRevenue - overheadCost
    const taxes = netBeforeTax * (v.taxRate / 100)
    const netIncome = netBeforeTax - taxes
    return { result: netIncome, label: 'Net Income', unit: '$', steps: [{ label: 'Gross Revenue', value: `$${grossRevenue.toFixed(2)}` }, { label: 'Overhead', value: `-$${overheadCost.toFixed(2)}` }, { label: 'Taxes', value: `-$${taxes.toFixed(2)}` }, { label: 'Net Income', value: `$${netIncome.toFixed(2)}` }] }
  },
  description: 'Calculate net income from billable hours after deducting overhead costs and taxes. Essential for freelancers and consultants.',
  formula: 'Net = (Rate × Hours) × (1 - Overhead%) × (1 - Tax%)',
  interpretation: 'Freelancers should bill at 2-3× desired hourly wage to cover overhead, taxes, and non-billable time. Track all hours in 6-min (0.1 hr) increments.'
}

export default calcDef

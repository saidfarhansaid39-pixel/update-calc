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
  compute: (v) => {
    const totalMonthly = v.gymMonthlyFee + v.annualFee / 12 + v.commuteCostMonthly
    const costPerVisit = totalMonthly / v.visitsPerMonth
    const annualTotal = totalMonthly * 12
    return { result: costPerVisit, label: 'Cost per Visit', unit: '$', steps: [{ label: 'Monthly Membership', value: `$${v.gymMonthlyFee.toFixed(2)}` }, { label: 'Annual Fee (monthly)', value: `$${(v.annualFee / 12).toFixed(2)}` }, { label: 'Commute', value: `$${v.commuteCostMonthly.toFixed(2)}` }, { label: 'Total Monthly', value: `$${totalMonthly.toFixed(2)}` }, { label: 'Cost per Visit', value: `$${costPerVisit.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] }
  },
  description: 'Calculate the true cost per visit of a gym membership including monthly fees, annual fees, and commute costs.',
  formula: 'Cost/Visit = (Monthly + Annual/12 + Commute) / Visits | Annual = Monthly×12 + Annual Fee',
  interpretation: 'A $50/month gym visited 10×/month costs $5/visit. Home gyms can cost $300-3000 upfront but pay for themselves in 1-2 years. Bodyweight workouts are free.'
}

export default calcDef

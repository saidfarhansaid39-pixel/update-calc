import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ income: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'), monthlyDebts: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'), rentRatio: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0') }),
  fields: [
    { name: 'income', label: 'Monthly Gross Income ($)', type: 'number', min: 1000, step: '100' },
    { name: 'monthlyDebts', label: 'Monthly Debt Payments ($)', type: 'number', min: 0, step: '50' },
    { name: 'rentRatio', label: 'Max Rent % of Income', type: 'number', min: 10, max: 50, step: '5' },
  ],
  compute: (v) => {
    const maxRent = v.income * (v.rentRatio / 100)
    const remainingAfterDebts = maxRent - v.monthlyDebts
    const safeRent = Math.max(0, remainingAfterDebts)
    return { result: safeRent, label: 'Affordable Rent', unit: '$', steps: [{ label: 'Max Rent (30% rule)', value: `$${maxRent.toFixed(0)}` }, { label: 'After Debts', value: `$${safeRent.toFixed(0)}` }, { label: 'Annual Income Needed', value: `$${(v.income * 12).toFixed(0)}` }] }
  },
  description: 'Determine how much rent you can afford based on your monthly income, existing debts, and desired rent-to-income ratio.',
  formula: 'Affordable Rent = Income × (Rent%/100) - Monthly Debts',
  interpretation: 'The 30% rule: spend no more than 30% of gross income on rent. Landlords typically require rent ≤ 30% of income and a credit score of 620+.'
}

export default calcDef
